import { NextResponse } from "next/server"

// This would connect to your actual database
// For now, we'll use the same mock database from pull route
const mockDatabase = {
  currentMaxRarity: 5,
  totalPulls: 0,
  rarityNames: ["Common", "Rare", "Epic", "Legendary", "Mythic"],
  rarityColors: ["#6b7280", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"],
  players: new Map(),
  leaderboard: [
    {
      playerId: "player_001",
      playerName: "CosmicMaster",
      highestRarity: 4,
      timestamp: Date.now() - 86400000, // 1 day ago
      totalPulls: 1250,
    },
    {
      playerId: "player_002",
      playerName: "VoidSeeker",
      highestRarity: 4,
      timestamp: Date.now() - 172800000, // 2 days ago
      totalPulls: 890,
    },
    {
      playerId: "player_003",
      playerName: "StarCollector",
      highestRarity: 3,
      timestamp: Date.now() - 259200000, // 3 days ago
      totalPulls: 567,
    },
  ],
}

export async function GET() {
  try {
    // Sort leaderboard by highest rarity, then by earliest timestamp (first to achieve)
    const sortedLeaderboard = [...mockDatabase.leaderboard].sort((a, b) => {
      if (a.highestRarity !== b.highestRarity) {
        return b.highestRarity - a.highestRarity
      }
      return a.timestamp - b.timestamp
    })

    const leaderboardWithRarityInfo = sortedLeaderboard.map((entry, index) => ({
      rank: index + 1,
      playerId: entry.playerId,
      playerName: entry.playerName,
      highestRarity: entry.highestRarity,
      rarityName: mockDatabase.rarityNames[entry.highestRarity] || "Unknown",
      rarityColor: mockDatabase.rarityColors[entry.highestRarity] || "#6b7280",
      timestamp: entry.timestamp,
      totalPulls: entry.totalPulls || 0,
      isCurrentMax: entry.highestRarity === mockDatabase.currentMaxRarity - 1,
    }))

    return NextResponse.json({
      success: true,
      leaderboard: leaderboardWithRarityInfo,
      currentMaxRarity: mockDatabase.currentMaxRarity,
      totalPlayers: mockDatabase.leaderboard.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch leaderboard" }, { status: 500 })
  }
}
