"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { VoidGachaScreen } from "@/components/void-gacha-screen"
import { CosmosAtlas } from "@/components/cosmos-atlas"
import { CardDetails } from "@/components/card-details"
import { Leaderboard } from "@/components/leaderboard"
import { ApiTestPanel } from "@/components/api-test-panel"
import { GameAPI, type GameState } from "@/lib/api"

export type CardRarity = "common" | "rare" | "epic" | "legendary"

export interface GameCard {
  id: string
  name: string
  image: string
  rarity: CardRarity
  description: string
}

export default function HomePage() {
  const [currentView, setCurrentView] = useState<"void" | "atlas" | "card" | "leaderboard">("void")
  const [selectedCard, setSelectedCard] = useState<GameCard | null>(null)
  const [collection, setCollection] = useState<GameCard[]>([])
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log("[v0] Loading initial game data...")
        const [inventoryData, gameStateData] = await Promise.all([GameAPI.getInventory(), GameAPI.getGameState()])

        console.log("[v0] Loaded inventory:", inventoryData)
        console.log("[v0] Loaded game state:", gameStateData)

        setCollection(
          inventoryData.cards.map((card) => ({
            ...card,
            rarity: card.rarity as CardRarity,
          })),
        )
        setGameState(gameStateData)
      } catch (error) {
        console.error("[v0] Failed to load initial data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [])

  const handleCardPulled = async (packType: string): Promise<GameCard | null> => {
    // Return the pulled card
    try {
      console.log("[v0] Pulling card from server...")
      const result = await GameAPI.pullCard(packType)
      console.log("[v0] Pull result:", result)

      const newCard: GameCard = {
        ...result.card,
        rarity: result.card.rarity as CardRarity,
      }

      setCollection((prev) => [...prev, newCard])

      // Update game state if new rarity was unlocked
      if (result.newRarityUnlocked) {
        console.log("[v0] New rarity unlocked:", result.newRarityUnlocked)
        const updatedGameState = await GameAPI.getGameState()
        setGameState(updatedGameState)
      }

      return newCard
    } catch (error) {
      console.error("[v0] Failed to pull card:", error)
      return null
    }
  }

  const handleViewCard = (card: GameCard) => {
    setSelectedCard(card)
    setCurrentView("card")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading cosmic data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 nebula-bg" />
      <div className="absolute inset-0 star-field" />

      {/* Navigation */}
      <nav className="relative z-10 p-4 flex justify-center gap-4">
        <Button
          variant={currentView === "void" ? "default" : "secondary"}
          onClick={() => setCurrentView("void")}
          className="bg-primary/20 hover:bg-primary/30 border border-primary/30"
        >
          The Void
        </Button>
        <Button
          variant={currentView === "atlas" ? "default" : "secondary"}
          onClick={() => setCurrentView("atlas")}
          className="bg-primary/20 hover:bg-primary/30 border border-primary/30"
        >
          Cosmos Atlas ({collection.length})
        </Button>
        <Button
          variant={currentView === "leaderboard" ? "default" : "secondary"}
          onClick={() => setCurrentView("leaderboard")}
          className="bg-primary/20 hover:bg-primary/30 border border-primary/30"
        >
          Leaderboard
        </Button>
      </nav>

      {/* Main Content */}
      <main className="relative z-10">
        {currentView === "void" && <VoidGachaScreen onCardPulled={handleCardPulled} gameState={gameState} />}
        {currentView === "atlas" && (
          <CosmosAtlas collection={collection} onCardSelect={handleViewCard} gameState={gameState} />
        )}
        {currentView === "leaderboard" && <Leaderboard onClose={() => setCurrentView("void")} />}
        {currentView === "card" && selectedCard && (
          <CardDetails card={selectedCard} onClose={() => setCurrentView("atlas")} />
        )}
      </main>

      <ApiTestPanel />
    </div>
  )
}
