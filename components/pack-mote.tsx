"use client"

import { Card } from "@/components/ui/card"
import type { CardRarity } from "@/app/page"

interface PackType {
  id: string
  name: string
  cost: number
  rarity: CardRarity
}

interface PackMoteProps {
  pack: PackType
  isSelected: boolean
  onSelect: (packId: string) => void
}

const RARITY_COLORS = {
  common: "from-gray-400 to-gray-600",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-yellow-400 via-pink-500 to-purple-600",
}

export function PackMote({ pack, isSelected, onSelect }: PackMoteProps) {
  return (
    <Card
      className={`
        relative cursor-pointer transition-all duration-500 ease-out
        hover:scale-105 hover:-translate-y-1 hover:shadow-2xl
        ${isSelected ? "scale-105 -translate-y-1 shadow-2xl" : ""}
        bg-card/50 backdrop-blur-sm border-2
        ${isSelected ? "border-primary shadow-primary/30" : "border-border/30"}
        group overflow-hidden
      `}
      onClick={() => onSelect(pack.id)}
      style={{ animation: "mote-float 6s ease-in-out infinite" }}
    >
      <div className="p-6 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Mote of Light */}
        <div
          className={`
          w-16 h-16 mx-auto mb-4 rounded-full relative
          bg-gradient-to-br ${RARITY_COLORS[pack.rarity]}
          shadow-lg transition-all duration-500
          ${isSelected ? "shadow-primary/50 animate-pulse" : "group-hover:shadow-lg group-hover:shadow-current/30"}
          group-hover:scale-110
        `}
        >
          <div className="absolute inset-1 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
          {pack.name}
        </h3>

        <p className="text-sm text-muted-foreground mb-3 group-hover:text-foreground transition-colors duration-300">
          {pack.cost} Stardust
        </p>

        <div
          className={`
          inline-block px-3 py-1 rounded-full text-xs font-medium
          bg-gradient-to-r ${RARITY_COLORS[pack.rarity]} text-white
          group-hover:scale-105 transition-transform duration-300
        `}
        >
          {pack.rarity.charAt(0).toUpperCase() + pack.rarity.slice(1)}
        </div>
      </div>
    </Card>
  )
}
