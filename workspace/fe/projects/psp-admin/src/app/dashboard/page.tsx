'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import { ArrowUpRight, DollarSign, Activity, Users, CreditCard, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatCurrency } from '@/lib/utils'
import { DashboardService, type DashboardData } from '@/services/dashboard-service'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await DashboardService.getOverview()
        setData(res)
      } catch {
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <DashboardSkeleton />
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <div className="bg-red-50 p-3 rounded-full mb-3">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">Error Loading Dashboard</h3>
        <p className="text-gray-500 mt-1">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 text-primary-600 font-medium hover:underline"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!data) return null // Should not happen if loading/error handled

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-text">Overview</h2>
        <p className="text-sm text-text-muted mt-0.5">Welcome back, here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Total Volume" 
          value={formatCurrency(data.stats.totalVolume, 'USD')} 
          icon={DollarSign} 
          trend="+12.5%" 
          trendUp 
        />
        <StatCard 
          label="Transactions" 
          value={data.stats.totalCount.toString()} 
          icon={Activity} 
          trend="+5.2%" 
          trendUp 
        />
        <StatCard 
          label="Success Rate" 
          value={`${data.stats.successRate.toFixed(1)}%`} 
          icon={CheckCircleIcon} // Swapped for inline SVG or import below
          trend="-0.4%" 
          trendUp={false} 
        />
        <StatCard 
          label="Avg Ticket" 
          value={formatCurrency(data.stats.avgTicketSize, 'USD')} 
          icon={CreditCard} 
          trend="+2.1%" 
          trendUp 
        />
      </div>

      {/* Main Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-text">Revenue Trend</h3>
            <select className="text-xs border-none bg-gray-50 rounded px-2 py-1 outline-none text-text-secondary">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.revenueChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#6B7280' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#6B7280' }} 
                  tickFormatter={(val) => `$${val/1000}k`}
                />
                <Tooltip 
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-text">Recent Activity</h3>
            <Link href="/transactions" className="text-xs text-primary-600 hover:underline flex items-center">
              View All <ArrowUpRight className="h-3 w-3 ml-0.5" />
            </Link>
          </div>
          <div className="space-y-4">
            {data.recentActivity.map((tx: any) => (
              <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                    ${tx.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {tx.merchantName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text">{tx.merchantName}</p>
                    <p className="text-xs text-text-muted">{tx.type} • {tx.id.slice(-4)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-text">{formatCurrency(tx.amount, tx.currency)}</p>
                  <StatusBadge status={tx.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, trend, trendUp }: any) {
  return (
    <div className="bg-surface p-5 rounded-xl border border-border shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-muted">{label}</p>
          <h4 className="text-2xl font-bold text-text mt-1">{value}</h4>
        </div>
        <div className="p-2 bg-gray-50 rounded-lg">
          <Icon className="h-5 w-5 text-gray-500" />
        </div>
      </div>
      <div className="mt-3 flex items-center text-xs">
        <span className={`font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          {trend}
        </span>
        <span className="text-text-muted ml-1.5">vs last month</span>
      </div>
    </div>
  )
}

function CheckCircleIcon(props: any) {
  return <Users {...props} /> // Fallback icon for Success Rate
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-32 bg-gray-200 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[380px] bg-gray-200 rounded-xl" />
        <div className="h-[380px] bg-gray-200 rounded-xl" />
      </div>
    </div>
  )
}
