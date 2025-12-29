import os
import time
import traceback
import json
import uuid
import urllib.request
import urllib.error
from datetime import datetime, timezone

from supabase import create_client


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

def utc_now_dt() -> datetime:
    return datetime.now(timezone.utc)


FIREFLIES_GRAPHQL_URL = "https://api.fireflies.ai/graphql"


def fireflies_graphql(api_key: str, query: str, variables: dict | None = None) -> dict:
    payload = {"query": query, "variables": variables or {}}
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        FIREFLIES_GRAPHQL_URL,
        data=body,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            raw = resp.read().decode("utf-8")
            data = json.loads(raw)
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"Fireflies HTTP error: {e.code} {e.reason}") from e
    except Exception as e:
        raise RuntimeError(f"Fireflies request failed: {e}") from e

    if "errors" in data and data["errors"]:
        messages = "; ".join(err.get("message", "Unknown error") for err in data["errors"])
        raise RuntimeError(f"Fireflies GraphQL error: {messages}")

    return data.get("data") or {}


def to_iso_datetime_from_fireflies(value: float | int | None) -> str:
    if value is None:
        return utc_now_dt().isoformat()
    ts = float(value)
    # Fireflies `date` is a Float; treat big values as milliseconds.
    if ts > 1_000_000_000_000:
        ts = ts / 1000.0
    return datetime.fromtimestamp(ts, tz=timezone.utc).isoformat()


def summary_to_text(summary_obj: dict | None) -> str | None:
    if not summary_obj:
        return None
    for key in ("short_summary", "overview", "gist", "notes"):
        v = summary_obj.get(key)
        if isinstance(v, str) and v.strip():
            return v.strip()
    return None


def sync_fireflies_all(supabase, fireflies_api_key: str) -> int:
    print("Syncing all Fireflies transcripts...")
    total_upserted = 0

    query = """
      query Transcripts($limit: Int, $skip: Int) {
        transcripts(limit: $limit, skip: $skip) {
          id
          title
          date
          participants
          transcript_url
          organizer_email
          host_email
          summary {
            short_summary
            overview
            gist
          }
        }
      }
    """

    limit = 50
    skip = 0

    while True:
        data = fireflies_graphql(fireflies_api_key, query, {"limit": limit, "skip": skip})
        transcripts = data.get("transcripts") or []
        if not transcripts:
            break

        transcript_ids = [t.get("id") for t in transcripts if t.get("id")]

        existing_map: dict[str, str] = {}
        if transcript_ids:
            existing = (
                supabase.table("meetings")
                .select("id, fireflies_meeting_id")
                .in_("fireflies_meeting_id", transcript_ids)
                .execute()
            )
            for row in existing.data or []:
                existing_map[row["fireflies_meeting_id"]] = row["id"]

        now_iso = utc_now_iso()
        rows = []
        for t in transcripts:
            fireflies_id = t.get("id")
            if not fireflies_id:
                continue

            meeting_id = existing_map.get(fireflies_id) or str(uuid.uuid4())
            rows.append(
                {
                    "id": meeting_id,
                    "fireflies_meeting_id": fireflies_id,
                    "title": (t.get("title") or "Untitled").strip(),
                    "date_time": to_iso_datetime_from_fireflies(t.get("date")),
                    "participants": t.get("participants") or [],
                    "kam_participated": True,
                    "transcript_url": t.get("transcript_url"),
                    "summary": summary_to_text(t.get("summary")),
                    "status": "processed",
                    "updated_at": now_iso,
                }
            )

        if rows:
            supabase.table("meetings").upsert(rows, on_conflict="fireflies_meeting_id").execute()
            total_upserted += len(rows)

        skip += limit

    print(f"Fireflies sync complete. Upserted {total_upserted} meetings.")
    return total_upserted


def main() -> None:
    supabase_url = os.environ["SUPABASE_URL"]
    supabase_service_role_key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
    fireflies_api_key = os.environ.get("FIREFLIES_API_KEY", "").strip()

    supabase = create_client(supabase_url, supabase_service_role_key)

    print("Worker started. Polling job_queue every 5 seconds...")

    while True:
        job_id = None
        try:
            res = (
                supabase.table("job_queue")
                .select("*")
                .eq("status", "PENDING")
                .order("created_at")
                .limit(1)
                .execute()
            )

            jobs = res.data or []
            if not jobs:
                time.sleep(5)
                continue

            job = jobs[0]
            job_id = job["id"]
            job_type = job.get("type")

            print(f"Processing job... id={job_id} type={job_type}")

            supabase.table("job_queue").update(
                {"status": "PROCESSING", "updated_at": utc_now_iso()}
            ).eq("id", job_id).execute()

            if job_type == "SYNC_FIREFLIES_ALL":
                if not fireflies_api_key:
                    raise RuntimeError("Missing FIREFLIES_API_KEY for SYNC_FIREFLIES_ALL job")
                sync_fireflies_all(supabase, fireflies_api_key)
            else:
                time.sleep(2)
                print("Generating Agenda...")

            supabase.table("job_queue").update(
                {"status": "COMPLETED", "updated_at": utc_now_iso()}
            ).eq("id", job_id).execute()

        except Exception as exc:
            print(f"Job failed: {exc}")
            traceback.print_exc()
            if job_id is not None:
                try:
                    supabase.table("job_queue").update(
                        {"status": "FAILED", "updated_at": utc_now_iso()}
                    ).eq("id", job_id).execute()
                except Exception:
                    traceback.print_exc()

            time.sleep(5)


if __name__ == "__main__":
    main()
