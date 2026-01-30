export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-dim">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white font-bold text-lg">
            P
          </div>
          <h1 className="mt-4 text-xl font-bold text-text">Welcome back</h1>
          <p className="mt-1 text-sm text-text-muted">Sign in to PSP Admin</p>
        </div>

        {/* Form */}
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <form className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">Email</label>
              <input
                type="email"
                placeholder="you@company.com"
                className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center justify-between text-sm font-medium text-text">
                Password
                <a href="#" className="text-xs font-normal text-primary-600 hover:text-primary-700">Forgot?</a>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
            >
              Sign In
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-text-muted">
          © 2026 PSP Admin. All rights reserved.
        </p>
      </div>
    </div>
  )
}
