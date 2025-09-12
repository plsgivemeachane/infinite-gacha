"use client"

import type { GameCard } from "@/app/page"

interface StarCardProps {
  card: GameCard
  x: number
  y: number
  onClick: () => void
}

const RARITY_STYLES = {
  common: {
    size: "w-3 h-3",
    glow: "shadow-gray-400/50",
    bg: "bg-gradient-to-br from-gray-400 to-gray-600",
    pulse: "animate-pulse",
  },
  rare: {
    size: "w-4 h-4",
    glow: "shadow-blue-400/60 shadow-lg",
    bg: "bg-gradient-to-br from-blue-400 to-blue-600",
    pulse: "animate-pulse",
  },
  epic: {
    size: "w-5 h-5",
    glow: "shadow-purple-400/70 shadow-xl",
    bg: "bg-gradient-to-br from-purple-400 to-purple-600",
    pulse: "animate-pulse",
  },
  legendary: {
    size: "w-6 h-6",
    glow: "shadow-yellow-400/80 shadow-2xl",
    bg: "bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600",
    pulse: "animate-pulse",
  },
}

function getRarityString(rarity: string | number): keyof typeof RARITY_STYLES {
  if (typeof rarity === "string") {
    return rarity.toLowerCase() as keyof typeof RARITY_STYLES
  }

  // Convert numeric rarity to string
  const rarityMap: Record<number, keyof typeof RARITY_STYLES> = {
    0: "common",
    1: "rare",
    2: "epic",
    3: "legendary",
  }

  return rarityMap[rarity] || "common"
}

export function StarCard({ card, x, y, onClick }: StarCardProps) {
  const rarityKey = getRarityString(card.rarity)
  const styles = RARITY_STYLES[rarityKey]

  return (
    <div
      className="absolute cursor-pointer group transition-all duration-300 hover:scale-150 hover:z-10"
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
      onClick={onClick}
    >
      {/* Star/Planet representation */}
      <div
        className={`
          ${styles.size} ${styles.bg} ${styles.glow} ${styles.pulse}
          rounded-full transition-all duration-300
          group-hover:animate-spin
        `}
      />

      {/* Hover tooltip */}
      <div
        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                   opacity-0 group-hover:opacity-100 transition-opacity duration-200
                   bg-card/90 backdrop-blur-sm border border-border/50 rounded px-2 py-1
                   text-xs font-medium text-card-foreground whitespace-nowrap pointer-events-none"
      >
        {card.name}
        <div
          className="absolute top-full left-1/2 transform -translate-x-1/2 
                       border-l-4 border-r-4 border-t-4 border-transparent border-t-card/90"
        />
      </div>

      {/* Legendary sparkle effect */}
      {rarityKey === "legendary" && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-ping"
              style={{
                left: `${Math.cos((i * 90 * Math.PI) / 180) * 15 + 50}%`,
                top: `${Math.sin((i * 90 * Math.PI) / 180) * 15 + 50}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: "2s",
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
