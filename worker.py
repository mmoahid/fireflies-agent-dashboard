import os
import time
import traceback
from datetime import datetime, timezone

from supabase import create_client


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def main() -> None:
    supabase_url = os.environ["SUPABASE_URL"]
    supabase_service_role_key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

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

            print(f"Processing job... id={job_id} type={job.get('type')}")

            supabase.table("job_queue").update(
                {"status": "PROCESSING", "updated_at": utc_now_iso()}
            ).eq("id", job_id).execute()

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

