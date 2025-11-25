import type { Response } from 'express'
import type { AuthenticatedRequest } from '../middleware/auth/auth.middleware.ts'
import { db } from '../db/connection.ts'
import { habits, entries, habitTags, tags } from '../db/schema.ts'
import { eq, and, desc, inArray } from 'drizzle-orm'

export const createHabit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description, frequency, targetCount, tagIds } = req.body
    const userId = req.user.id

    // we use a db transaction here to ensure that all data is created together
    // otherwise the db is rolled back to its previous state in case of an error
    const habit = await db.transaction(async (tx) => {
      const [newHabit] = await tx
        .insert(habits)
        .values({ userId, name, description, frequency, targetCount })
        .returning()

      if (tagIds && tagIds.length > 0) {
        const habitTagValues = tagIds.map((tagId: number) => ({
          habitId: newHabit.id,
          tagId,
        }))
        await tx.insert(habitTags).values(habitTagValues)
      }

      return newHabit
    })

    return res
      .status(201)
      .json({ message: 'Habit created successfully', habit })
  } catch (error) {
    console.error('Error creating habit:', error)
    return res.status(500).json({ error: 'Failed to create habit' })
  }
}

export const getHabits = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userHabitsWithTags = await db.query.habits.findMany({
      where: eq(habits.userId, req.user.id),
      with: {
        habitTags: {
          with: { tag: true },
        },
      },
      orderBy: [desc(habits.createdAt)],
    })

    // this generally should be done on the db side with a join, but for simplicity we do it here
    const habitsWithTags = userHabitsWithTags.map((habit) => ({
      ...habit,
      tags: habit.habitTags.map((habitTag) => habitTag.tag),
      habitTags: undefined, // remove habitTags to avoid redundancy
    }))

    return res.json(habitsWithTags)
  } catch (error) {
    console.error('Error fetching habit:', error)
    return res.status(500).json({ error: 'Failed to fetch habit' })
  }
}

export const getHabit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const habit = await db.query.habits.findFirst({
      where: and(eq(habits.id, id), eq(habits.userId, userId)),
      with: {
        habitTags: {
          with: { tag: true },
        },
      },
    })

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' })
    }

    const habitWithTags = {
      ...habit,
      tags: habit.habitTags.map((habitTag) => habitTag.tag),
      habitTags: undefined,
    }

    return res.json(habitWithTags)
  } catch (error) {
    console.error('Error fetching habit:', error)
    return res.status(500).json({ error: 'Failed to fetch habit' })
  }
}

export const updateHabit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const { tagIds, ...updates } = req.body
    const userId = req.user.id

    const habit = await db.transaction(async (tx) => {
      const [updatedHabit] = await tx
        .update(habits)
        .set({ ...updates, updatedAt: new Date() })
        .where(
          and(eq(habits.id, id), eq(habits.userId, userId)) // user can only update a habit if it belongs to them
        )
        .returning()

      if (!updatedHabit) {
        throw new Error('Habit not found')
      }

      if (tagIds !== undefined) {
        await tx.delete(habitTags).where(eq(habitTags.habitId, id))

        if (tagIds.length > 0) {
          const habitTagValues = tagIds.map((tagId: number) => ({
            habitId: id,
            tagId,
          }))

          await tx.insert(habitTags).values(habitTagValues)
        }
      }

      return updatedHabit
    })

    return res.json({ message: 'Habit updated successfully', habit })
  } catch (error) {
    console.error('Error updating habit:', error)
    if (error.message === 'Habit not found') {
      return res.status(404).json({ error: 'Habit not found' })
    }
    return res.status(500).json({ error: 'Failed to update habit' })
  }
}

export const deleteHabit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const [deletedHabit] = await db
      .delete(habits)
      .where(and(eq(habits.id, id), eq(habits.userId, userId)))
      .returning()

    if (!deletedHabit) {
      return res.status(404).json({ error: 'Habit not found' })
    }

    return res.json({ message: 'Habit deleted successfully' })
  } catch (error) {
    console.error('Error deleting habit:', error)
    return res.status(500).json({ error: 'Failed to delete habit' })
  }
}
