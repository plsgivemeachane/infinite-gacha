"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GameAPI } from "@/lib/api"
import { Code, Play, RefreshCw, Database, Trophy, Package } from "lucide-react"

interface TestResult {
  endpoint: string
  status: "success" | "error" | "loading"
  data?: any
  error?: string
  timestamp: string
}

export function ApiTestPanel() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isVisible, setIsVisible] = useState(false)

  const addTestResult = (result: Omit<TestResult, "timestamp">) => {
    const newResult: TestResult = {
      ...result,
      timestamp: new Date().toLocaleTimeString(),
    }
    setTestResults((prev) => [newResult, ...prev.slice(0, 9)]) // Keep last 10 results
  }

  const testPullEndpoint = async (packType: string) => {
    addTestResult({ endpoint: `/api/pull (${packType})`, status: "loading" })

    try {
      console.log("[v0] Testing pull endpoint with pack type:", packType)
      const result = await GameAPI.pullCard(packType)
      console.log("[v0] Pull test result:", result)

      addTestResult({
        endpoint: `/api/pull (${packType})`,
        status: "success",
        data: result,
      })
    } catch (error) {
      console.error("[v0] Pull test failed:", error)
      addTestResult({
        endpoint: `/api/pull (${packType})`,
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  const testLeaderboardEndpoint = async () => {
    addTestResult({ endpoint: "/api/leaderboard", status: "loading" })

    try {
      console.log("[v0] Testing leaderboard endpoint")
      const result = await GameAPI.getLeaderboard()
      console.log("[v0] Leaderboard test result:", result)

      addTestResult({
        endpoint: "/api/leaderboard",
        status: "success",
        data: result,
      })
    } catch (error) {
      console.error("[v0] Leaderboard test failed:", error)
      addTestResult({
        endpoint: "/api/leaderboard",
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  const testInventoryEndpoint = async () => {
    addTestResult({ endpoint: "/api/inventory", status: "loading" })

    try {
      console.log("[v0] Testing inventory endpoint")
      const result = await GameAPI.getInventory()
      console.log("[v0] Inventory test result:", result)

      addTestResult({
        endpoint: "/api/inventory",
        status: "success",
        data: result,
      })
    } catch (error) {
      console.error("[v0] Inventory test failed:", error)
      addTestResult({
        endpoint: "/api/inventory",
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  const testGameStateEndpoint = async () => {
    addTestResult({ endpoint: "/api/gamestate (derived)", status: "loading" })

    try {
      console.log("[v0] Testing game state endpoint")
      const result = await GameAPI.getGameState()
      console.log("[v0] Game state test result:", result)

      addTestResult({
        endpoint: "/api/gamestate (derived)",
        status: "success",
        data: result,
      })
    } catch (error) {
      console.error("[v0] Game state test failed:", error)
      addTestResult({
        endpoint: "/api/gamestate (derived)",
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  const clearResults = () => {
    setTestResults([])
  }

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          className="bg-primary/20 hover:bg-primary/30 border border-primary/30"
          size="sm"
        >
          <Code className="w-4 h-4 mr-2" />
          API Tests
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[80vh] overflow-hidden">
      <Card className="bg-card/95 backdrop-blur-sm border border-border/50 shadow-xl">
        <div className="p-4 border-b border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">API Test Panel</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)} className="h-6 w-6 p-0">
              ×
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {/* Test Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => testPullEndpoint("basic")}
              className="bg-card/50 border-border/30 hover:bg-primary/10"
            >
              <Package className="w-3 h-3 mr-1" />
              Pull Basic
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => testPullEndpoint("premium")}
              className="bg-card/50 border-border/30 hover:bg-primary/10"
            >
              <Package className="w-3 h-3 mr-1" />
              Pull Premium
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={testLeaderboardEndpoint}
              className="bg-card/50 border-border/30 hover:bg-primary/10"
            >
              <Trophy className="w-3 h-3 mr-1" />
              Leaderboard
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={testInventoryEndpoint}
              className="bg-card/50 border-border/30 hover:bg-primary/10"
            >
              <Database className="w-3 h-3 mr-1" />
              Inventory
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={testGameStateEndpoint}
            className="w-full bg-card/50 border-border/30 hover:bg-primary/10"
          >
            <Play className="w-3 h-3 mr-1" />
            Test Game State
          </Button>

          {testResults.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearResults}
              className="w-full text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Clear Results
            </Button>
          )}
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="border-t border-border/30 max-h-64 overflow-y-auto">
            <div className="p-3 space-y-2">
              <h4 className="text-sm font-medium text-foreground">Recent Tests</h4>
              {testResults.map((result, index) => (
                <div key={index} className="p-2 rounded bg-card/30 border border-border/20 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-foreground">{result.endpoint}</span>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`
                          text-xs px-1 py-0
                          ${result.status === "success" ? "bg-green-500/10 border-green-500/30 text-green-400" : ""}
                          ${result.status === "error" ? "bg-red-500/10 border-red-500/30 text-red-400" : ""}
                          ${result.status === "loading" ? "bg-blue-500/10 border-blue-500/30 text-blue-400" : ""}
                        `}
                      >
                        {result.status}
                      </Badge>
                      <span className="text-muted-foreground">{result.timestamp}</span>
                    </div>
                  </div>

                  {result.error && <div className="text-red-400 text-xs mt-1">Error: {result.error}</div>}

                  {result.data && (
                    <details className="mt-1">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                        View Response
                      </summary>
                      <pre className="mt-1 p-2 bg-muted/20 rounded text-xs overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
