import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"

interface UserLevelProps {
  level: number;
  experience: number;
}

export default function UserLevel({ level, experience }: UserLevelProps) {
  const experienceToNextLevel = level * 100
  const progressPercentage = Math.max(0, Math.min(100, (experience / experienceToNextLevel) * 100))

  return (
    <Card className="w-full sm:max-w-xs">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-2xl font-bold">Level {level}</span>
          <span className="text-sm text-muted-foreground">{Math.max(0, experience)} / {experienceToNextLevel} XP</span>
        </div>
        <Progress value={progressPercentage} className="w-full h-2" />
      </CardContent>
    </Card>
  )
}

