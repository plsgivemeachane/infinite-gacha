"use client"

import { useEffect, useState } from "react"
import type { CardRarity } from "@/app/page"

interface PullAnimationProps {
  rarity?: CardRarity
}

export function PullAnimation({ rarity = "common" }: PullAnimationProps) {
  const [stage, setStage] = useState<"collapse" | "burst" | "reveal">("collapse")

  useEffect(() => {
    const timer1 = setTimeout(() => setStage("burst"), 800)
    const timer2 = setTimeout(() => setStage("reveal"), 1500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  const getRarityEffects = () => {
    switch (rarity) {
      case "legendary":
        return {
          collapseColor: "from-yellow-400 via-pink-500 to-purple-600",
          burstIntensity:
            "0 0 200px 100px rgba(251,191,36,0.9), 0 0 400px 200px rgba(236,72,153,0.7), 0 0 600px 300px rgba(147,51,234,0.5)",
          particles: 50,
          duration: "3s",
        }
      case "epic":
        return {
          collapseColor: "from-purple-400 to-purple-600",
          burstIntensity: "0 0 150px 75px rgba(147,51,234,0.8), 0 0 300px 150px rgba(147,51,234,0.6)",
          particles: 30,
          duration: "2.5s",
        }
      case "rare":
        return {
          collapseColor: "from-blue-400 to-blue-600",
          burstIntensity: "0 0 100px 50px rgba(59,130,246,0.7), 0 0 200px 100px rgba(59,130,246,0.5)",
          particles: 20,
          duration: "2s",
        }
      default:
        return {
          collapseColor: "from-gray-400 to-gray-600",
          burstIntensity: "0 0 80px 40px rgba(156,163,175,0.6)",
          particles: 10,
          duration: "1.5s",
        }
    }
  }

  const effects = getRarityEffects()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      {stage === "collapse" && (
        <div className="relative">
          <div
            className={`w-32 h-32 rounded-full bg-gradient-to-br ${effects.collapseColor} 
                          animate-ping opacity-75`}
            style={{ animationDuration: effects.duration }}
          />
          <div
            className={`absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-br ${effects.collapseColor} 
                          animate-pulse`}
          />

          {/* Swirling void effect */}
          <div className="absolute inset-0 w-32 h-32 rounded-full border-4 border-dashed border-primary/50 animate-spin" />
        </div>
      )}

      {stage === "burst" && (
        <div className="relative">
          <div
            className="w-2 h-2 bg-white rounded-full animate-ping"
            style={{
              boxShadow: effects.burstIntensity,
              animationDuration: "0.5s",
            }}
          />

          {/* Particle explosion effect */}
          <div className="absolute inset-0">
            {Array.from({ length: effects.particles }).map((_, i) => (
              <div
                key={i}
                className={`absolute w-1 h-1 bg-gradient-to-r ${effects.collapseColor} rounded-full animate-ping`}
                style={{
                  left: `${50 + Math.cos((((i * 360) / effects.particles) * Math.PI) / 180) * 100}px`,
                  top: `${50 + Math.sin((((i * 360) / effects.particles) * Math.PI) / 180) * 100}px`,
                  animationDelay: `${i * 0.05}s`,
                  animationDuration: "1s",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {stage === "reveal" && (
        <div className="text-center space-y-4">
          <div
            className={`text-2xl font-bold animate-fade-in bg-gradient-to-r ${effects.collapseColor} bg-clip-text text-transparent`}
          >
            {rarity === "legendary" && "✦ A LEGENDARY STAR EMERGES! ✦"}
            {rarity === "epic" && "★ An Epic Force Awakens! ★"}
            {rarity === "rare" && "◆ A Rare Light Shines! ◆"}
            {rarity === "common" && "● A Star Emerges from the Void ●"}
          </div>

          {/* Cosmic dust effect */}
          <div className="flex justify-center space-x-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 bg-gradient-to-r ${effects.collapseColor} rounded-full animate-bounce`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
