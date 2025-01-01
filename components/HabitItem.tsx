import { useState } from 'react'
import { Habit, HabitCategory, HabitDifficulty } from '../types/habit'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Pencil, Trash2 } from 'lucide-react'

interface HabitItemProps {
  habit: Habit
  onToggleDate: (habitId: string, date: string) => void
  onEditHabit: (habit: Habit) => void
  onDeleteHabit: (habitId: string) => void
}

export default function HabitItem({ habit, onToggleDate, onEditHabit, onDeleteHabit }: HabitItemProps) {
  const [currentDate] = useState(new Date())
  const [editedHabit, setEditedHabit] = useState(habit)

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month + 1, 0).getDate()
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const getStreak = () => {
    let streak = 0
    const sortedDates = habit.dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    const today = formatDate(currentDate)

    for (let i = 0; i < sortedDates.length; i++) {
      if (sortedDates[i] === today || new Date(sortedDates[i]) < new Date(today)) {
        streak++
      } else {
        break
      }
    }
    return streak
  }

  const renderDayButtons = (days: number) => {
    const buttons = []

    for (let i = 0; i < days; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i)
      const dateString = formatDate(date)
      const isCompleted = habit.dates.includes(dateString)

      buttons.push(
        <Button
          key={i}
          onClick={() => onToggleDate(habit.id, dateString)}
          variant={isCompleted ? 'default' : 'outline'}
          className="w-8 h-8 p-0"
        >
          {date.getDate()}
        </Button>
      )
    }

    return buttons.reverse()
  }

  const handleEdit = () => {
    onEditHabit(editedHabit)
  }

  const handleDelete = () => {
    onDeleteHabit(habit.id)
  }

  const getDifficultyColor = () => {
    switch (habit.difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'Hard':
        return 'bg-red-100 text-red-800'
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="space-y-4 pb-4">
        <div className="flex flex-col space-y-2">
          <CardTitle className="text-xl font-semibold line-clamp-1">{habit.name}</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-sm">{habit.category}</Badge>
            <Badge className={`text-sm ${getDifficultyColor()}`}>{habit.difficulty}</Badge>
          </div>
        </div>
        <div className="flex justify-end space-x-1">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Pencil className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Habit</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  value={editedHabit.name}
                  onChange={(e) => setEditedHabit({ ...editedHabit, name: e.target.value })}
                  placeholder="Habit name"
                />
                <Select
                  value={editedHabit.category}
                  onValueChange={(value: HabitCategory) => setEditedHabit({ ...editedHabit, category: value })}
                >
                  <SelectTrigger>
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
                <Select
                  value={editedHabit.difficulty}
                  onValueChange={(value: HabitDifficulty) => setEditedHabit({ ...editedHabit, difficulty: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleEdit} className="w-full">Save Changes</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="ghost" size="icon" onClick={handleDelete} className="h-8 w-8">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 flex-grow">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-semibold">Streak: {getStreak()} days</span>
        </div>
        <Tabs defaultValue="week" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
          <TabsContent value="week">
            <div className="grid grid-cols-7 gap-1.5">{renderDayButtons(7)}</div>
          </TabsContent>
          <TabsContent value="month">
            <div className="grid grid-cols-7 gap-1.5">{renderDayButtons(getDaysInMonth(currentDate))}</div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}