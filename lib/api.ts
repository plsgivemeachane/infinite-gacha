export interface PullResult {
  card: {
    id: string
    name: string
    image: string
    rarity: string
    description: string
  }
  newRarityUnlocked?: {
    level: number
    name: string
  }
}

export interface LeaderboardEntry {
  playerId: string
  playerName: string
  highestRarity: number
  rarityName: string
  achievedAt: string
  isFirstDiscoverer: boolean
}

export interface InventoryData {
  cards: Array<{
    id: string
    name: string
    image: string
    rarity: number
    rarityName: string
    rarityColor: string
    power: number
    description: string
    timestamp: number
  }>
  totalCards: number
  totalPulls: number
  rarityStats: Record<string, { count: number; rarityName: string; rarityColor: string }>
  collectionPower: number
}

export interface GameState {
  currentMaxRarity: number
  playerHighestRarity: number
  rarityProgress: number
  recentAchievements: string[]
}

export class GameAPI {
  private static baseUrl = "/api"

  static async pullCard(packType: string): Promise<PullResult> {
    const response = await fetch(`${this.baseUrl}/pull`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ packType }),
    })

    if (!response.ok) {
      throw new Error("Failed to pull card")
    }

    return response.json()
  }

  static async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const response = await fetch(`${this.baseUrl}/leaderboard`)

    if (!response.ok) {
      throw new Error("Failed to fetch leaderboard")
    }

    const data = await response.json()
    return data.leaderboard || []
  }

  static async getInventory(playerId?: string): Promise<InventoryData> {
    const url = playerId ? `${this.baseUrl}/inventory?playerId=${playerId}` : `${this.baseUrl}/inventory`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("Failed to fetch inventory")
    }

    const data = await response.json()
    return {
      cards: data.cards || [],
      totalCards: data.totalCards || 0,
      totalPulls: data.totalPulls || 0,
      rarityStats: data.rarityStats || {},
      collectionPower: data.collectionPower || 0,
    }
  }

  static async getGameState(): Promise<GameState> {
    // Mock implementation - in real app this would be a separate endpoint
    const [leaderboardResponse, inventory] = await Promise.all([
      fetch(`${this.baseUrl}/leaderboard`).then((r) => r.json()),
      this.getInventory(),
    ])

    const currentMaxRarity = leaderboardResponse.currentMaxRarity || 5
    const playerHighestRarity = inventory.cards.length > 0 ? Math.max(...inventory.cards.map((card) => card.rarity)) : 0

    return {
      currentMaxRarity,
      playerHighestRarity,
      rarityProgress: Math.random() * 100, // Mock progress
      recentAchievements: ["First Epic Discovery", "Constellation Master", "Void Walker"],
    }
  }
}
