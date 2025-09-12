"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { GameCard } from "@/app/page"
import { RarityGem } from "@/components/rarity-gem"
import { X, Star, Zap, Eye, Heart } from "lucide-react"

interface CardDetailsProps {
  card: GameCard
  onClose: () => void
}

const RARITY_BACKGROUNDS = {
  common: "from-gray-400/20 to-gray-600/20",
  rare: "from-blue-400/20 to-blue-600/20",
  epic: "from-purple-400/20 to-purple-600/20",
  legendary: "from-yellow-400/20 via-pink-500/20 to-purple-600/20",
}

const RARITY_DESCRIPTIONS = {
  common: "A fundamental force in the cosmic tapestry, these cards form the foundation of any collection.",
  rare: "Blessed by stellar winds, these cards possess enhanced cosmic resonance and power.",
  epic: "Forged in the heart of dying stars, these cards channel immense celestial energy.",
  legendary: "Born from the convergence of galaxies, these transcendent beings exist beyond mortal comprehension.",
}

export function CardDetails({ card, onClose }: CardDetailsProps) {
  const [activeTab, setActiveTab] = useState<"details" | "lore" | "stats">("details")
  const [isFavorited, setIsFavorited] = useState(false)

  const getRarityString = (rarity: string | number): string => {
    if (typeof rarity === "string") return rarity.toLowerCase()
    const rarityMap = { 0: "common", 1: "rare", 2: "epic", 3: "legendary" }
    return rarityMap[rarity as keyof typeof rarityMap] || "common"
  }

  const rarityKey = getRarityString(card.rarity)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-md">
      <Card className="relative max-w-4xl w-full max-h-[90vh] overflow-auto bg-card/95 backdrop-blur-sm border-2 border-primary/30">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 hover:bg-primary/20"
        >
          <X className="w-4 h-4" />
        </Button>

        {/* Card Header */}
        <div
          className={`
          relative p-6 bg-gradient-to-br ${RARITY_BACKGROUNDS[rarityKey]}
          border-b border-border/30 overflow-hidden
        `}
        >
          {/* Background cosmic effect */}
          <div className="absolute inset-0 opacity-20">
            <div className="star-field" />
          </div>

          <div className="relative flex items-start gap-6 z-10">
            <div className="flex-shrink-0">
              <RarityGem rarity={rarityKey} size="lg" />
            </div>

            <div className="flex-1 pr-12">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-card-foreground mb-2 text-balance">{card.name}</h1>
                  <div className="flex items-center gap-3">
                    <div className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-primary/20 text-primary border border-primary/30">
                      {rarityKey.charAt(0).toUpperCase() + rarityKey.slice(1)} Rarity
                    </div>
                    <div className="text-sm text-muted-foreground">Card #{card.id}</div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFavorited(!isFavorited)}
                  className="hover:bg-primary/20"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-card/30 rounded-lg p-3 border border-border/20">
                  <Star className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
                  <div className="text-sm font-semibold text-card-foreground">Cosmic Power</div>
                  <div className="text-xs text-muted-foreground">
                    {rarityKey === "legendary"
                      ? "∞"
                      : rarityKey === "epic"
                        ? "★★★★★"
                        : rarityKey === "rare"
                          ? "★★★"
                          : "★"}
                  </div>
                </div>
                <div className="bg-card/30 rounded-lg p-3 border border-border/20">
                  <Zap className="w-5 h-5 mx-auto mb-1 text-blue-400" />
                  <div className="text-sm font-semibold text-card-foreground">Stellar Energy</div>
                  <div className="text-xs text-muted-foreground">
                    {Math.floor(Math.random() * 1000) +
                      (rarityKey === "legendary"
                        ? 5000
                        : rarityKey === "epic"
                          ? 2000
                          : rarityKey === "rare"
                            ? 500
                            : 100)}
                  </div>
                </div>
                <div className="bg-card/30 rounded-lg p-3 border border-border/20">
                  <Eye className="w-5 h-5 mx-auto mb-1 text-purple-400" />
                  <div className="text-sm font-semibold text-card-foreground">Void Resonance</div>
                  <div className="text-xs text-muted-foreground">
                    {rarityKey === "legendary"
                      ? "Transcendent"
                      : rarityKey === "epic"
                        ? "High"
                        : rarityKey === "rare"
                          ? "Medium"
                          : "Low"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border/30">
          {[
            { id: "details", label: "Details", icon: Eye },
            { id: "lore", label: "Cosmic Lore", icon: Star },
            { id: "stats", label: "Attributes", icon: Zap },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`
                flex-1 px-6 py-4 text-sm font-medium transition-colors
                flex items-center justify-center gap-2
                ${
                  activeTab === id
                    ? "text-primary border-b-2 border-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "details" && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Card Image */}
              <div className="relative">
                <div className="aspect-[3/4] rounded-lg overflow-hidden border-2 border-border/30 bg-card/20">
                  <img src={card.image || "/placeholder.svg"} alt={card.name} className="w-full h-full object-cover" />

                  {/* Rarity Overlay */}
                  {rarityKey === "legendary" && (
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-pink-500/10 to-purple-600/10 animate-pulse" />
                  )}
                </div>

                <div
                  className={`
                  absolute inset-0 rounded-lg pointer-events-none
                  ${rarityKey === "legendary" ? "shadow-[0_0_50px_rgba(251,191,36,0.3)]" : ""}
                  ${rarityKey === "epic" ? "shadow-[0_0_30px_rgba(147,51,234,0.3)]" : ""}
                  ${rarityKey === "rare" ? "shadow-[0_0_20px_rgba(59,130,246,0.3)]" : ""}
                `}
                />
              </div>

              {/* Card Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-card-foreground mb-3">Description</h3>
                  <p className="text-muted-foreground text-pretty leading-relaxed">{card.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-card-foreground mb-3">Collection Info</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center p-3 bg-card/30 rounded border border-border/20">
                      <span className="text-muted-foreground">Card Series:</span>
                      <span className="text-card-foreground font-medium">Cosmic Wanderers</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-card/30 rounded border border-border/20">
                      <span className="text-muted-foreground">Discovered:</span>
                      <span className="text-card-foreground font-medium">Recently</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-card/30 rounded border border-border/20">
                      <span className="text-muted-foreground">Origin Constellation:</span>
                      <span className="text-card-foreground font-medium capitalize">{rarityKey} Cluster</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "lore" && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-card-foreground mb-4">Cosmic Origins</h3>
                <p className="text-muted-foreground">{RARITY_DESCRIPTIONS[rarityKey]}</p>
              </div>

              <Card className="p-6 bg-card/30 border border-border/20">
                <h4 className="text-lg font-semibold text-card-foreground mb-4">The Legend of {card.name}</h4>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    In the vast expanse of the cosmic void, where starlight bends and reality shifts, {card.name}{" "}
                    emerged from the confluence of ancient energies. Born from the dreams of dying galaxies, this entity
                    carries within it the memories of countless worlds.
                  </p>
                  <p>
                    {rarityKey === "legendary" &&
                      "Legends speak of its power to reshape the very fabric of space-time, bending the laws of physics to its will."}
                    {rarityKey === "epic" &&
                      "Those who have witnessed its presence describe an overwhelming sense of cosmic significance, as if the universe itself acknowledges its importance."}
                    {rarityKey === "rare" &&
                      "Travelers across the void have reported sightings of this being, always at moments of great cosmic significance."}
                    {rarityKey === "common" &&
                      "Though humble in appearance, it represents the fundamental forces that bind the universe together."}
                  </p>
                  <p>
                    The cosmic winds carry whispers of its deeds across the infinite darkness, inspiring both awe and
                    reverence among those who dare to reach into the void.
                  </p>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "stats" && (
            <div className="max-w-2xl mx-auto space-y-6">
              <h3 className="text-2xl font-bold text-card-foreground text-center mb-8">Cosmic Attributes</h3>

              <div className="grid gap-4">
                {[
                  {
                    name: "Stellar Magnitude",
                    value: rarityKey === "legendary" ? 95 : rarityKey === "epic" ? 80 : rarityKey === "rare" ? 60 : 40,
                  },
                  {
                    name: "Void Affinity",
                    value: rarityKey === "legendary" ? 100 : rarityKey === "epic" ? 75 : rarityKey === "rare" ? 50 : 25,
                  },
                  {
                    name: "Cosmic Resonance",
                    value: rarityKey === "legendary" ? 90 : rarityKey === "epic" ? 70 : rarityKey === "rare" ? 55 : 35,
                  },
                  {
                    name: "Dimensional Stability",
                    value: rarityKey === "legendary" ? 85 : rarityKey === "epic" ? 65 : rarityKey === "rare" ? 45 : 30,
                  },
                ].map((stat) => (
                  <div key={stat.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{stat.name}</span>
                      <span className="text-card-foreground font-medium">{stat.value}%</span>
                    </div>
                    <div className="w-full bg-card/30 rounded-full h-2 border border-border/20">
                      <div
                        className={`
                          h-full rounded-full transition-all duration-1000 ease-out
                          ${rarityKey === "legendary" ? "bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600" : ""}
                          ${rarityKey === "epic" ? "bg-gradient-to-r from-purple-400 to-purple-600" : ""}
                          ${rarityKey === "rare" ? "bg-gradient-to-r from-blue-400 to-blue-600" : ""}
                          ${rarityKey === "common" ? "bg-gradient-to-r from-gray-400 to-gray-600" : ""}
                        `}
                        style={{ width: `${stat.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Card className="p-4 bg-card/30 border border-border/20 mt-6">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">Overall Cosmic Rating</div>
                  <div
                    className={`
                    text-3xl font-bold
                    ${rarityKey === "legendary" ? "text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text" : ""}
                    ${rarityKey === "epic" ? "text-purple-400" : ""}
                    ${rarityKey === "rare" ? "text-blue-400" : ""}
                    ${rarityKey === "common" ? "text-gray-400" : ""}
                  `}
                  >
                    {rarityKey === "legendary"
                      ? "SSS+"
                      : rarityKey === "epic"
                        ? "S+"
                        : rarityKey === "rare"
                          ? "A"
                          : "B"}
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 p-6 border-t border-border/30">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-primary/30 hover:bg-primary/10 bg-transparent"
          >
            Return to Atlas
          </Button>
          <Button
            variant="default"
            className="bg-primary hover:bg-primary/80"
            onClick={() => setIsFavorited(!isFavorited)}
          >
            {isFavorited ? "Remove from Favorites" : "Add to Favorites"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
