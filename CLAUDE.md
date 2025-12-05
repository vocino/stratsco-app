# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

StratsCo Guild Integration Platform is a unified identity and guild-management system for the StratsCo gaming community. It connects Discord identities with game accounts across multiple games, assigns roles in the StratsCo Discord server, and gives members access to guild-specific channels.

**Core Identity Flow:**
Discord User ↔ Website Account ↔ Game Account ↔ Discord Role

## Technology Stack

- **Frontend & Backend:** Next.js 14+ (App Router) with TypeScript
- **Database:** Prisma + PostgreSQL (Docker locally, Neon/Supabase in production)
- **Authentication:** NextAuth v4 with Discord OAuth2
- **Styling:** Tailwind CSS
- **Discord Integration:** Discord REST API for role management
- **Deployment:** Vercel (production)

## Data Architecture

The system uses a layered data model:

**User** - Core user identity with Discord OAuth credentials
- id, discordId, discordUsername, timestamps
- Can have moderator status and administration privileges

**Guild** - Represents a game community (e.g., Albion Online)
- id, slug, displayName, timestamps

**UserGuild** - Many-to-many relationship between users and guilds
- id, userId, guildId, createdAt

**GameAccount** - Links user identity to in-game characters
- id, userId, guildId, gameAccountId, characterName, rawMetadata
- discordRoleSyncState (PENDING/SYNCED/ERROR), discordRoleSyncError
- Supports retry mechanism for failed syncs

**GuildDiscordConfig** - Maps guilds to Discord roles
- id, guildId, discordRoleId, extraRoles

## Game Integration Architecture

The system uses a **pluggable provider architecture** for game-specific integrations:

- Each game has a dedicated provider implementing a common TypeScript interface
- Providers handle game-specific verification logic (API calls, character validation)
- New games can be added without modifying core system logic
- First implementation: Albion Online API integration

## Discord Role Sync Flow

Critical workflow for role assignment:
1. User links a character → `discordRoleSyncState = PENDING`
2. Backend attempts Discord role assignment via REST API
3. Success → `SYNCED` | Failure → `ERROR` with error message stored
4. Failed syncs can be retried through UI

## Development Strategy

The project follows an incremental build plan:
1. Phase 1 – Authentication skeleton + dashboard UI
2. Phase 2 – Guild membership management
3. Phase 3 – Game account linking (stubbed providers)
4. Phase 4 – Provider architecture implementation
5. Phase 5 – Real Albion API integration
6. Phase 6 – Discord sync state tracking
7. Phase 7 – Live Discord role sync
8. Phase 8 – Hardening + production deployment

## Project Structure

```
app/
├── api/auth/[...nextauth]/  # NextAuth API routes
├── auth/signin/             # Custom sign-in page
├── dashboard/               # Protected dashboard (Phase 1)
├── layout.tsx               # Root layout with Providers & Header
└── page.tsx                 # Landing page

components/
├── Header.tsx               # Main navigation with auth buttons
└── Providers.tsx            # SessionProvider wrapper

lib/
├── auth.ts                  # NextAuth configuration
└── prisma.ts                # Prisma client singleton

prisma/
└── schema.prisma            # Complete database schema (all 5 models)
```

## Local Development

**Initial Setup:**
```bash
cp .env.example .env
# Edit .env with your Discord OAuth credentials
docker compose up -d
npx prisma migrate dev --name init
npm run dev
```

**Database Commands:**
```bash
docker compose up -d           # Start Postgres
docker compose down            # Stop Postgres
npx prisma migrate dev         # Create and run migrations
npx prisma studio              # Explore database in browser
npx prisma db push             # Push schema changes without migration
npx prisma generate            # Regenerate Prisma Client
```

**Development Server:**
```bash
npm run dev      # Start Next.js dev server on localhost:3000
npm run build    # Build for production
npm run start    # Start production server
```

## Production Deployment

- Platform: Vercel
- Database: Neon or Supabase Postgres
- Required secrets: Discord OAuth credentials, Discord bot token
- Environment variables managed through Vercel dashboard

## Key Design Principles

1. **Layered Complexity** - Core experience works with minimal features; additional integrations added cleanly
2. **Modular Game Support** - Provider pattern allows adding new games without touching core logic
3. **Resilient Role Sync** - State tracking and retry mechanism for Discord integration failures
4. **Progressive Enhancement** - Build in stages from MVP to full-featured platform
