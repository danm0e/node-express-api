import { db, users, habits, entries, tags, habitTags } from '@/db'
import { sql } from 'drizzle-orm'
import { execSync } from 'child_process'

const setUpTests = async () => {
  console.log('🧪 Setting up test database...')

  try {
    await db.execute(sql`DROP TABLE IF EXISTS ${entries} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${habits} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${users} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${tags} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${habitTags} CASCADE`)

    console.log('🚀 Pushing schema using drizzle kit...')

    execSync(
      `npx drizzle-kit push --url="${process.env.DATABASE_URL}" --schema="./src/db/schema.ts" --dialect="postgresql"`,
      { stdio: 'inherit', cwd: process.cwd() }
    )

    console.log('✅ Test database setup complete.')
  } catch (error) {
    console.error('❌ Error setting up test database:', error)
    throw error
  }

  return async () => {
    console.log('🧹 Tearing down test database...')
    try {
      await db.execute(sql`DROP TABLE IF EXISTS ${entries} CASCADE`)
      await db.execute(sql`DROP TABLE IF EXISTS ${habits} CASCADE`)
      await db.execute(sql`DROP TABLE IF EXISTS ${users} CASCADE`)
      await db.execute(sql`DROP TABLE IF EXISTS ${tags} CASCADE`)
      await db.execute(sql`DROP TABLE IF EXISTS ${habitTags} CASCADE`)

      process.exit(0)
    } catch (error) {
      console.error('❌ Error tearing down test database:', error)
      throw error
    }
  }
}

export default setUpTests
