// components/login-form.tsx
'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { authenticate } from '@/app/login/actions'
import Link from 'next/link'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { IconSpinner } from './ui/icons'
import { getMessageFromCode } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { FcGoogle } from 'react-icons/fc'
import { signIn } from 'next-auth/react'
import { FaApple } from 'react-icons/fa'

export default function LoginForm() {
  const router = useRouter()
  const [result, dispatch] = useFormState(authenticate, undefined)

  useEffect(() => {
    if (result) {
      if (result.type === 'error') {
        toast.error(getMessageFromCode(result.resultCode))
      } else {
        toast.success(getMessageFromCode(result.resultCode))
        router.refresh()
      }
    }
  }, [result, router])

  const handleGoogleLogin = async () => {
    try {
      const result = await signIn('google', {
        callbackUrl: '/',
        redirect: true
      })
      
      if (result?.error) {
        toast.error('Failed to sign in with Google')
      }
    } catch (error) {
      console.error('Google sign in error:', error)
      toast.error('Failed to sign in with Google')
    }
  }

  const handleAppleLogin = async () => {
    try {
      await signIn('apple', { callbackUrl: '/' })
    } catch (error) {
      toast.error('Failed to sign in with Apple')
    }
  }

  return (
    <form
      action={dispatch}
      className="flex flex-col items-center gap-4 space-y-3"
    >
      <div className="w-full flex-1 rounded-xl border bg-white px-6 pb-4 pt-8 shadow-md md:w-96 dark:bg-zinc-950">
        <h1 className="mb-3 text-2xl font-bold">Please log in to continue.</h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-zinc-400"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-lg border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-zinc-400"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-lg border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
            </div>
          </div>
        </div>

        <LoginButton />

        <div className="my-4 flex items-center justify-between">
          <div className="h-px flex-1 bg-zinc-300"></div>
          <span className="mx-4 text-sm text-zinc-400">or</span>
          <div className="h-px flex-1 bg-zinc-300"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex h-10 w-full items-center justify-center rounded-lg border bg-white shadow-md hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700"
        >
          <FcGoogle className="h-5 w-5 mr-2" />
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            Continue with Google
          </span>
        </button>
        <div className="h-3"></div>
        <button
          type="button"
          onClick={handleAppleLogin}
          className="flex h-10 w-full items-center justify-center rounded-lg border bg-black hover:bg-zinc-900 dark:bg-black dark:hover:bg-zinc-900"
        >
          <FaApple className="h-5 w-5 mr-2 text-white" />
          <span className="text-sm font-semibold text-white">
            Continue with Apple
          </span>
        </button>

        <div className="mt-4 text-center">
          <Link
            href="/forgot-password"
            className="text-sm text-zinc-400 hover:text-zinc-600"
          >
            Forgot Password?
          </Link>
        </div>
      </div>

      <Link
        href="/signup"
        className="flex flex-row gap-1 text-sm text-zinc-400"
      >
        No account yet? <div className="font-semibold underline">Sign up</div>
      </Link>
    </form>
  )
}

function LoginButton() {
  const { pending } = useFormStatus()

  return (
    <button
      className="my-4 flex h-10 w-full flex-row items-center justify-center rounded-lg bg-zinc-900 p-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      aria-disabled={pending}
    >
      {pending ? <IconSpinner /> : 'Log in'}
    </button>
  )
}
