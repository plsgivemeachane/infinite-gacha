import { type NextRequest, NextResponse } from "next/server"
import prisma from "../../../lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const playerId = searchParams.get("playerId") || "default_player"

    let user = await prisma.user.findUnique({
      where: { id: playerId },
      include: {
        cards: {
          include: { rarity: true },
        },
      },
    })

    if (!user) {
      // Create a new user with some sample cards if not found
      user = await prisma.user.create({
        data: {
          id: playerId,
          playerName: `Player ${playerId.slice(0, 8)}`, // Placeholder name
          totalPulls: 2,
          cards: {
            create: [
              {
                name: "Stellar Warrior",
                rarity: {
                  connectOrCreate: {
                    where: { level: 0 },
                    create: { level: 0, name: "Common", color: "#6b7280" },
                  },
                },
                power: 150,
                image: "/mystical-space-warrior-with-glowing-armor.jpg",
                description: "A common warrior from the stellar realms.",
                timestamp: BigInt(Date.now() - 3600000),
              },
              {
                name: "Cosmic Phoenix",
                rarity: {
                  connectOrCreate: {
                    where: { level: 3 },
                    create: { level: 3, name: "Legendary", color: "#f59e0b" },
                  },
                },
                power: 1850,
                image: "/magnificent-phoenix-made-of-cosmic-fire-and-stardu.jpg",
                description: "A legendary phoenix born from cosmic fire.",
                timestamp: BigInt(Date.now() - 1800000),
              },
            ],
          },
        },
        include: {
          cards: {
            include: { rarity: true },
          },
        },
      })
    }

    // Sort cards by rarity (highest first), then by timestamp (newest first)
    const sortedCards = [...user.cards].sort((a, b) => {
      if (a.rarity.level !== b.rarity.level) {
        return b.rarity.level - a.rarity.level
      }
      return Number(b.timestamp) - Number(a.timestamp)
    })

    // Group cards by rarity for constellation view
    const cardsByRarity: { [key: number]: typeof sortedCards } = {}
    sortedCards.forEach((card) => {
      if (!cardsByRarity[card.rarity.level]) {
        cardsByRarity[card.rarity.level] = []
      }
      cardsByRarity[card.rarity.level].push(card)
    })

    // Calculate collection stats
    const rarityStats: { [key: number]: { count: number; rarityName: string; rarityColor: string } } = {}
    sortedCards.forEach((card) => {
      if (!rarityStats[card.rarity.level]) {
        rarityStats[card.rarity.level] = {
          count: 0,
          rarityName: card.rarity.name,
          rarityColor: card.rarity.color,
        }
      }
      rarityStats[card.rarity.level].count += 1
    })

    return NextResponse.json({
      success: true,
      playerId: user.id,
      cards: sortedCards,
      cardsByRarity,
      totalCards: user.cards.length,
      totalPulls: user.totalPulls,
      rarityStats,
      collectionPower: sortedCards.reduce((sum, card) => sum + card.power, 0),
    })
  } catch (error) {
    console.error("Failed to fetch inventory:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch inventory" }, { status: 500 })
  }
}