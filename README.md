# AI Chief of Staff Dashboard

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/mmoahids-projects/v0-ai-chief-of-staff-dashboard)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/ggwtDHyVgJP)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/mmoahids-projects/v0-ai-chief-of-staff-dashboard](https://vercel.com/mmoahids-projects/v0-ai-chief-of-staff-dashboard)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/ggwtDHyVgJP](https://v0.app/chat/ggwtDHyVgJP)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Local Setup (Supabase + Prisma)

1. Create a Supabase project (PostgreSQL).
2. Copy `.env.example` to `.env.local` and fill in `DATABASE_URL`, `DIRECT_URL`, `FIREFLIES_API_KEY`, and `DASHBOARD_USERNAME`/`DASHBOARD_PASSWORD`.
3. Install deps: `pnpm install`
4. Create tables: `pnpm prisma:migrate --name init` (uses `DIRECT_URL` if set)
5. Start Next.js: `pnpm dev`

## Python Worker

The background worker polls the `job_queue` table and processes jobs (e.g., syncing Fireflies transcripts).

- Install deps: `pip install supabase`
- Run: `python worker.py`
