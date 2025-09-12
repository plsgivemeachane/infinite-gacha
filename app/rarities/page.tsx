"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Crown, Sparkles, Lock, Infinity } from "lucide-react"
import Link from "next/link"

interface RarityLevel {
  id: number
  name: string
  color: string
  gradient: string
  threshold: number
  discovered: boolean
  firstDiscoverer?: string
  discoveredAt?: string
  probability?: number
}

export default function RaritiesPage() {
  const [rarityLevels, setRarityLevels] = useState<RarityLevel[]>([])
  const [gameState, setGameState] = useState<any>(null)

  useEffect(() => {
    // Load game state
    fetch("/api/game-state")
      .then((res) => res.json())
      .then((data) => setGameState(data))
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (!gameState) return

    const generateAllRarityLevels = () => {
      const baseRarities = [
        { name: "Common", color: "gray", gradient: "from-gray-400 to-gray-600", threshold: 0, probability: 60 },
        { name: "Rare", color: "blue", gradient: "from-blue-400 to-blue-600", threshold: 1, probability: 25 },
        { name: "Epic", color: "purple", gradient: "from-purple-400 to-purple-600", threshold: 2, probability: 10 },
        {
          name: "Legendary",
          color: "yellow",
          gradient: "from-yellow-400 via-pink-500 to-purple-600",
          threshold: 3,
          probability: 4,
        },
      ]

      const transcendentNames = [
        "Mythical",
        "Celestial",
        "Divine",
        "Cosmic",
        "Ethereal",
        "Primordial",
        "Transcendent",
        "Omnipotent",
        "Infinite",
        "Absolute",
        "Universal",
        "Eternal",
      ]

      const transcendentGradients = [
        "from-cyan-400 via-purple-500 to-pink-600",
        "from-emerald-400 via-cyan-500 to-blue-600",
        "from-rose-400 via-purple-500 to-indigo-600",
        "from-amber-400 via-orange-500 to-red-600",
        "from-violet-400 via-purple-500 to-fuchsia-600",
        "from-teal-400 via-cyan-500 to-sky-600",
        "from-lime-400 via-green-500 to-emerald-600",
        "from-pink-400 via-rose-500 to-red-600",
      ]

      const levels: RarityLevel[] = [...baseRarities]

      // Generate all transcendent levels up to level 20
      for (let i = 4; i <= 20; i++) {
        const transcendentIndex = i - 4
        const nameIndex = transcendentIndex % transcendentNames.length
        const gradientIndex = transcendentIndex % transcendentGradients.length
        const tier = Math.floor(transcendentIndex / transcendentNames.length) + 1
        const probability = Math.max(0.01, 1 / Math.pow(2, i - 3)) // Exponentially decreasing probability

        levels.push({
          id: i,
          name: tier > 1 ? `${transcendentNames[nameIndex]} ${tier}` : transcendentNames[nameIndex],
          color: "transcendent",
          gradient: transcendentGradients[gradientIndex],
          threshold: i,
          discovered: i <= gameState.playerHighestRarity,
          probability: Number((probability * 100).toFixed(3)),
          firstDiscoverer: i <= gameState.playerHighestRarity ? `Player${Math.floor(Math.random() * 1000)}` : undefined,
          discoveredAt:
            i <= gameState.playerHighestRarity
              ? new Date(Date.now() - Math.random() * 86400000 * 30).toLocaleDateString()
              : undefined,
        })
      }

      return levels
    }

    setRarityLevels(generateAllRarityLevels())
  }, [gameState])

  if (!gameState) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Game
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20">
              <Infinity className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">All Rarity Levels</h1>
              <p className="text-muted-foreground">Complete rarity system overview</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 bg-card/50 backdrop-blur-sm border border-border/30">
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-sm text-muted-foreground">Highest Discovered</p>
                <p className="font-semibold">Level {gameState.playerHighestRarity}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-card/50 backdrop-blur-sm border border-border/30">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm text-muted-foreground">Global Maximum</p>
                <p className="font-semibold">Level {gameState.currentMaxRarity}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-card/50 backdrop-blur-sm border border-border/30">
            <div className="flex items-center gap-3">
              <Infinity className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm text-muted-foreground">Total Levels</p>
                <p className="font-semibold">{rarityLevels.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Rarity Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {rarityLevels.map((level) => (
            <Card
              key={level.id}
              className={`
                p-4 transition-all duration-300 border
                ${
                  level.discovered
                    ? "bg-card/70 border-border/50 hover:scale-105 cursor-pointer"
                    : "bg-card/30 border-border/20 opacity-60"
                }
                ${level.threshold <= gameState.playerHighestRarity ? "ring-2 ring-primary/50" : ""}
              `}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${level.gradient}`} />
                <div className="flex items-center gap-1">
                  {level.threshold <= gameState.playerHighestRarity && <Crown className="w-4 h-4 text-yellow-400" />}
                  {!level.discovered && <Lock className="w-4 h-4 text-muted-foreground" />}
                </div>
              </div>

              <h3 className="font-semibold text-foreground mb-1">{level.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">Level {level.threshold}</p>

              {level.probability && (
                <Badge variant="outline" className="mb-2 text-xs">
                  {level.probability}% chance
                </Badge>
              )}

              <div className="space-y-1">
                {level.discovered ? (
                  <>
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-green-400">Discovered</span>
                    </div>
                    {level.firstDiscoverer && (
                      <p className="text-xs text-muted-foreground">First: {level.firstDiscoverer}</p>
                    )}
                    {level.discoveredAt && <p className="text-xs text-muted-foreground">{level.discoveredAt}</p>}
                  </>
                ) : (
                  <div className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Undiscovered</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
