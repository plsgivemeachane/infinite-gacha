"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { GameCard, CardRarity } from "@/app/page"
import type { GameState } from "@/lib/api"
import { PackMote } from "@/components/pack-mote"
import { PullAnimation } from "@/components/pull-animation"
import { CardRevealAnimation } from "@/components/card-reveal-animation"

interface VoidGachaScreenProps {
  onCardPulled: (packType: string) => Promise<GameCard | null> // Return the pulled card
  gameState: GameState | null
}

const SAMPLE_CARDS: GameCard[] = [
  {
    id: "1",
    name: "Stellar Wanderer",
    image: "/mystical-space-warrior-with-glowing-armor.jpg",
    rarity: "common",
    description: "A lone traveler of the cosmic void, seeking ancient knowledge among the stars.",
  },
  {
    id: "2",
    name: "Nebula Guardian",
    image: "/ethereal-guardian-surrounded-by-purple-nebula.jpg",
    rarity: "rare",
    description: "Protector of the cosmic balance, wielding the power of stellar winds.",
  },
  {
    id: "3",
    name: "Void Empress",
    image: "/majestic-cosmic-empress-with-crown-of-stars.jpg",
    rarity: "epic",
    description: "Ruler of the infinite darkness, commanding legions of starlight.",
  },
  {
    id: "4",
    name: "Cosmic Phoenix",
    image: "/magnificent-phoenix-made-of-cosmic-fire-and-stardu.jpg",
    rarity: "legendary",
    description: "Born from the heart of dying stars, this legendary being transcends time itself.",
  },
]

const PACK_TYPES = [
  { id: "basic", name: "Stellar Pack", cost: 100, rarity: "common" as CardRarity },
  { id: "premium", name: "Nebula Pack", cost: 250, rarity: "rare" as CardRarity },
  { id: "legendary", name: "Void Pack", cost: 500, rarity: "epic" as CardRarity },
]

export function VoidGachaScreen({ onCardPulled, gameState }: VoidGachaScreenProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [selectedPack, setSelectedPack] = useState<string | null>(null)
  const [revealedCard, setRevealedCard] = useState<GameCard | null>(null)
  const [animationStage, setAnimationStage] = useState<"pull" | "reveal">("pull")

  const handlePackSelect = (packId: string) => {
    setSelectedPack(packId)
  }

  const handleReachIntoVoid = async () => {
    if (!selectedPack) return

    setIsAnimating(true)
    setAnimationStage("pull")
    setRevealedCard(null) // Clear any previous card

    try {
      console.log("[v0] Starting card pull animation...")
      const pulledCard = await onCardPulled(selectedPack)

      if (pulledCard) {
        console.log("[v0] Card pulled successfully, setting up animation...")

        const animationCard: GameCard = {
          id: pulledCard.id,
          name: pulledCard.name,
          image: pulledCard.image,
          rarity: (pulledCard.rarityName?.toLowerCase() as CardRarity) || "common", // Use rarityName from API
          description: pulledCard.description,
        }

        console.log("[v0] Mapped card for animation:", animationCard)
        setRevealedCard(animationCard)

        setTimeout(() => {
          console.log("[v0] Transitioning to reveal stage...")
          setAnimationStage("reveal")
        }, 3000) // Increased from 2000 to 3000ms
      } else {
        console.log("[v0] No card received, resetting...")
        setIsAnimating(false)
        setSelectedPack(null)
      }
    } catch (error) {
      console.error("[v0] Failed to pull card:", error)
      setIsAnimating(false)
      setSelectedPack(null)
      setRevealedCard(null) // Clear card on error
    }
  }

  const handleRevealComplete = () => {
    console.log("[v0] Animation complete, resetting state...")
    setIsAnimating(false)
    setSelectedPack(null)
    setRevealedCard(null)
    setAnimationStage("pull")
  }

  const currentMaxRarity = gameState?.currentMaxRarity || 4

  if (isAnimating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8">
        {animationStage === "pull" && <PullAnimation rarity={revealedCard?.rarity || "common"} />}
        {animationStage === "reveal" && revealedCard && (
          <CardRevealAnimation card={revealedCard} onComplete={handleRevealComplete} />
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold text-foreground mb-4 text-balance">The Void</h1>
        <p className="text-xl text-muted-foreground max-w-2xl text-pretty">
          Reach into the infinite darkness and pluck a star from the cosmic tapestry. What mysteries await in the
          swirling nebula?
        </p>
        <div className="mt-4 text-sm text-muted-foreground">
          Current Maximum Rarity Discovered:{" "}
          <span className="text-primary font-semibold">Level {currentMaxRarity}</span>
        </div>
      </div>

      {/* Pack Selection */}
      <div className="flex gap-8 mb-12">
        {PACK_TYPES.map((pack) => (
          <PackMote key={pack.id} pack={pack} isSelected={selectedPack === pack.id} onSelect={handlePackSelect} />
        ))}
      </div>

      {/* Main Void Button */}
      <div className="relative">
        <Button
          size="lg"
          onClick={handleReachIntoVoid}
          disabled={!selectedPack || isAnimating}
          className={`
            px-12 py-6 text-xl font-semibold 
            bg-primary hover:bg-primary/90 
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-500 ease-out
            hover:scale-105 hover:shadow-2xl hover:shadow-primary/30
            active:scale-95
            border border-primary/30 hover:border-primary/60
            relative overflow-hidden group
            ${selectedPack ? "animate-pulse" : ""}
          `}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute top-2 left-4 w-1 h-1 bg-white rounded-full animate-ping" />
            <div className="absolute bottom-3 right-6 w-1 h-1 bg-white rounded-full animate-ping animation-delay-300" />
            <div className="absolute top-4 right-8 w-0.5 h-0.5 bg-white rounded-full animate-ping animation-delay-700" />
          </div>

          <span className="relative z-10 group-hover:text-white transition-colors duration-300">
            {isAnimating ? "Reaching into The Void..." : selectedPack ? "Reach into The Void" : "Select a Pack"}
          </span>
        </Button>
      </div>
    </div>
  )
}
