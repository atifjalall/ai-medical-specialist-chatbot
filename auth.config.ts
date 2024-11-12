// lib/auth-config.ts
import type { NextAuthConfig } from 'next-auth'
import type { JWT } from 'next-auth/jwt'

export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/login',
    newUser: '/signup',
    error: '/auth/error'
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnLoginPage = nextUrl.pathname.startsWith('/login')
      const isOnSignupPage = nextUrl.pathname.startsWith('/signup')
      const isOnAuthPage = nextUrl.pathname.startsWith('/auth/')
      const isOnProxyPath = nextUrl.pathname.includes('restpath')

      // Allow proxy routes to bypass auth
      if (isOnProxyPath) {
        return true
      }

      // Redirect to home if logged in and trying to access auth pages
      if (isLoggedIn && (isOnLoginPage || isOnSignupPage || isOnAuthPage)) {
        return Response.redirect(new URL('/', nextUrl))
      }

      // Allow access to auth pages if not logged in
      if (!isLoggedIn && (isOnLoginPage || isOnSignupPage || isOnAuthPage)) {
        return true
      }

      // Require auth for all other pages
      return isLoggedIn
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id // Keep original id field
        token.uid = user.id // For compatibility
      }
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.accessToken = token.accessToken as string
      }
      return session
    }
  },
  providers: [] // Configured in auth.ts
}

// Extend the JWT type
declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    uid?: string
    accessToken?: string
  }
}

// Extend the Session type
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
    }
    accessToken?: string
  }
}