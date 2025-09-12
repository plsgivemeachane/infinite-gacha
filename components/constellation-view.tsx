"use client"

import { useMemo } from "react"
import type { GameCard } from "@/app/page"
import { StarCard } from "@/components/star-card"

interface ConstellationViewProps {
  cards: GameCard[]
  onCardSelect: (card: GameCard) => void
  zoomLevel: number
}

interface StarPosition {
  x: number
  y: number
  card: GameCard
}

const getRarityString = (rarity: number | string): string => {
  if (typeof rarity === "string") return rarity.toLowerCase()

  const rarityMap: { [key: number]: string } = {
    0: "common",
    1: "rare",
    2: "epic",
    3: "legendary",
    4: "mythic",
  }
  return rarityMap[rarity] || "common"
}

export function ConstellationView({ cards, onCardSelect, zoomLevel }: ConstellationViewProps) {
  // Generate constellation positions based on rarity
  const starPositions = useMemo(() => {
    const positions: StarPosition[] = []

    const rarityGroups = {
      common: cards.filter((c) => getRarityString(c.rarity) === "common"),
      rare: cards.filter((c) => getRarityString(c.rarity) === "rare"),
      epic: cards.filter((c) => getRarityString(c.rarity) === "epic"),
      legendary: cards.filter((c) => getRarityString(c.rarity) === "legendary"),
    }

    // Position constellations in different areas of the sky
    const constellationAreas = {
      common: { centerX: 25, centerY: 75, radius: 15 }, // Bottom left
      rare: { centerX: 75, centerY: 75, radius: 15 }, // Bottom right
      epic: { centerX: 25, centerY: 25, radius: 15 }, // Top left
      legendary: { centerX: 75, centerY: 25, radius: 20 }, // Top right (larger area)
    }

    Object.entries(rarityGroups).forEach(([rarity, rarityCards]) => {
      const area = constellationAreas[rarity as keyof typeof constellationAreas]

      rarityCards.forEach((card, index) => {
        // Create constellation patterns
        const angle = (index * 2 * Math.PI) / Math.max(rarityCards.length, 1)
        const distance = (index % 2 === 0 ? 0.7 : 1) * area.radius

        const x = area.centerX + Math.cos(angle) * distance + (Math.random() - 0.5) * 5
        const y = area.centerY + Math.sin(angle) * distance + (Math.random() - 0.5) * 5

        positions.push({
          x: Math.max(5, Math.min(95, x)), // Keep within bounds
          y: Math.max(5, Math.min(95, y)),
          card,
        })
      })
    })

    return positions
  }, [cards])

  return (
    <div
      className="relative w-full h-[600px] bg-gradient-to-br from-background via-card/20 to-background 
                 rounded-lg border border-border/30 overflow-hidden"
      style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center" }}
    >
      {/* Background star field */}
      <div className="absolute inset-0 star-field opacity-30" />

      {/* Constellation lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {Object.entries({
          common: starPositions.filter((p) => getRarityString(p.card.rarity) === "common"),
          rare: starPositions.filter((p) => getRarityString(p.card.rarity) === "rare"),
          epic: starPositions.filter((p) => getRarityString(p.card.rarity) === "epic"),
          legendary: starPositions.filter((p) => getRarityString(p.card.rarity) === "legendary"),
        }).map(([rarity, positions]) => (
          <g key={rarity}>
            {positions.map((pos, index) => {
              const nextPos = positions[(index + 1) % positions.length]
              if (!nextPos || positions.length < 2) return null

              return (
                <line
                  key={`${pos.card.id}-${nextPos.card.id}`}
                  x1={`${pos.x}%`}
                  y1={`${pos.y}%`}
                  x2={`${nextPos.x}%`}
                  y2={`${nextPos.y}%`}
                  stroke={
                    rarity === "legendary"
                      ? "rgba(251,191,36,0.3)"
                      : rarity === "epic"
                        ? "rgba(147,51,234,0.3)"
                        : rarity === "rare"
                          ? "rgba(59,130,246,0.3)"
                          : "rgba(156,163,175,0.2)"
                  }
                  strokeWidth="1"
                  className="animate-pulse"
                />
              )
            })}
          </g>
        ))}
      </svg>

      {/* Star cards */}
      {starPositions.map((position) => (
        <StarCard
          key={position.card.id}
          card={position.card}
          x={position.x}
          y={position.y}
          onClick={() => onCardSelect(position.card)}
        />
      ))}

      {/* Constellation labels */}
      <div className="absolute top-4 left-4 space-y-2 pointer-events-none">
        {cards.filter((c) => getRarityString(c.rarity) === "legendary").length > 0 && (
          <div className="text-sm font-semibold text-yellow-400">✦ Legendary Cluster</div>
        )}
      </div>

      <div className="absolute top-4 right-4 space-y-2 pointer-events-none">
        {cards.filter((c) => getRarityString(c.rarity) === "epic").length > 0 && (
          <div className="text-sm font-semibold text-purple-400">★ Epic Constellation</div>
        )}
      </div>

      <div className="absolute bottom-4 left-4 space-y-2 pointer-events-none">
        {cards.filter((c) => getRarityString(c.rarity) === "common").length > 0 && (
          <div className="text-sm font-semibold text-gray-400">● Common Stars</div>
        )}
      </div>

      <div className="absolute bottom-4 right-4 space-y-2 pointer-events-none">
        {cards.filter((c) => getRarityString(c.rarity) === "rare").length > 0 && (
          <div className="text-sm font-semibold text-blue-400">◆ Rare Nebula</div>
        )}
      </div>
    </div>
  )
}
