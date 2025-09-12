"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GameAPI, type LeaderboardEntry } from "@/lib/api"
import { Trophy, Crown, Medal, Star, RefreshCw, Users } from "lucide-react"

interface LeaderboardProps {
  onClose?: () => void
}

export function Leaderboard({ onClose }: LeaderboardProps) {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadLeaderboard = async () => {
    try {
      console.log("[v0] Loading leaderboard data...")
      const data = await GameAPI.getLeaderboard()
      console.log("[v0] Leaderboard loaded:", data)
      setLeaderboardData(data)
    } catch (error) {
      console.error("[v0] Failed to load leaderboard:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadLeaderboard()
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-5 h-5 text-yellow-400" />
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 2:
        return <Medal className="w-5 h-5 text-amber-600" />
      default:
        return <Star className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getRankBadgeColor = (index: number) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
      case 1:
        return "bg-gradient-to-r from-gray-400 to-gray-600 text-white"
      case 2:
        return "bg-gradient-to-r from-amber-500 to-amber-700 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getRarityGradient = (rarityLevel: number) => {
    const gradients = [
      "from-gray-400 to-gray-600",
      "from-blue-400 to-blue-600",
      "from-purple-400 to-purple-600",
      "from-yellow-400 via-pink-500 to-purple-600",
      "from-cyan-400 via-purple-500 to-pink-600",
      "from-emerald-400 via-cyan-500 to-blue-600",
      "from-rose-400 via-purple-500 to-indigo-600",
      "from-amber-400 via-orange-500 to-red-600",
    ]
    return gradients[Math.min(rarityLevel, gradients.length - 1)] || gradients[gradients.length - 1]
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading cosmic leaderboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-500/20 to-purple-500/20">
            <Trophy className="w-8 h-8 text-yellow-400" />
          </div>
          <h1 className="text-5xl font-bold text-foreground text-balance">Cosmic Leaderboard</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
          The greatest explorers of the infinite void, ranked by their highest rarity discoveries. First discoverers of
          new rarity levels earn eternal glory.
        </p>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{leaderboardData.length} Cosmic Explorers</span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-card/50 border-border/30 hover:bg-primary/10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          {onClose && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="bg-card/50 border-border/30 hover:bg-primary/10"
            >
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="space-y-3">
        {leaderboardData.map((entry, index) => (
          <Card
            key={entry.playerId}
            className={`
              p-4 transition-all duration-300 hover:scale-[1.02] border
              ${index < 3 ? "bg-card/70 border-primary/30 shadow-lg" : "bg-card/50 border-border/30"}
              ${index === 0 ? "ring-2 ring-yellow-400/30" : ""}
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="flex items-center gap-2">
                  {getRankIcon(index)}
                  <Badge className={`${getRankBadgeColor(index)} font-bold min-w-[2rem] justify-center`}>
                    #{index + 1}
                  </Badge>
                </div>

                {/* Player Info */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{entry.playerName}</h3>
                    {entry.isFirstDiscoverer && (
                      <Badge variant="outline" className="text-xs bg-primary/10 border-primary/30">
                        <Star className="w-3 h-3 mr-1" />
                        First Discoverer
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Achieved on {new Date(entry.achievedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Rarity Achievement */}
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${getRarityGradient(entry.highestRarity)}`} />
                  <span className="font-semibold text-foreground">{entry.rarityName}</span>
                </div>
                <p className="text-sm text-muted-foreground">Level {entry.highestRarity}</p>
              </div>
            </div>

            {/* Special highlighting for top 3 */}
            {index < 3 && (
              <div className="mt-3 pt-3 border-t border-border/20">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {index === 0 && "👑 Cosmic Champion"}
                    {index === 1 && "🥈 Void Master"}
                    {index === 2 && "🥉 Star Seeker"}
                  </span>
                  <span>Player ID: {entry.playerId}</span>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {leaderboardData.length === 0 && (
        <Card className="p-12 text-center bg-card/30 backdrop-blur-sm border border-border/20">
          <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Champions Yet</h3>
          <p className="text-muted-foreground">
            Be the first to reach into the void and claim your place among the cosmic legends.
          </p>
        </Card>
      )}
    </div>
  )
}
