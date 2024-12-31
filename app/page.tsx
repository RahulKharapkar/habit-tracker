'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import HabitTracker from '../components/HabitTracker'
import Auth from '../components/Auth'

export default function Home() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setLoading(false)
    }

    fetchSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-8 flex justify-center items-center">
      {!session ? <Auth /> : <HabitTracker />}
    </main>
  )
}

