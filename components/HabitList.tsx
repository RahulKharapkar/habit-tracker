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
    <Card className="w-full">
      <CardHeader className="border-b">
        <CardTitle className="text-2xl font-bold text-center">Your Habits</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 max-w-[1600px] mx-auto">
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