import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HabitCategory, HabitDifficulty } from '../types/habit'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface HabitFormProps {
  onAddHabit: (name: string, category: HabitCategory, difficulty: HabitDifficulty) => void
}

export default function HabitForm({ onAddHabit }: HabitFormProps) {
  const [habitName, setHabitName] = useState('')
  const [category, setCategory] = useState<HabitCategory>('Other')
  const [difficulty, setDifficulty] = useState<HabitDifficulty>('Medium')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (habitName.trim()) {
      onAddHabit(habitName.trim(), category, difficulty)
      setHabitName('')
      setCategory('Other')
      setDifficulty('Medium')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Add New Habit</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="text"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              placeholder="Enter a new habit"
              className="flex-grow"
            />
            <Button type="submit" className="w-full sm:w-auto">Add Habit</Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={category} onValueChange={(value: HabitCategory) => setCategory(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Productivity">Productivity</SelectItem>
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Fitness">Fitness</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={difficulty} onValueChange={(value: HabitDifficulty) => setDifficulty(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

