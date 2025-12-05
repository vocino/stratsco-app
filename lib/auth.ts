import { NextAuthOptions } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account || account.provider !== 'discord') return false

      // Upsert user in database
      await prisma.user.upsert({
        where: { discordId: account.providerAccountId },
        update: {
          discordUsername: profile?.username || user.name || 'Unknown',
        },
        create: {
          discordId: account.providerAccountId,
          discordUsername: profile?.username || user.name || 'Unknown',
        },
      })

      return true
    },
    async session({ session, token }) {
      if (session.user) {
        // Add Discord ID to session
        const user = await prisma.user.findUnique({
          where: { discordId: token.sub! },
        })

        if (user) {
          session.user.id = user.id
          session.user.discordId = user.discordId
          session.user.isModerator = user.isModerator
        }
      }
      return session
    },
    async jwt({ token, account }) {
      if (account) {
        token.sub = account.providerAccountId
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}
