'use client'

import { useState, useEffect } from 'react'
import { Habit, HabitCategory, HabitDifficulty, User } from '../types/habit'
import HabitForm from './HabitForm'
import HabitList from './HabitList'
import UserLevel from './UserLevel'
import { getHabits, addHabit, updateHabit, getUser, updateUser, createUser, deleteHabit, editHabit } from '../lib/api'
import { supabase } from '../lib/supabase'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        fetchUserData(session.user.id)
      } else {
        setLoading(false)
      }
    }

    fetchSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserData(session.user.id)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setHabits([])
        setLoading(false)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const fetchUserData = async (userId: string) => {
    setLoading(true)
    setError(null)
    try {
      let fetchedUser = await getUser(userId)
      if (!fetchedUser) {
        console.log('User not found, attempting to create new user')
        fetchedUser = await createUser(userId)
      }
      setUser(fetchedUser)
      const fetchedHabits = await getHabits(userId)
      setHabits(fetchedHabits)
    } catch (err) {
      console.error('Error in fetchUserData:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred while fetching user data')
    } finally {
      setLoading(false)
    }
  }

  const handleAddHabit = async (name: string, category: HabitCategory, difficulty: HabitDifficulty) => {
    if (!user) return

    try {
      const newHabit: Omit<Habit, 'id'> = {
        user_id: user.id,
        name,
        category,
        difficulty,
        dates: [],
      }

      const addedHabit = await addHabit(newHabit)
      setHabits([...habits, addedHabit])
    } catch (err) {
      console.error('Error adding habit:', err)
      setError(err instanceof Error ? err.message : 'Failed to add habit')
    }
  }

  const handleEditHabit = async (editedHabit: Habit) => {
    try {
      const updatedHabit = await editHabit(editedHabit)
      setHabits(habits.map(h => h.id === updatedHabit.id ? updatedHabit : h))
    } catch (err) {
      console.error('Error editing habit:', err)
      setError(err instanceof Error ? err.message : 'Failed to edit habit')
    }
  }

  const handleDeleteHabit = async (habitId: string) => {
    try {
      await deleteHabit(habitId)
      setHabits(habits.filter(h => h.id !== habitId))
    } catch (err) {
      console.error('Error deleting habit:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete habit')
    }
  }

  const handleToggleHabitDate = async (habitId: string, date: string) => {
    if (!user) return

    try {
      const habit = habits.find((h) => h.id === habitId)
      if (!habit) return

      const isCompleting = !habit.dates.includes(date)
      const updatedDates = isCompleting
        ? [...habit.dates, date]
        : habit.dates.filter((d) => d !== date)

      const updatedHabit = { ...habit, dates: updatedDates }
      const result = await updateHabit(updatedHabit)

      setHabits(habits.map((h) => (h.id === habitId ? result : h)))
      await updateUserExperience(habit.difficulty, isCompleting)
    } catch (err) {
      console.error('Error toggling habit date:', err)
      setError(err instanceof Error ? err.message : 'Failed to update habit')
    }
  }

  const updateUserExperience = async (difficulty: HabitDifficulty, isCompleting: boolean) => {
    if (!user) return

    try {
      let expChange = 0
      switch (difficulty) {
        case 'Easy':
          expChange = 5
          break
        case 'Medium':
          expChange = 10
          break
        case 'Hard':
          expChange = 20
          break
      }

      if (!isCompleting) {
        expChange = -expChange
      }

      const newExperience = Math.max(0, user.experience + expChange)
      const experienceToNextLevel = user.level * 100

      let updatedUser: User

      if (newExperience >= experienceToNextLevel) {
        updatedUser = {
          ...user,
          level: user.level + 1,
          experience: newExperience - experienceToNextLevel,
        }
      } else if (newExperience < 0 && user.level > 1) {
        updatedUser = {
          ...user,
          level: user.level - 1,
          experience: 100 + newExperience,
        }
      } else {
        updatedUser = {
          ...user,
          experience: newExperience,
        }
      }

      const result = await updateUser(updatedUser)
      setUser(result)
    } catch (err) {
      console.error('Error updating user experience:', err)
      setError(err instanceof Error ? err.message : 'Failed to update user experience')
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Error signing out:', err)
      setError(err instanceof Error ? err.message : 'Failed to sign out')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen">Error: {error}</div>
  }

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Please sign in to use the Habit Tracker.</div>
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Habit Tracker</span>
            <span className="block text-blue-600">Build Better Habits</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            It takes only 21 days of consistency to build a habit, Try it !
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <UserLevel level={user.level} experience={user.experience} />
          <Button onClick={handleSignOut} variant="outline">Sign Out</Button>
        </div>
        
        <HabitForm onAddHabit={handleAddHabit} />
        
        <HabitList 
          habits={habits} 
          onToggleDate={handleToggleHabitDate}
          onEditHabit={handleEditHabit}
          onDeleteHabit={handleDeleteHabit}
        />
      </div>
      <footer className="mt-12 text-center text-gray-400 text-xs">
        Developed by Rahul Kharapkar
      </footer>
    </motion.div>
  )
}

