import { type NextRequest, NextResponse } from "next/server"

// Mock database - in real implementation this would be your actual database
const mockDatabase = {
  currentMaxRarity: 5, // Starting with 5 rarities
  totalPulls: 0,
  rarityNames: ["Common", "Rare", "Epic", "Legendary", "Mythic"],
  rarityColors: ["#6b7280", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"],
  players: new Map(),
  leaderboard: [],
}

// Dynamic rarity scaling - creates new rarity when someone reaches max
function checkAndCreateNewRarity(playerId: string, pulledRarity: number) {
  if (pulledRarity >= mockDatabase.currentMaxRarity) {
    mockDatabase.currentMaxRarity += 1

    // Generate new rarity name and color
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

    const newRarityIndex = mockDatabase.currentMaxRarity - 6 // Start after initial 5
    const newName =
      transcendentNames[newRarityIndex % transcendentNames.length] +
      (Math.floor(newRarityIndex / transcendentNames.length) > 0
        ? ` ${Math.floor(newRarityIndex / transcendentNames.length) + 1}`
        : "")

    mockDatabase.rarityNames.push(newName)
    mockDatabase.rarityColors.push(transcendentColors[newRarityIndex % transcendentColors.length])

    // Update leaderboard
    const existingEntry = mockDatabase.leaderboard.find((entry) => entry.playerId === playerId)
    if (existingEntry) {
      existingEntry.highestRarity = pulledRarity
      existingEntry.timestamp = Date.now()
    } else {
      mockDatabase.leaderboard.push({
        playerId,
        playerName: `Player ${playerId.slice(0, 8)}`,
        highestRarity: pulledRarity,
        timestamp: Date.now(),
      })
    }

    // Sort leaderboard by highest rarity, then by timestamp
    mockDatabase.leaderboard.sort((a, b) => {
      if (a.highestRarity !== b.highestRarity) {
        return b.highestRarity - a.highestRarity
      }
      return a.timestamp - b.timestamp // Earlier timestamp wins for same rarity
    })

    console.log(`[v0] New rarity created: ${newName} (Level ${mockDatabase.currentMaxRarity})`)
  }
}

// Generate a pull with weighted probabilities
function generatePull(playerId: string) {
  mockDatabase.totalPulls += 1

  // Exponentially decreasing probability for higher rarities
  const weights = []
  for (let i = 0; i < mockDatabase.currentMaxRarity; i++) {
    weights.push(Math.pow(0.3, i)) // Each rarity is ~30% as likely as the previous
  }

  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
  const random = Math.random() * totalWeight

  let currentWeight = 0
  let pulledRarity = 0

  for (let i = 0; i < weights.length; i++) {
    currentWeight += weights[i]
    if (random <= currentWeight) {
      pulledRarity = i
      break
    }
  }

  // Check if we need to create a new rarity
  checkAndCreateNewRarity(playerId, pulledRarity)

  // Generate card data
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

  const card = {
    id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: cardNames[Math.floor(Math.random() * cardNames.length)],
    rarity: pulledRarity,
    rarityName: mockDatabase.rarityNames[pulledRarity],
    rarityColor: mockDatabase.rarityColors[pulledRarity],
    power: Math.floor(Math.random() * 1000) + pulledRarity * 500,
    image: `/magnificent-phoenix-made-of-cosmic-fire-and-stardu.jpg`,
    description: `A ${mockDatabase.rarityNames[pulledRarity].toLowerCase()} entity from the cosmic void.`,
    timestamp: Date.now(),
  }

  // Add to player inventory
  if (!mockDatabase.players.has(playerId)) {
    mockDatabase.players.set(playerId, { cards: [], totalPulls: 0 })
  }

  const player = mockDatabase.players.get(playerId)
  player.cards.push(card)
  player.totalPulls += 1

  return {
    card,
    isNewRarityUnlocked: pulledRarity >= mockDatabase.currentMaxRarity - 1,
    currentMaxRarity: mockDatabase.currentMaxRarity,
    totalPulls: mockDatabase.totalPulls,
  }
}

export async function POST(request: NextRequest) {
  try {
    const { playerId = "default_player" } = await request.json()

    const result = generatePull(playerId)

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to generate pull" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    currentMaxRarity: mockDatabase.currentMaxRarity,
    totalPulls: mockDatabase.totalPulls,
    availableRarities: mockDatabase.rarityNames.map((name, index) => ({
      level: index,
      name,
      color: mockDatabase.rarityColors[index],
    })),
  })
}
