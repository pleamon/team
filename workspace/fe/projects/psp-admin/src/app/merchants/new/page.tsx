import Link from 'next/link'

export default function NewMerchantPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Link href="/merchants" className="hover:text-text transition-colors">Merchants</Link>
        <span>/</span>
        <span className="text-text">New Merchant</span>
      </div>

      <div className="rounded-xl border border-border bg-surface">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-text">Add New Merchant</h2>
          <p className="text-sm text-text-muted mt-0.5">Fill in the merchant details below</p>
        </div>

        <form className="space-y-5 p-6">
          {/* Company Name */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">Company Name</label>
            <input
              type="text"
              placeholder="Enter company name"
              className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted outline-none transition-colors focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">Business Email</label>
            <input
              type="email"
              placeholder="email@company.com"
              className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted outline-none transition-colors focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          {/* Grid: Country + Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">Country</label>
              <select className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text outline-none transition-colors focus:border-primary-400 focus:ring-2 focus:ring-primary-100">
                <option>United States</option>
                <option>China</option>
                <option>Singapore</option>
                <option>Japan</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">Currency</label>
              <select className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text outline-none transition-colors focus:border-primary-400 focus:ring-2 focus:ring-primary-100">
                <option>USD</option>
                <option>CNY</option>
                <option>SGD</option>
                <option>JPY</option>
                <option>EUR</option>
              </select>
            </div>
          </div>

          {/* Website */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">Website URL</label>
            <input
              type="url"
              placeholder="https://company.com"
              className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted outline-none transition-colors focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          {/* Business Type */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">Business Type</label>
            <select className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text outline-none transition-colors focus:border-primary-400 focus:ring-2 focus:ring-primary-100">
              <option>E-Commerce</option>
              <option>SaaS / Subscription</option>
              <option>Gaming</option>
              <option>Travel & Hospitality</option>
              <option>Education</option>
              <option>Healthcare</option>
              <option>Other</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">Notes</label>
            <textarea
              rows={3}
              placeholder="Additional information..."
              className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted outline-none transition-colors focus:border-primary-400 focus:ring-2 focus:ring-primary-100 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/merchants"
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
            >
              Create Merchant
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
