import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { Prisma } from '@prisma/client' // Add this import

// Define types for User and Card based on Prisma schema
type UserWithCards = Prisma.UserGetPayload<{
  include: {
    cards: {
      include: { rarity: true }
    }
  }
}>

type CardWithRarity = Prisma.CardGetPayload<{
  include: { rarity: true }
}>

export async function GET() {
  try {
    const users: UserWithCards[] = await prisma.user.findMany({ // Use UserWithCards type
      include: {
        cards: {
          include: { rarity: true },
        },
      },
    })

    const rarities = await prisma.rarity.findMany({
      orderBy: { level: "asc" },
    })

    const currentMaxRarityLevel = rarities.length > 0 ? rarities[rarities.length - 1].level : 0

    const leaderboard = users
      .map((user: UserWithCards) => { // Use UserWithCards type
        const highestRarityCard: CardWithRarity | undefined = user.cards.reduce( // Use CardWithRarity type
          (maxRarityCard: CardWithRarity, currentCard: CardWithRarity) => { // Use CardWithRarity type
            return currentCard.rarity.level > maxRarityCard.rarity.level
              ? currentCard
              : maxRarityCard
          },
          user.cards[0] // Initialize with the first card, or handle empty case
        )

        return {
          playerId: user.id,
          playerName: user.playerName,
          highestRarity: highestRarityCard ? highestRarityCard.rarity.level : -1,
          timestamp: highestRarityCard ? Number(highestRarityCard.timestamp) : 0,
          totalPulls: user.totalPulls,
        }
      })
      .filter((entry) => entry.highestRarity !== -1) // Filter out users with no cards

    // Sort leaderboard by highest rarity, then by earliest timestamp (first to achieve)
    const sortedLeaderboard = [...leaderboard].sort((a, b) => {
      if (a.highestRarity !== b.highestRarity) {
        return b.highestRarity - a.highestRarity
      }
      return a.timestamp - b.timestamp
    })

    const leaderboardWithRarityInfo = sortedLeaderboard.map((entry, index) => {
      const rarityInfo = rarities.find((r: Prisma.RarityGetPayload<{}>) => r.level === entry.highestRarity) // Use Prisma.RarityGetPayload
      return {
        rank: index + 1,
        playerId: entry.playerId,
        playerName: entry.playerName,
        highestRarity: entry.highestRarity,
        rarityName: rarityInfo?.name || "Unknown",
        rarityColor: rarityInfo?.color || "#6b7280",
        timestamp: entry.timestamp,
        totalPulls: entry.totalPulls,
        isCurrentMax: entry.highestRarity === currentMaxRarityLevel,
      }
    })

    return NextResponse.json({
      success: true,
      leaderboard: leaderboardWithRarityInfo,
      currentMaxRarity: currentMaxRarityLevel + 1, // +1 because level is 0-indexed
      totalPlayers: leaderboard.length,
    })
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch leaderboard" }, { status: 500 })
  }
}