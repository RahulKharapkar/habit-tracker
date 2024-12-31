import { supabase } from './supabase'
import { Habit, User } from '../types/habit'

export async function getHabits(userId: string): Promise<Habit[]> {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching habits:', error)
    throw new Error(`Failed to fetch habits: ${error.message}`)
  }

  return data || []
}

export async function addHabit(habit: Omit<Habit, 'id'>): Promise<Habit> {
  const { data, error } = await supabase
    .from('habits')
    .insert(habit)
    .select()
    .single()

  if (error) {
    console.error('Error adding habit:', error)
    throw new Error(`Failed to add habit: ${error.message}`)
  }

  if (!data) {
    throw new Error('No data returned when adding habit')
  }

  return data
}

export async function updateHabit(habit: Habit): Promise<Habit> {
  const { data, error } = await supabase
    .from('habits')
    .update(habit)
    .eq('id', habit.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating habit:', error)
    throw new Error(`Failed to update habit: ${error.message}`)
  }

  if (!data) {
    throw new Error('No data returned when updating habit')
  }

  return data
}

export async function editHabit(habit: Habit): Promise<Habit> {
  const { data, error } = await supabase
    .from('habits')
    .update(habit)
    .eq('id', habit.id)
    .select()
    .single()

  if (error) {
    console.error('Error editing habit:', error)
    throw new Error(`Failed to edit habit: ${error.message}`)
  }

  if (!data) {
    throw new Error('No data returned when editing habit')
  }

  return data
}

export async function deleteHabit(habitId: string): Promise<void> {
  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', habitId)

  if (error) {
    console.error('Error deleting habit:', error)
    throw new Error(`Failed to delete habit: ${error.message}`)
  }
}

export async function getUser(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // User not found
      return null
    }
    console.error('Error fetching user:', error)
    throw new Error(`Failed to fetch user: ${error.message}`)
  }

  return data
}

export async function createUser(userId: string): Promise<User> {
  const newUser: User = {
    id: userId,
    level: 1,
    experience: 0,
  }

  const { data, error } = await supabase
    .from('users')
    .insert(newUser)
    .select()
    .single()

  if (error) {
    console.error('Error creating user:', error)
    if (error.code === 'PGRST301') {
      // RLS error, user might already exist
      const existingUser = await getUser(userId)
      if (existingUser) {
        return existingUser
      }
    }
    throw new Error(`Failed to create user: ${error.message}`)
  }

  if (!data) {
    throw new Error('No data returned when creating user')
  }

  return data
}

export async function updateUser(user: User): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .update(user)
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating user:', error)
    throw new Error(`Failed to update user: ${error.message}`)
  }

  if (!data) {
    throw new Error('No data returned when updating user')
  }

  return data
}

