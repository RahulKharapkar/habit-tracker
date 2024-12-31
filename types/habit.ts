export type HabitCategory = 'Health' | 'Productivity' | 'Personal' | 'Fitness' | 'Other'
export type HabitDifficulty = 'Easy' | 'Medium' | 'Hard'

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  category: HabitCategory;
  difficulty: HabitDifficulty;
  dates: string[];
}

export interface User {
  id: string;
  level: number;
  experience: number;
}

