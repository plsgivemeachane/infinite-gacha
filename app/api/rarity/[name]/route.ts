import { type NextRequest, NextResponse } from "next/server"

// Mock database - same as in pull route
const mockDatabase = {
  currentMaxRarity: 5,
  totalPulls: 0,
  rarityNames: ["Common", "Rare", "Epic", "Legendary", "Mythic"],
  rarityColors: ["#6b7280", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"],
}

export async function GET(request: NextRequest, { params }: { params: { name: string } }) {
  try {
    const rarityName = params.name
    const rarityIndex = mockDatabase.rarityNames.findIndex((name) => name.toLowerCase() === rarityName.toLowerCase())

    if (rarityIndex === -1) {
      return NextResponse.json({ success: false, error: "Rarity not found" }, { status: 404 })
    }

    // Calculate probability for this rarity
    const weights = []
    for (let i = 0; i < mockDatabase.currentMaxRarity; i++) {
      weights.push(Math.pow(0.3, i))
    }
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
    const probability = (weights[rarityIndex] / totalWeight) * 100

    return NextResponse.json({
      success: true,
      rarity: {
        level: rarityIndex,
        name: mockDatabase.rarityNames[rarityIndex],
        color: mockDatabase.rarityColors[rarityIndex],
        probability: Math.round(probability * 100) / 100, // Round to 2 decimal places
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to get rarity info" }, { status: 500 })
  }
}
