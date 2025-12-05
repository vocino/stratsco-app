'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="bg-gray-800 text-white">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          StratsCo
        </Link>

        <div className="flex items-center gap-4">
          {status === 'loading' && <div>Loading...</div>}

          {status === 'authenticated' && session.user && (
            <>
              <Link href="/dashboard" className="hover:text-gray-300">
                Dashboard
              </Link>
              <span className="text-sm text-gray-400">
                {session.user.name}
              </span>
              <button
                onClick={() => signOut()}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              >
                Sign Out
              </button>
            </>
          )}

          {status === 'unauthenticated' && (
            <button
              onClick={() => signIn('discord')}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded"
            >
              Sign In with Discord
            </button>
          )}
        </div>
      </nav>
    </header>
  )
}
