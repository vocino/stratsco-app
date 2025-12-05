# StratsCo Guild Integration Platform — Project Requirements

This project is a unified identity + guild-management system for the StratsCo gaming community. It connects Discord identities with game accounts across multiple games, assigns roles in the StratsCo Discord server, and gives members access to guild-specific channels.

The system is intentionally built in layers. The core experience must work with minimal features, and additional integrations can be added cleanly as the project evolves.

## Core Concept

A user arrives at `strats.co`, signs in with Discord, selects which game guilds they belong to (e.g., Albion Online), links their in-game characters via provider-specific APIs, and then automatically receives the correct Discord role(s) for those guilds.

This creates one unified membership identity across:

- Discord User ↔ Website Account ↔ Game Account ↔ Discord Role

## High-Level Architecture

**Frontend & Backend**
- TBD but should be lightweight

**Authentication**
- Users sign in with Discord OAuth2
- Each authenticated user corresponds to a `User` record with:
  - Discord ID
  - Discord username
  - OAuth tokens if needed

**Guilds**
- Each game is represented as a `Guild` (e.g., `albion-online`).
- Users can join or leave guilds from a dashboard UI.
- Each guild may have its own game account linking flow and Discord role configuration.

**Game Account Linking**
- A `GameAccount` ties a User → Guild → in-game identity.
- A pluggable Game Integration Provider handles game-specific verification.
- Providers are modular and based on a defined TypeScript interface.

**Discord Role Sync**
- When a user links a valid game account, a Discord bot assigns the configured role(s) in the StratsCo Discord.
- Role sync uses Discord’s REST API.

## Project Goals

1. Unified identity flow  
2. Flexible game integrations  
3. Automated Discord role updates  
4. Progressive, layered complexity  

## Data Models (Overview)

**User** (a user can be a moderator and can have extra configuration and administration priviledges)
- id, discordId, discordUsername, timestamps

**Guild**
- id, slug, displayName, timestamps

**UserGuild**
- id, userId, guildId, createdAt

**GameAccount**
- id, userId, guildId, gameAccountId, characterName, rawMetadata, discordRoleSyncState, discordRoleSyncError, timestamps

**GuildDiscordConfig**
- id, guildId, discordRoleId, extraRoles

## Discord Role Sync Flow

1. User links a character  
2. System sets `PENDING`  
3. Server attempts assignment via Discord  
4. On success: `SYNCED`  
5. On failure: `ERROR` with message  
6. Retry option available  

## Incremental Build Plan

1. Phase 1 – Skeleton (auth + dashboard)  
2. Phase 2 – Guild membership  
3. Phase 3 – Game accounts (stubbed)  
4. Phase 4 – Provider architecture  
5. Phase 5 – Real Albion API  
6. Phase 6 – Discord sync state  
7. Phase 7 – Discord sync live  
8. Phase 8 – Hardening + deployment  

## Deployment Strategy

**Local**
- Docker Postgres
- `npm run dev`

**Production**
- Vercel
- Neon/Supabase Postgres
- Secret storage in Vercel
- Discord bot credentials required

## Architecture Summary

StratsCo Guild Integration is a modular identity system that unifies Discord authentication, multi-game guild membership, game account verification, and automated Discord role assignment. It uses Next.js (App Router) with Prisma/Postgres, NextAuth for Discord OAuth, and a pluggable provider architecture for adding support for new games. Users log in with Discord, choose their guilds, verify their characters, and automatically receive the correct Discord roles through the bot API. The project evolves in stages from a minimal MVP to a sophisticated, scalable multi-game identity platform.
