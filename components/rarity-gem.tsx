"use client"

import type { CardRarity } from "@/app/page"

interface RarityGemProps {
  rarity: CardRarity
  size?: "sm" | "md" | "lg"
}

const RARITY_STYLES = {
  common: {
    bg: "bg-gradient-to-br from-gray-400 to-gray-600",
    shadow: "shadow-gray-400/50",
    glow: "drop-shadow-[0_0_8px_rgba(156,163,175,0.5)]",
    symbol: "●",
  },
  rare: {
    bg: "bg-gradient-to-br from-blue-400 to-blue-600",
    shadow: "shadow-blue-400/50",
    glow: "drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]",
    symbol: "◆",
  },
  epic: {
    bg: "bg-gradient-to-br from-purple-400 to-purple-600",
    shadow: "shadow-purple-400/50",
    glow: "drop-shadow-[0_0_16px_rgba(147,51,234,0.7)]",
    symbol: "★",
  },
  legendary: {
    bg: "bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600",
    shadow: "shadow-yellow-400/60",
    glow: "drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]",
    symbol: "✦",
  },
}

const SIZES = {
  sm: "w-6 h-6 text-xs",
  md: "w-8 h-8 text-sm",
  lg: "w-12 h-12 text-lg",
}

export function RarityGem({ rarity, size = "md" }: RarityGemProps) {
  const styles = RARITY_STYLES[rarity]

  return (
    <div
      className={`
        ${SIZES[size]}
        ${styles.bg}
        ${styles.shadow}
        ${styles.glow}
        rounded-full flex items-center justify-center
        text-white font-bold
        animate-pulse
        transform rotate-45
      `}
    >
      <span className="transform -rotate-45">{styles.symbol}</span>
    </div>
  )
}
