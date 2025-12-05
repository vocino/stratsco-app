import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold mb-4">Welcome, {session.user.name}!</h1>
          <p className="text-gray-600 mb-6">
            This is your guild management dashboard. Here you'll be able to:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Join and manage guild memberships
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Link your in-game characters
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Get automatically assigned Discord roles
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Your Guilds</h2>
            <p className="text-gray-500 italic">No guilds joined yet</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Linked Accounts</h2>
            <p className="text-gray-500 italic">No game accounts linked yet</p>
          </div>
        </div>
      </div>
    </div>
  )
}
