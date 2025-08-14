# InverseLens - Deployment Ready

## Overview
InverseLens is a web application that analyzes images using Google's Gemini AI and provides both original analysis and "mirror universe" interpretations of the images.

## Features
- Image upload and analysis
- AI-powered image description and mood detection
- "Mirror universe" alternative interpretations
- PostgreSQL database storage
- Modern React frontend with TypeScript
- Express.js backend

## Deployment to Render.com

### Quick Deploy
1. Fork/clone this repository
2. Create a PostgreSQL database on Render
3. Create a web service with:
   - Build Command: `npm run build`
   - Start Command: `npm run start`
4. Set environment variables (see below)
5. Deploy!

### Required Environment Variables
```
DATABASE_URL=your_postgresql_connection_string
GOOGLE_API_KEY=your_google_gemini_api_key
NODE_ENV=production
```

### Post-Deployment
After successful deployment, run database migrations:
```bash
npm run db:push
```

## Files Added for Render Deployment
- `render.yaml` - Render service configuration
- `Dockerfile` - Container configuration (optional)
- `DEPLOYMENT.md` - Detailed deployment guide
- `scripts/migrate.js` - Database migration script
- `server/database.ts` - PostgreSQL database integration

## Architecture
```
├── client/          # React frontend (Vite + TypeScript)
├── server/          # Express.js backend
├── shared/          # Shared types and schemas
├── dist/            # Built application (generated)
└── migrations/      # Database migrations
```

## Development
```bash
npm install
npm run dev
```

## Production Build
```bash
npm run build
npm start
```

## Support
- [Render.com Documentation](https://render.com/docs)
- [Google Gemini API](https://ai.google.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)

---

Ready for deployment to Render.com! 🚀
