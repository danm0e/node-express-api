import { db } from './connection.ts'
import { users, habits, entries, tags, habitTags } from './schema.ts'

const seed = async () => {
  console.log('🌱 Seeding database...\n')

  try {
    console.log('💀 Clearing existing data...')
    await db.delete(entries)
    await db.delete(habitTags)
    await db.delete(habits)
    await db.delete(tags)
    await db.delete(users)

    console.log('👫 Creating demo users...')
    const [demoUser] = await db
      .insert(users)
      .values({
        username: 'demo_user',
        email: 'demo_user@example.com',
        password: 'password123',
        firstName: 'Demo',
        lastName: 'User',
      })
      .returning()

    console.log('🏷️  Creating demo tags...')
    const [demoHealthTag] = await db
      .insert(tags)
      .values({ name: 'Health', color: '#34D399' })
      .returning()

    const [demoHabit] = await db
      .insert(habits)
      .values({
        userId: demoUser.id,
        name: 'Morning Jog',
        description: 'Jog for 30 minutes every morning',
        frequency: 'Daily',
        targetCount: 1,
      })
      .returning()

    await db.insert(habitTags).values({
      habitId: demoHabit.id,
      tagId: demoHealthTag.id,
    })

    console.log('📝 Creating demo entries...\n')
    const today = new Date()
    today.setHours(12, 0, 0, 0)

    for (let i = 1; i <= 5; i++) {
      const entryDate = new Date(today)
      entryDate.setDate(today.getDate() - i)

      await db.insert(entries).values({
        habitId: demoHabit.id,
        completionDate: entryDate,
        note: `Completed morning jog on ${entryDate.toDateString()}`,
      })
    }

    console.log('✅ Database seeding completed successfully!')
    console.table({ Email: demoUser.email, Password: demoUser.password })
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seed().then(() => process.exit(0))
}

export default seed
