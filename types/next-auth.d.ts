import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      discordId: string
      isModerator: boolean
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}
