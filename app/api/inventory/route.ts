import { type NextRequest, NextResponse } from "next/server"

// Mock database reference
const mockDatabase = {
  currentMaxRarity: 5,
  rarityNames: ["Common", "Rare", "Epic", "Legendary", "Mythic"],
  rarityColors: ["#6b7280", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"],
  players: new Map(),
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const playerId = searchParams.get("playerId") || "default_player"

    // Get or create player data
    if (!mockDatabase.players.has(playerId)) {
      // Create some sample cards for new players
      const sampleCards = [
        {
          id: "sample_1",
          name: "Stellar Warrior",
          rarity: 0,
          rarityName: "Common",
          rarityColor: "#6b7280",
          power: 150,
          image: "/mystical-space-warrior-with-glowing-armor.jpg",
          description: "A common warrior from the stellar realms.",
          timestamp: Date.now() - 3600000,
        },
        {
          id: "sample_2",
          name: "Cosmic Phoenix",
          rarity: 3,
          rarityName: "Legendary",
          rarityColor: "#f59e0b",
          power: 1850,
          image: "/magnificent-phoenix-made-of-cosmic-fire-and-stardu.jpg",
          description: "A legendary phoenix born from cosmic fire.",
          timestamp: Date.now() - 1800000,
        },
      ]

      mockDatabase.players.set(playerId, {
        cards: sampleCards,
        totalPulls: 2,
      })
    }

    const player = mockDatabase.players.get(playerId)

    // Sort cards by rarity (highest first), then by timestamp (newest first)
    const sortedCards = [...player.cards].sort((a, b) => {
      if (a.rarity !== b.rarity) {
        return b.rarity - a.rarity
      }
      return b.timestamp - a.timestamp
    })

    // Group cards by rarity for constellation view
    const cardsByRarity = {}
    sortedCards.forEach((card) => {
      if (!cardsByRarity[card.rarity]) {
        cardsByRarity[card.rarity] = []
      }
      cardsByRarity[card.rarity].push(card)
    })

    // Calculate collection stats
    const rarityStats = {}
    sortedCards.forEach((card) => {
      if (!rarityStats[card.rarity]) {
        rarityStats[card.rarity] = {
          count: 0,
          rarityName: card.rarityName,
          rarityColor: card.rarityColor,
        }
      }
      rarityStats[card.rarity].count += 1
    })

    return NextResponse.json({
      success: true,
      playerId,
      cards: sortedCards,
      cardsByRarity,
      totalCards: player.cards.length,
      totalPulls: player.totalPulls,
      rarityStats,
      collectionPower: sortedCards.reduce((sum, card) => sum + card.power, 0),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch inventory" }, { status: 500 })
  }
}
