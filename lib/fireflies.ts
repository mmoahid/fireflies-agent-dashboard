import "server-only"

import { envIntegrations } from "@/lib/env"

const FIREFLIES_GRAPHQL_URL = "https://api.fireflies.ai/graphql"

type GraphQLError = { message: string }

async function firefliesGraphQL<TData>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<TData> {
  const { FIREFLIES_API_KEY } = envIntegrations()

  const res = await fetch(FIREFLIES_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${FIREFLIES_API_KEY}`,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  })

  if (!res.ok) throw new Error(`Fireflies request failed: ${res.status} ${res.statusText}`)

  const json = (await res.json()) as { data?: TData; errors?: GraphQLError[] }
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join("; "))
  if (!json.data) throw new Error("Fireflies response missing data")

  return json.data
}

export async function firefliesPing() {
  const data = await firefliesGraphQL<{ user: { id: string; email: string } }>(/* GraphQL */ `
    query Ping {
      user {
        id
        email
      }
    }
  `)

  return data.user
}
