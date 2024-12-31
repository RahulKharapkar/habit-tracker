import { Habit } from '../types/habit'
import HabitItem from './HabitItem'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface HabitListProps {
  habits: Habit[]
  onToggleDate: (habitId: string, date: string) => void
  onEditHabit: (habit: Habit) => void
  onDeleteHabit: (habitId: string) => void
}

export default function HabitList({ habits, onToggleDate, onEditHabit, onDeleteHabit }: HabitListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Your Habits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {habits.map((habit) => (
            <HabitItem 
              key={habit.id} 
              habit={habit} 
              onToggleDate={onToggleDate}
              onEditHabit={onEditHabit}
              onDeleteHabit={onDeleteHabit}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

