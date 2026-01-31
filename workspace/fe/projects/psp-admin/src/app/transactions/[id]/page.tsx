'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Copy, Check, AlertTriangle, ArrowUpRight } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatCurrency } from '@/lib/utils'
import { TransactionService } from '@/services/transaction-service'
import type { Transaction } from '@/types'

export default function TransactionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await TransactionService.getById(id)
        if (!data) {
          setError('Transaction not found')
        } else {
          setTransaction(data)
        }
      } catch (err) {
        setError('Failed to fetch transaction details')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="bg-surface rounded-xl border border-border p-8 h-96 animate-pulse" />
      </div>
    )
  }

  if (error || !transaction) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <div className="h-12 w-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-semibold text-text">Error Loading Transaction</h2>
        <p className="text-text-muted mt-1">{error || 'Unknown error occurred'}</p>
        <button 
          onClick={() => router.back()}
          className="mt-6 text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Nav */}
      <Link 
        href="/transactions" 
        className="inline-flex items-center text-sm font-medium text-text-muted hover:text-text transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Transactions
      </Link>

      {/* Header Card */}
      <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-text">
                {formatCurrency(transaction.amount, transaction.currency)}
              </h1>
              <StatusBadge status={transaction.status} />
            </div>
            <div className="flex items-center gap-2 mt-2 text-sm text-text-muted">
              <span className="font-mono">{transaction.id}</span>
              <button 
                onClick={() => copyToClipboard(transaction.id)}
                className="p-1 hover:bg-gray-100 rounded text-text-secondary"
                title="Copy ID"
              >
                {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm font-medium text-text border border-border rounded-lg hover:bg-gray-50 bg-white">
              Refund
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 shadow-sm">
              Download Receipt
            </button>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-surface rounded-xl border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-gray-50/50">
              <h3 className="text-sm font-semibold text-text">Payment Details</h3>
            </div>
            <div className="p-6 space-y-4">
              <DetailRow label="Type" value={<span className="capitalize">{transaction.type}</span>} />
              <DetailRow label="Method" value={transaction.method} />
              <DetailRow label="Reference" value={<span className="font-mono">{transaction.reference}</span>} />
              <DetailRow label="Description" value="Order #12345 from Checkout" />
              <DetailRow label="Created At" value={new Date(transaction.createdAt).toLocaleString()} />
              {/* If we had updated at */}
              <DetailRow label="Last Updated" value={new Date(transaction.createdAt).toLocaleString()} />
            </div>
          </div>

          {/* Timeline (Placeholder) */}
          <div className="bg-surface rounded-xl border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-gray-50/50">
              <h3 className="text-sm font-semibold text-text">Timeline</h3>
            </div>
            <div className="p-6">
              <ol className="relative border-l border-gray-200 ml-2 space-y-6">
                <TimelineItem 
                  title="Payment Succeeded" 
                  time={new Date(transaction.createdAt).toLocaleTimeString()} 
                  desc="Transaction completed successfully."
                  active
                />
                <TimelineItem 
                  title="Payment Started" 
                  time={new Date(new Date(transaction.createdAt).getTime() - 2000).toLocaleTimeString()} 
                  desc="Customer initiated payment."
                />
              </ol>
            </div>
          </div>
        </div>

        {/* Side Panel: Merchant & Customer */}
        <div className="space-y-6">
          <div className="bg-surface rounded-xl border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-gray-50/50">
              <h3 className="text-sm font-semibold text-text">Merchant</h3>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-primary-100 text-primary-700 rounded-lg flex items-center justify-center font-bold">
                  {transaction.merchantName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-text">{transaction.merchantName}</p>
                  <Link href={`/merchants/123`} className="text-xs text-primary-600 hover:underline flex items-center gap-1">
                    View Merchant <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">ID</span>
                  <span className="font-mono text-text-secondary">mch_abc123</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Region</span>
                  <span className="text-text-secondary">SG</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-gray-50/50">
              <h3 className="text-sm font-semibold text-text">Customer</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3 text-sm">
                <div className="flex flex-col">
                  <span className="text-text-muted text-xs mb-1">Email</span>
                  <span className="text-text font-medium">customer@example.com</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-text-muted text-xs mb-1">IP Address</span>
                  <span className="font-mono text-text-secondary">192.168.1.1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string, value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between py-1">
      <span className="text-sm text-text-muted mb-1 sm:mb-0">{label}</span>
      <span className="text-sm font-medium text-text text-right">{value}</span>
    </div>
  )
}

function TimelineItem({ title, time, desc, active }: { title: string, time: string, desc: string, active?: boolean }) {
  return (
    <li className="ml-6">
      <span className={`absolute flex items-center justify-center w-4 h-4 rounded-full -left-2 ring-4 ring-white ${active ? 'bg-green-500' : 'bg-gray-200'}`}>
      </span>
      <h3 className="flex items-center mb-1 text-sm font-semibold text-text">
        {title}
        {active && <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded ml-3">Latest</span>}
      </h3>
      <time className="block mb-2 text-xs font-normal leading-none text-text-muted">{time}</time>
      <p className="mb-4 text-sm font-normal text-text-secondary">{desc}</p>
    </li>
  )
}
