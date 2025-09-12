"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Crown, Sparkles, Infinity } from "lucide-react"

interface RarityLevel {
  id: number
  name: string
  color: string
  gradient: string
  threshold: number
  discovered: boolean
  firstDiscoverer?: string
  discoveredAt?: string
}

interface DynamicRarityDisplayProps {
  currentMaxRarity: number
  playerHighestRarity: number
  onRaritySelect?: (rarity: RarityLevel) => void
}

export function DynamicRarityDisplay({
  currentMaxRarity,
  playerHighestRarity,
  onRaritySelect,
}: DynamicRarityDisplayProps) {
  const [rarityLevels, setRarityLevels] = useState<RarityLevel[]>([])

  // Generate dynamic rarity levels
  useEffect(() => {
    const generateRarityLevels = () => {
      const baseRarities = [
        { name: "Common", color: "gray", gradient: "from-gray-400 to-gray-600", threshold: 0 },
        { name: "Rare", color: "blue", gradient: "from-blue-400 to-blue-600", threshold: 1 },
        { name: "Epic", color: "purple", gradient: "from-purple-400 to-purple-600", threshold: 2 },
        { name: "Legendary", color: "yellow", gradient: "from-yellow-400 via-pink-500 to-purple-600", threshold: 3 },
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
        "Quantum",
        "Dimensional",
        "Temporal",
        "Void-touched",
        "Star-born",
        "Galaxy-forged",
        "Universe-blessed",
        "Reality-shaping",
        "Existence-defining",
        "Truth-bearing",
        "Concept-embodying",
        "Law-transcending",
        "Boundary-breaking",
        "Limit-exceeding",
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

      const levels: RarityLevel[] = baseRarities.map((rarity) => ({
        ...rarity,
        id: rarity.threshold,
        discovered: rarity.threshold <= playerHighestRarity,
        firstDiscoverer:
          rarity.threshold <= playerHighestRarity ? `Player${Math.floor(Math.random() * 1000)}` : undefined,
        discoveredAt:
          rarity.threshold <= playerHighestRarity
            ? new Date(Date.now() - Math.random() * 86400000 * 30).toLocaleDateString()
            : undefined,
      }))

      // Generate transcendent levels up to current max + 3 (to show upcoming levels)
      for (let i = 4; i <= Math.max(currentMaxRarity + 3, 10); i++) {
        const transcendentIndex = i - 4
        const nameIndex = transcendentIndex % transcendentNames.length
        const gradientIndex = transcendentIndex % transcendentGradients.length
        const tier = Math.floor(transcendentIndex / transcendentNames.length) + 1

        levels.push({
          id: i,
          name: tier > 1 ? `${transcendentNames[nameIndex]} ${tier}` : transcendentNames[nameIndex],
          color: "transcendent",
          gradient: transcendentGradients[gradientIndex],
          threshold: i,
          discovered: i <= playerHighestRarity,
          firstDiscoverer: i <= playerHighestRarity ? `Player${Math.floor(Math.random() * 1000)}` : undefined,
          discoveredAt:
            i <= playerHighestRarity
              ? new Date(Date.now() - Math.random() * 86400000 * 30).toLocaleDateString()
              : undefined,
        })
      }

      return levels
    }

    setRarityLevels(generateRarityLevels())
  }, [currentMaxRarity, playerHighestRarity])

  const displayLevels = rarityLevels.filter((level) => level.discovered)

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border border-border/30">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20">
            <Infinity className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Infinite Rarity Scale</h3>
            <p className="text-sm text-muted-foreground">Current maximum: Level {currentMaxRarity}</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-primary/10 border-primary/30">
          <TrendingUp className="w-3 h-3 mr-1" />
          Scaling Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {displayLevels.map((level) => (
          <Card
            key={level.id}
            className={`
              p-4 cursor-pointer transition-all duration-300 hover:scale-105 border
              bg-card/70 border-border/50
              ${level.threshold <= playerHighestRarity ? "ring-2 ring-primary/50" : ""}
            `}
            onClick={() => onRaritySelect?.(level)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${level.gradient}`} />
              {level.threshold <= playerHighestRarity && <Crown className="w-4 h-4 text-yellow-400" />}
            </div>

            <h4 className="font-semibold text-sm text-foreground mb-1">{level.name}</h4>
            <p className="text-xs text-muted-foreground mb-2">Level {level.threshold}</p>

            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-400">Discovered</span>
              </div>
              {level.firstDiscoverer && <p className="text-xs text-muted-foreground">First: {level.firstDiscoverer}</p>}
              {level.discoveredAt && <p className="text-xs text-muted-foreground">{level.discoveredAt}</p>}
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <a href="/rarities" className="text-sm text-primary hover:text-primary/80 transition-colors">
          View All Rarity Levels →
        </a>
      </div>
    </Card>
  )
}
