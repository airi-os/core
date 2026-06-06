import { env } from 'node:process'

import { drizzle } from 'drizzle-orm/node-postgres'

import * as schema from './schema'

let db: ReturnType<typeof initDb>

export function initDb() {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return drizzle(env.DATABASE_URL!, { schema })
}

export function useDrizzle() {
  if (!db)
    db = initDb()

  return db
}
