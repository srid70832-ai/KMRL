# KMRL IntelliDocs - Deployment Guide

## Issue Summary

The Vercel deployment at `https://kmrl-sand.vercel.app/` is returning 404 errors for API endpoints because the Express backend is not properly configured for Vercel's serverless environment.

## Root Cause

- **Local Deployment**: Works perfectly because both frontend and backend run on the same Node.js server (`npm run dev` → `tsx server.ts`)
- **Vercel Static Deployment**: Only deploys the frontend (built Vite artifacts), without the Express backend

## Solutions

### Option 1: Redeploy to Vercel as Full-Stack (Recommended)

The `vercel.json` and `.vercelignore` files have been added to enable Vercel to deploy this as a full-stack Node.js application.

**Steps:**
1. Connect your GitHub repo to Vercel at https://vercel.com
2. Select the KMRL repository
3. Vercel will auto-detect the configuration and deploy with both frontend and backend
4. The build will:
   - Build the Vite frontend → `dist/`
   - Bundle the Express backend → `dist/server.cjs`
   - Route API calls to the Node.js backend

**To redeploy:**
- Push a new commit to the `main` branch, or
- Go to Vercel dashboard → click "Redeploy" on the kmrl-sand project

### Option 2: Deploy Backend Separately

Deploy the backend on a separate service (Railway, Render, Heroku) and update the frontend to use an external API URL.

**Steps:**
1. Deploy backend service separately
2. Add `VITE_API_BASE_URL` environment variable to frontend
3. Update `src/context/AuthContext.tsx` to use the base URL:

```typescript
const API_BASE_URL = process.env.VITE_API_BASE_URL || '/api';

fetch(`${API_BASE_URL}/auth/users`)
```

### Option 3: Convert to Serverless Functions

Create Vercel API routes (`/api/` folder with serverless functions) instead of Express routes.

**Steps:**
1. Create `/api/` folder in root
2. Convert each Express route to a serverless function
3. Deploy to Vercel

## Current Configuration

- **Framework**: React + Vite (frontend)
- **Backend**: Express.js (Node.js)
- **Build Command**: `npm run build` (builds both frontend and backend)
- **Start Command**: `npm run start` (runs compiled Node.js server)

## Testing Locally

```bash
npm run dev      # Full-stack development (frontend + backend)
npm run build    # Build for production
npm run start    # Start production server
```

## Environment Variables Needed

For production deployment, ensure these are configured:
- `GEMINI_API_KEY` (if using Google Gemini AI)
- Any other API keys required by backend services

## Next Steps

1. **Verify Vercel Configuration**: Check that `vercel.json` is properly configured
2. **Redeploy**: Trigger a new deployment from Vercel dashboard
3. **Monitor**: Check Vercel logs for any deployment errors
4. **Test**: Once deployed, test the API endpoints at `https://kmrl-sand.vercel.app/api/health`

## Troubleshooting

If deployment still fails:

1. Check Vercel Build Logs for errors
2. Verify Node.js version compatibility (currently configured for Node 20.x)
3. Check if all dependencies are properly listed in `package.json`
4. Ensure environment variables are set in Vercel project settings
