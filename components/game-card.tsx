"use client"

import { Card } from "@/components/ui/card"
import type { GameCard } from "@/app/page"
import { RarityGem } from "@/components/rarity-gem"

interface GameCardProps {
  card: GameCard
  showBack?: boolean
  onClick?: () => void
  className?: string
}

const RARITY_BORDERS = {
  common: "border-gray-400 shadow-gray-400/20",
  rare: "border-blue-400 shadow-blue-400/30",
  epic: "border-purple-400 shadow-purple-400/40",
  legendary: "border-yellow-400 shadow-yellow-400/50 shadow-lg",
}

const RARITY_GLOWS = {
  common: "hover:shadow-gray-400/40",
  rare: "hover:shadow-blue-400/50",
  epic: "hover:shadow-purple-400/60",
  legendary: "hover:shadow-yellow-400/70 hover:shadow-xl",
}

export function GameCardComponent({ card, showBack = false, onClick, className = "" }: GameCardProps) {
  if (showBack) {
    return (
      <Card
        className={`
          relative w-48 h-72 cursor-pointer transition-all duration-300
          bg-card/80 backdrop-blur-sm border-2 border-border/50
          hover:scale-105 hover:-translate-y-2
          ${className}
        `}
        onClick={onClick}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
            <div className="text-4xl font-bold text-primary">✦</div>
          </div>
        </div>

        {/* Void Pattern Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(139,92,246,0.1)_70%)]" />
        </div>
      </Card>
    )
  }

  return (
    <Card
      className={`
        relative w-48 h-72 cursor-pointer transition-all duration-300 overflow-hidden
        bg-card/90 backdrop-blur-sm border-2
        ${RARITY_BORDERS[card.rarity]}
        ${RARITY_GLOWS[card.rarity]}
        hover:scale-105 hover:-translate-y-2
        ${className}
      `}
      onClick={onClick}
    >
      {/* Rarity Gem */}
      <div className="absolute top-2 right-2 z-10">
        <RarityGem rarity={card.rarity} />
      </div>

      {/* Card Image */}
      <div className="relative h-48 overflow-hidden">
        <img src={card.image || "/placeholder.svg"} alt={card.name} className="w-full h-full object-cover" />

        {/* Rarity Overlay Effect */}
        <div
          className={`
          absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent
        `}
        />

        {/* Legendary Sparkle Effect */}
        {card.rarity === "legendary" && (
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-pink-500/10 to-purple-600/10 animate-pulse" />
        )}
      </div>

      {/* Card Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-card-foreground mb-2 text-balance">{card.name}</h3>

        <p className="text-sm text-muted-foreground text-pretty line-clamp-2">{card.description}</p>
      </div>

      {/* Rarity Glow Effect */}
      <div
        className={`
        absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300
        bg-gradient-to-br ${
          card.rarity === "legendary"
            ? "from-yellow-400/5 via-pink-500/5 to-purple-600/5"
            : card.rarity === "epic"
              ? "from-purple-400/5 to-purple-600/5"
              : card.rarity === "rare"
                ? "from-blue-400/5 to-blue-600/5"
                : "from-gray-400/5 to-gray-600/5"
        }
      `}
      />
    </Card>
  )
}

export { GameCardComponent as GameCard }
