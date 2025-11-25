import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema.ts'
import { env, isProd } from '@root/env'
import { remember } from '@epic-web/remember'
import type { DrizzleConfig } from 'drizzle-orm'

const createPool = () => {
  const pool = new Pool({ connectionString: env.DATABASE_URL })
  return pool
}

let client: any

isProd() ? (client = createPool()) : (client = remember('dbPool', createPool))

export const db = drizzle(client, { schema })
