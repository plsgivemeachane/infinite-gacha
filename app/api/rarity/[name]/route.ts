import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { name: string } }) {
  try {
    const rarityName = params.name

    const rarity = await prisma.rarity.findFirst({
      where: { name: { equals: rarityName, mode: "insensitive" } },
    })

    if (!rarity) {
      return NextResponse.json({ success: false, error: "Rarity not found" }, { status: 404 })
    }

    const allRarities = await prisma.rarity.findMany({ orderBy: { level: "asc" } })
    const currentMaxRarityLevel = allRarities.length > 0 ? allRarities[allRarities.length - 1].level : 0

    // Calculate probability for this rarity
    const weights = []
    for (let i = 0; i <= currentMaxRarityLevel; i++) {
      weights.push(Math.pow(0.3, i))
    }
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
    const probability = (weights[rarity.level] / totalWeight) * 100

    return NextResponse.json({
      success: true,
      rarity: {
        level: rarity.level,
        name: rarity.name,
        color: rarity.color,
        probability: Math.round(probability * 100) / 100, // Round to 2 decimal places
      },
    })
  } catch (error) {
    console.error("Failed to get rarity info:", error)
    return NextResponse.json({ success: false, error: "Failed to get rarity info" }, { status: 500 })
  }
}