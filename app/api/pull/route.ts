import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { Prisma } from '@prisma/client' // Add this import

const transcendentNames = [
  "Transcendent",
  "Cosmic",
  "Ethereal",
  "Divine",
  "Primordial",
  "Celestial",
  "Omnipotent",
  "Infinite",
  "Eternal",
  "Absolute",
]
const transcendentColors = [
  "#ec4899",
  "#06b6d4",
  "#10b981",
  "#f97316",
  "#8b5cf6",
  "#ef4444",
  "#eab308",
  "#6366f1",
  "#14b8a6",
  "#f59e0b",
]

const cardNames = [
  "Stellar Warrior",
  "Cosmic Phoenix",
  "Void Dragon",
  "Nebula Guardian",
  "Astral Mage",
  "Galactic Empress",
  "Quantum Beast",
  "Ethereal Spirit",
  "Dimensional Lord",
  "Celestial Avatar",
  "Primordial Entity",
  "Infinite Being",
]

type CardWithRarity = Prisma.CardGetPayload<{
  include: { rarity: true }
}>

async function checkAndCreateNewRarity(playerId: string, pulledRarityLevel: number) {
  const allRarities = await prisma.rarity.findMany({ orderBy: { level: "asc" } })
  const currentMaxRarityLevel = allRarities.length > 0 ? allRarities[allRarities.length - 1].level : -1

  if (pulledRarityLevel > currentMaxRarityLevel) {
    const newRarityLevel = currentMaxRarityLevel + 1
    const newRarityIndex = newRarityLevel - 5 // Start after initial 5

    const newName =
      transcendentNames[newRarityIndex % transcendentNames.length] +
      (Math.floor(newRarityIndex / transcendentNames.length) > 0
        ? ` ${Math.floor(newRarityIndex / transcendentNames.length) + 1}`
        : "")

    const newColor = transcendentColors[newRarityIndex % transcendentColors.length]

    await prisma.rarity.create({
      data: {
        level: newRarityLevel,
        name: newName,
        color: newColor,
      },
    })

    // Update user's highest rarity if this pull is higher
    const user = await prisma.user.findUnique({ where: { id: playerId } })
    if (user) {
      const userCards: CardWithRarity[] = await prisma.card.findMany({ // Use CardWithRarity type
        where: { playerId: user.id },
        include: { rarity: true },
      })
      const userHighestRarity = userCards.reduce(
        (max: number, card: CardWithRarity) => (card.rarity.level > max ? card.rarity.level : max), // Explicitly type max and card
        -1
      )

      if (pulledRarityLevel > userHighestRarity) {
        // In a real app, you might have a dedicated field for highestRarity on User
        // For now, we'll just rely on recalculating from cards or update a mock leaderboard
      }
    }

    console.log(`[Prisma] New rarity created: ${newName} (Level ${newRarityLevel})`)
  }
}

async function generatePull(playerId: string) {
  let user = await prisma.user.findUnique({
    where: { id: playerId },
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        id: playerId,
        playerName: `Player ${playerId.slice(0, 8)}`,
        totalPulls: 0,
      },
    })
  }

  // Increment total pulls
  user = await prisma.user.update({
    where: { id: playerId },
    data: {
      totalPulls: { increment: 1 },
    },
  })

  const allRarities = await prisma.rarity.findMany({ orderBy: { level: "asc" } })
  let currentMaxRarityLevel = allRarities.length > 0 ? allRarities[allRarities.length - 1].level : 0

  // Ensure initial rarities exist if they don't
  if (allRarities.length === 0) {
    await prisma.rarity.createMany({
      data: [
        { level: 0, name: "Common", color: "#6b7280" },
        { level: 1, name: "Rare", color: "#3b82f6" },
        { level: 2, name: "Epic", color: "#8b5cf6" },
        { level: 3, name: "Legendary", color: "#f59e0b" },
        { level: 4, name: "Mythic", color: "#ef4444" },
      ],
      skipDuplicates: true,
    })
    currentMaxRarityLevel = 4 // After creating initial rarities
  }

  // Exponentially decreasing probability for higher rarities
  const weights = []
  for (let i = 0; i <= currentMaxRarityLevel; i++) {
    weights.push(Math.pow(0.3, i))
  }

  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
  const random = Math.random() * totalWeight

  let pulledRarityLevel = 0
  let currentWeight = 0

  for (let i = 0; i < weights.length; i++) {
    currentWeight += weights[i]
    if (random <= currentWeight) {
      pulledRarityLevel = i
      break
    }
  }

  // Check if we need to create a new rarity
  await checkAndCreateNewRarity(playerId, pulledRarityLevel)

  const pulledRarity = await prisma.rarity.findUnique({
    where: { level: pulledRarityLevel },
  })

  if (!pulledRarity) {
    throw new Error("Pulled rarity not found after creation/check.")
  }

  const newCard = await prisma.card.create({
    data: {
      name: cardNames[Math.floor(Math.random() * cardNames.length)],
      rarityId: pulledRarity.level,
      playerId: user.id,
      power: Math.floor(Math.random() * 1000) + pulledRarity.level * 500,
      image: `/magnificent-phoenix-made-of-cosmic-fire-and-stardu.jpg`,
      description: `A ${pulledRarity.name.toLowerCase()} entity from the cosmic void.`,
      timestamp: BigInt(Date.now()),
    },
    include: { rarity: true },
  })

  return {
    card: newCard,
    isNewRarityUnlocked: pulledRarity.level > currentMaxRarityLevel,
    currentMaxRarity: currentMaxRarityLevel + 1, // +1 because level is 0-indexed
    totalPulls: user.totalPulls,
  }
}

export async function POST(request: NextRequest) {
  try {
    const { playerId = "default_player" } = await request.json()

    const result = await generatePull(playerId)

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error("Failed to generate pull:", error)
    return NextResponse.json({ success: false, error: "Failed to generate pull" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const rarities = await prisma.rarity.findMany({
      orderBy: { level: "asc" },
    })

    const currentMaxRarityLevel = rarities.length > 0 ? rarities[rarities.length - 1].level : -1

    return NextResponse.json({
      success: true,
      currentMaxRarity: currentMaxRarityLevel + 1,
      totalPulls: (await prisma.user.aggregate({ _sum: { totalPulls: true } }))._sum.totalPulls || 0,
      availableRarities: rarities.map((r: Prisma.RarityGetPayload<{}>) => ({
        level: r.level,
        name: r.name,
        color: r.color,
      })),
    })
  } catch (error) {
    console.error("Failed to fetch rarities:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch rarities" }, { status: 500 })
  }
}