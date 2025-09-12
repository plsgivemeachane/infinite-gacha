"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, Zap } from "lucide-react"

interface RarityProgressionTrackerProps {
  currentRarity: number
  nextRarityThreshold: number
  progress: number
  recentAchievements: string[]
}

export function RarityProgressionTracker({
  currentRarity,
  nextRarityThreshold,
  progress,
  recentAchievements,
}: RarityProgressionTrackerProps) {
  return (
    <Card className="p-4 bg-card/50 backdrop-blur-sm border border-border/30">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20">
          <Target className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Progression Tracker</h3>
          <p className="text-sm text-muted-foreground">
            Level {currentRarity} → {nextRarityThreshold}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress to Next Level</span>
            <span className="text-foreground font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {recentAchievements.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              Recent Achievements
            </h4>
            <div className="space-y-1">
              {recentAchievements.slice(0, 3).map((achievement, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-primary/10 border-primary/30 mr-2 mb-1">
                  <Zap className="w-3 h-3 mr-1" />
                  {achievement}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
