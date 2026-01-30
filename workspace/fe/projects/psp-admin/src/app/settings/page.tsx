export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-text">Settings</h2>
        <p className="text-sm text-text-muted mt-0.5">Manage your platform settings</p>
      </div>

      {/* General */}
      <div className="rounded-xl border border-border bg-surface">
        <div className="border-b border-border px-6 py-4">
          <h3 className="text-sm font-semibold text-text">General</h3>
        </div>
        <div className="space-y-5 p-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">Platform Name</label>
            <input
              type="text"
              defaultValue="PSP Admin"
              className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">Support Email</label>
            <input
              type="email"
              defaultValue="support@psp.com"
              className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">Default Currency</label>
            <select className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100">
              <option>USD - US Dollar</option>
              <option>CNY - Chinese Yuan</option>
              <option>EUR - Euro</option>
              <option>SGD - Singapore Dollar</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border border-border bg-surface">
        <div className="border-b border-border px-6 py-4">
          <h3 className="text-sm font-semibold text-text">Notifications</h3>
        </div>
        <div className="divide-y divide-border-light">
          {[
            { label: 'Transaction alerts', desc: 'Get notified for failed transactions', checked: true },
            { label: 'New merchant sign-ups', desc: 'Notification when a new merchant registers', checked: true },
            { label: 'Daily summary', desc: 'Receive daily transaction summary email', checked: false },
            { label: 'Payout reminders', desc: 'Remind pending payouts', checked: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-medium text-text">{item.label}</p>
                <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" defaultChecked={item.checked} className="peer sr-only" />
                <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-all peer-checked:bg-primary-600 peer-checked:after:translate-x-full" />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* API Keys */}
      <div className="rounded-xl border border-border bg-surface">
        <div className="border-b border-border px-6 py-4">
          <h3 className="text-sm font-semibold text-text">API Keys</h3>
        </div>
        <div className="space-y-4 p-6">
          {[
            { label: 'Live Key', key: 'pk_live_••••••••••••9a2f', status: 'active' },
            { label: 'Test Key', key: 'pk_test_••••••••••••b3d8', status: 'active' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-lg border border-border-light bg-surface-dim px-4 py-3">
              <div>
                <p className="text-sm font-medium text-text">{item.label}</p>
                <p className="font-mono text-xs text-text-muted mt-0.5">{item.key}</p>
              </div>
              <button className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-hover">
                Reveal
              </button>
            </div>
          ))}
          <button className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Generate new key
          </button>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700">
          Save Changes
        </button>
      </div>
    </div>
  )
}
