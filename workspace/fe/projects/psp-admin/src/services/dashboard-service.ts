// projects/psp-admin/src/services/dashboard-service.ts
import { transactions } from '@/lib/mock-data' // Using as base for stats

export interface DashboardStats {
  totalVolume: number
  totalCount: number
  successRate: number
  avgTicketSize: number
}

export interface ChartDataPoint {
  date: string
  value: number
}

export interface DashboardData {
  stats: DashboardStats
  revenueChart: ChartDataPoint[]
  recentActivity: any[] // Reusing transaction type or simplified
}

const LATENCY_MS = 800

export const DashboardService = {
  async getOverview(): Promise<DashboardData> {
    await new Promise(resolve => setTimeout(resolve, LATENCY_MS))
    
    // Mock Calculation
    const totalVolume = transactions.reduce((acc, t) => acc + t.amount, 0)
    const successCount = transactions.filter(t => t.status === 'success').length
    const totalCount = transactions.length
    
    // Mock Chart Data (Last 7 days)
    const chartData = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      return {
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: Math.floor(Math.random() * 5000) + 1000
      }
    })

    return {
      stats: {
        totalVolume,
        totalCount,
        successRate: totalCount > 0 ? (successCount / totalCount) * 100 : 0,
        avgTicketSize: totalCount > 0 ? totalVolume / totalCount : 0
      },
      revenueChart: chartData,
      recentActivity: transactions.slice(0, 5)
    }
  }
}
