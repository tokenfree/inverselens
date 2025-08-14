# InverseLens Deployment Checklist for Render.com

## Pre-deployment Setup

### 1. Environment Variables Required:
- [ ] `DATABASE_URL` - PostgreSQL connection string from Render database
- [ ] `GOOGLE_API_KEY` - Your Google Gemini API key
- [ ] `NODE_ENV` - Set to "production"
- [ ] `PORT` - Will be automatically set by Render (usually 10000)

### 2. Repository Setup:
- [ ] All code committed and pushed to Git repository
- [ ] Repository connected to your Render account
- [ ] render.yaml file is in the root directory

### 3. Database Setup:
- [ ] PostgreSQL database created on Render
- [ ] Database URL copied and added to web service environment variables
- [ ] Database migrations ready to run after deployment

## Deployment Steps:

### 1. Create PostgreSQL Database:
1. Go to Render Dashboard
2. Click "New +" → "PostgreSQL"
3. Name: `inverselens-db`
4. Plan: Choose appropriate plan
5. Wait for database to be ready
6. Copy the "Internal Database URL"

### 2. Create Web Service:
1. Click "New +" → "Web Service"
2. Connect your Git repository
3. Configure:
   - Name: `inverselens`
   - Environment: `Node`
   - Region: Choose closest to your users
   - Branch: `main` (or your default branch)
   - Build Command: `npm run build`
   - Start Command: `npm run start`

### 3. Set Environment Variables:
Add these in the web service environment variables section:
```
NODE_ENV=production
DATABASE_URL=[paste your internal database URL here]
GOOGLE_API_KEY=[your Gemini API key here]
```

### 4. Deploy:
1. Click "Create Web Service"
2. Wait for initial deployment to complete
3. Check build logs for any errors

### 5. Post-Deployment:
1. Run database migrations:
   - Go to your web service dashboard
   - Click "Shell"
   - Run: `npm run db:push`
2. Test your application URL
3. Verify image upload and analysis functionality

## Troubleshooting:

### Common Issues:
- **Build fails**: Check that all dependencies are in package.json
- **Database connection fails**: Verify DATABASE_URL is correct
- **API errors**: Ensure GOOGLE_API_KEY is set and valid
- **Static files not loading**: Check that build process completed successfully

### Monitoring:
- Check logs in Render dashboard
- Monitor resource usage
- Set up uptime monitoring if needed

## Important Notes:
- Render uses ephemeral file system - uploaded files are temporary
- Database is persistent across deployments
- Environment variables are encrypted at rest
- SSL certificates are automatically managed

## Support:
- Render documentation: https://render.com/docs
- Google Gemini API docs: https://ai.google.dev/
