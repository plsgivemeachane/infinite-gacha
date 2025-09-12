import { GameAPI } from "../lib/api.js"

console.log("🚀 Starting API endpoint tests...\n")

async function runTests() {
  const tests = [
    {
      name: "Pull Card - Basic Pack",
      test: () => GameAPI.pullCard("basic"),
    },
    {
      name: "Pull Card - Premium Pack",
      test: () => GameAPI.pullCard("premium"),
    },
    {
      name: "Pull Card - Legendary Pack",
      test: () => GameAPI.pullCard("legendary"),
    },
    {
      name: "Get Leaderboard",
      test: () => GameAPI.getLeaderboard(),
    },
    {
      name: "Get Inventory",
      test: () => GameAPI.getInventory(),
    },
    {
      name: "Get Game State",
      test: () => GameAPI.getGameState(),
    },
  ]

  for (const { name, test } of tests) {
    try {
      console.log(`🧪 Testing: ${name}`)
      const startTime = Date.now()
      const result = await test()
      const duration = Date.now() - startTime

      console.log(`✅ ${name} - Success (${duration}ms)`)
      console.log(`📊 Response:`, JSON.stringify(result, null, 2))
      console.log("─".repeat(50))
    } catch (error) {
      console.log(`❌ ${name} - Failed`)
      console.log(`🚨 Error:`, error.message)
      console.log("─".repeat(50))
    }
  }

  console.log("\n🏁 API tests completed!")
}

runTests().catch(console.error)
