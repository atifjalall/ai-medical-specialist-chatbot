// app/auth/error/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams?.get('error')

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-lg dark:bg-zinc-900">
        <h1 className="mb-4 text-2xl font-bold text-red-600">Authentication Error</h1>
        <p className="mb-4 text-zinc-600 dark:text-zinc-300">
          {error === 'AccessDenied' 
            ? 'You do not have permission to sign in.'
            : 'There was a problem signing you in.'}
        </p>
        <Link
          href="/login"
          className="inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
        >
          Back to Login
        </Link>
      </div>
    </div>
  )
}