import { Habit, User } from '../types/habit'

export function getStoredHabits(): Habit[] {
  const storedHabits = localStorage.getItem('habits')
  return storedHabits ? JSON.parse(storedHabits) : []
}

export function setStoredHabits(habits: Habit[]): void {
  localStorage.setItem('habits', JSON.stringify(habits))
}

export function getStoredUser(): User {
  const storedUser = localStorage.getItem('user')
  return storedUser ? JSON.parse(storedUser) : { level: 1, experience: 0 }
}

export function setStoredUser(user: User): void {
  localStorage.setItem('user', JSON.stringify(user))
}

