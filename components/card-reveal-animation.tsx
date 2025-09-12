"use client"

import { useEffect, useState } from "react"
import { GameCard as GameCardComponent } from "@/components/game-card"
import type { GameCard } from "@/app/page"

interface CardRevealAnimationProps {
  card: GameCard
  onComplete: () => void
}

export function CardRevealAnimation({ card, onComplete }: CardRevealAnimationProps) {
  const [stage, setStage] = useState<"back" | "flip" | "front">("back")

  useEffect(() => {
    const timer1 = setTimeout(() => setStage("flip"), 1000)
    const timer2 = setTimeout(() => setStage("front"), 1500)
    const timer3 = setTimeout(() => onComplete(), 3000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [onComplete])

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Card Revealed!</h2>
        <p className="text-muted-foreground">A new addition to your collection</p>
      </div>

      <div className="relative perspective-1000">
        <div
          className={`
            relative w-48 h-72 transition-transform duration-700 transform-style-preserve-3d
            ${stage === "flip" || stage === "front" ? "rotate-y-180" : ""}
          `}
        >
          {/* Card Back */}
          <div className="absolute inset-0 backface-hidden">
            <GameCardComponent card={card} showBack={true} />
          </div>

          {/* Card Front */}
          <div className="absolute inset-0 backface-hidden rotate-y-180">
            <GameCardComponent
              card={card}
              showBack={false}
              className={`
                ${stage === "front" ? "animate-pulse" : ""}
                ${card.rarity === "legendary" ? "drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]" : ""}
                ${card.rarity === "epic" ? "drop-shadow-[0_0_15px_rgba(147,51,234,0.6)]" : ""}
                ${card.rarity === "rare" ? "drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]" : ""}
              `}
            />
          </div>
        </div>

        {/* Rarity-specific particle effects */}
        {stage === "front" && card.rarity === "legendary" && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Rarity announcement */}
      {stage === "front" && (
        <div className="text-center animate-fade-in">
          <div
            className={`
              inline-block px-6 py-2 rounded-full text-lg font-bold
              ${card.rarity === "legendary" ? "bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white" : ""}
              ${card.rarity === "epic" ? "bg-gradient-to-r from-purple-400 to-purple-600 text-white" : ""}
              ${card.rarity === "rare" ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white" : ""}
              ${card.rarity === "common" ? "bg-gradient-to-r from-gray-400 to-gray-600 text-white" : ""}
            `}
          >
            {card.rarity.toUpperCase()} RARITY
          </div>
        </div>
      )}
    </div>
  )
}
