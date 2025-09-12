"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { GameCard, CardRarity } from "@/app/page"
import type { GameState } from "@/lib/api"
import { ConstellationView } from "@/components/constellation-view"
import { Filter, Grid, Map } from "lucide-react"
import { DynamicRarityDisplay } from "@/components/dynamic-rarity-display"
import { RarityProgressionTracker } from "@/components/rarity-progression-tracker"

interface CosmosAtlasProps {
  collection: GameCard[]
  onCardSelect: (card: GameCard) => void
  gameState: GameState | null
}

type ViewMode = "constellation" | "grid"
type FilterMode = "all" | CardRarity

export function CosmosAtlas({ collection, onCardSelect, gameState }: CosmosAtlasProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("constellation")
  const [filterMode, setFilterMode] = useState<FilterMode>("all")
  const [zoomLevel, setZoomLevel] = useState(1)

  const currentMaxRarity = gameState?.currentMaxRarity || 4
  const playerHighestRarity = gameState?.playerHighestRarity || 0
  const rarityProgress = gameState?.rarityProgress || 0
  const recentAchievements = gameState?.recentAchievements || []

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

  const filteredCollection = collection.filter((card) => {
    if (filterMode === "all") return true
    const cardRarityString = getRarityString(card.rarity)
    return cardRarityString === filterMode
  })

  const rarityStats = {
    common: collection.filter((c) => getRarityString(c.rarity) === "common").length,
    rare: collection.filter((c) => getRarityString(c.rarity) === "rare").length,
    epic: collection.filter((c) => getRarityString(c.rarity) === "epic").length,
    legendary: collection.filter((c) => getRarityString(c.rarity) === "legendary").length,
  }

  return (
    <div className="min-h-[80vh] p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-foreground mb-4 text-balance">The Cosmos Atlas</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
          Navigate the infinite expanse of your collection. Each star represents a card in your cosmic journey, grouped
          by rarity into magnificent constellations.
        </p>
      </div>

      <div className="mb-6">
        <DynamicRarityDisplay
          currentMaxRarity={currentMaxRarity}
          playerHighestRarity={playerHighestRarity}
          onRaritySelect={(rarity) => console.log("[v0] Selected rarity:", rarity)}
        />
      </div>

      <div className="mb-6">
        <RarityProgressionTracker
          currentRarity={playerHighestRarity}
          nextRarityThreshold={playerHighestRarity + 1}
          progress={rarityProgress}
          recentAchievements={recentAchievements}
        />
      </div>

      {/* Stats Bar */}
      <Card className="mb-6 p-4 bg-card/50 backdrop-blur-sm border border-border/30">
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-gray-400 to-gray-600" />
            <span className="text-muted-foreground">Common:</span>
            <span className="text-foreground font-semibold">{rarityStats.common}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600" />
            <span className="text-muted-foreground">Rare:</span>
            <span className="text-foreground font-semibold">{rarityStats.rare}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-purple-600" />
            <span className="text-muted-foreground">Epic:</span>
            <span className="text-foreground font-semibold">{rarityStats.epic}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600" />
            <span className="text-muted-foreground">Legendary:</span>
            <span className="text-foreground font-semibold">{rarityStats.legendary}</span>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <span className="text-muted-foreground">Total Collection:</span>
            <span className="text-foreground font-bold text-lg">{collection.length}</span>
          </div>
        </div>
      </Card>

      {/* Controls */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <Button
            variant={viewMode === "constellation" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("constellation")}
            className="bg-primary/20 hover:bg-primary/30 border-primary/30"
          >
            <Map className="w-4 h-4 mr-2" />
            Constellation
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="bg-primary/20 hover:bg-primary/30 border-primary/30"
          >
            <Grid className="w-4 h-4 mr-2" />
            Grid
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value as FilterMode)}
            className="bg-card/50 border border-border/30 rounded px-3 py-1 text-sm text-foreground"
          >
            <option value="all">All Rarities</option>
            <option value="common">Common</option>
            <option value="rare">Rare</option>
            <option value="epic">Epic</option>
            <option value="legendary">Legendary</option>
          </select>
        </div>

        {/* Zoom Controls (for constellation view) */}
        {viewMode === "constellation" && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
              className="bg-card/50 border-border/30 hover:bg-primary/10"
            >
              -
            </Button>
            <span className="text-sm text-muted-foreground px-2">{Math.round(zoomLevel * 100)}%</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.25))}
              className="bg-card/50 border-border/30 hover:bg-primary/10"
            >
              +
            </Button>
          </div>
        )}
      </div>

      {/* Main Content */}
      {collection.length === 0 ? (
        <Card className="p-12 text-center bg-card/30 backdrop-blur-sm border border-border/20">
          <div className="text-6xl mb-4">✦</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Your Atlas Awaits</h3>
          <p className="text-muted-foreground">
            Visit The Void to begin your cosmic collection. Each card you discover will appear as a star in your
            personal constellation.
          </p>
        </Card>
      ) : (
        <div className="relative">
          {viewMode === "constellation" ? (
            <ConstellationView cards={filteredCollection} onCardSelect={onCardSelect} zoomLevel={zoomLevel} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredCollection.map((card) => (
                <Card
                  key={card.id}
                  className="aspect-[3/4] cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-2 
                           bg-card/50 backdrop-blur-sm border border-border/30 overflow-hidden group"
                  onClick={() => onCardSelect(card)}
                >
                  <div className="relative h-full">
                    <img
                      src={card.image || "/placeholder.svg"}
                      alt={card.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <h4 className="text-xs font-semibold text-card-foreground truncate">{card.name}</h4>
                      <div
                        className={`
                        inline-block px-1 py-0.5 rounded text-xs font-medium mt-1
                        ${getRarityString(card.rarity) === "legendary" ? "bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white" : ""}
                        ${getRarityString(card.rarity) === "epic" ? "bg-gradient-to-r from-purple-400 to-purple-600 text-white" : ""}
                        ${getRarityString(card.rarity) === "rare" ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white" : ""}
                        ${getRarityString(card.rarity) === "common" ? "bg-gradient-to-r from-gray-400 to-gray-600 text-white" : ""}
                      `}
                      >
                        {card.rarityName || getRarityString(card.rarity)}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
