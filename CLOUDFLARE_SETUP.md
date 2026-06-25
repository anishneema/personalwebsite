# Cloudflare Pages Deployment Guide

This guide will help you deploy your Next.js portfolio to anishneema.com using Cloudflare Pages.

## Prerequisites
- ✅ GitHub repository: https://github.com/anishneema/personalwebsite
- ✅ Custom domain: anishneema.com (already purchased on Cloudflare)
- ✅ Next.js app with static export configured

## Step 1: Connect GitHub Repository to Cloudflare Pages

1. **Log in to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com/
   - Log in with your Cloudflare account

2. **Navigate to Pages**
   - Click on "Workers & Pages" in the left sidebar
   - Click "Create application"
   - Select "Pages" tab
   - Click "Connect to Git"

3. **Authorize Cloudflare**
   - Click "Connect to GitHub"
   - Authorize Cloudflare to access your GitHub repositories
   - Select the repository: `anishneema/personalwebsite`

## Step 2: Configure Build Settings

Use these settings when setting up your project:

- **Project name**: `anishneema-portfolio` (or any name you prefer)
- **Production branch**: `main`
- **Framework preset**: `Next.js (Static HTML Export)`
- **Build command**: `npm run build`
- **Build output directory**: `out`
- **Root directory**: `/` (leave as default)

### Environment Variables
- No environment variables needed for this static export

## Step 3: Deploy

1. Click "Save and Deploy"
2. Wait for the first deployment to complete (usually 2-3 minutes)
3. Your site will be available at: `https://[project-name].pages.dev`

## Step 4: Configure Custom Domain

1. **In Cloudflare Pages Dashboard**
   - Go to your project settings
   - Click on "Custom domains" tab
   - Click "Set up a custom domain"
   - Enter: `anishneema.com`
   - Click "Continue"

2. **Add www subdomain (optional but recommended)**
   - Click "Set up a custom domain" again
   - Enter: `www.anishneema.com`
   - Click "Continue"

3. **Configure DNS Records in Cloudflare**
   - Go to your domain's DNS settings in Cloudflare
   - Cloudflare Pages should automatically add the necessary DNS records
   - If not, add these records manually:
     - Type: `CNAME`
     - Name: `@` (or root domain)
     - Target: `[project-name].pages.dev`
     - Proxy status: Proxied (orange cloud)
     - Type: `CNAME`
     - Name: `www`
     - Target: `[project-name].pages.dev`
     - Proxy status: Proxied (orange cloud)

## Step 5: SSL/TLS Configuration

1. **In Cloudflare Dashboard**
   - Go to "SSL/TLS" settings for your domain
   - Set encryption mode to "Full" or "Full (strict)"
   - Cloudflare will automatically provision SSL certificates (may take a few minutes)

## Step 6: Verify Deployment

1. Wait 5-10 minutes for DNS propagation
2. Visit https://anishneema.com
3. Your portfolio should be live!

## Automatic Deployments

- Every push to the `main` branch will automatically trigger a new deployment
- Cloudflare Pages will build and deploy your site automatically
- You can see deployment history in the Cloudflare Pages dashboard

## Troubleshooting

### Build Fails
- Check build logs in Cloudflare Pages dashboard
- Verify build command: `npm run build`
- Verify output directory: `out`

### Domain Not Working
- Check DNS records are correct
- Verify SSL/TLS is set to "Full" or "Full (strict)"
- Wait 10-15 minutes for DNS propagation
- Clear your browser cache

### 404 Errors on Routes
- Next.js static export should handle this automatically
- If you have issues, check that `next.config.js` has `output: 'export'`

## Additional Configuration (Optional)

### Custom 404 Page
Your Next.js app already generates a 404.html file in the `out` directory, which Cloudflare Pages will use automatically.

### Performance Optimization
- Cloudflare Pages automatically enables CDN caching
- Images are automatically optimized through Cloudflare's CDN
- No additional configuration needed

## Support

If you encounter any issues:
1. Check Cloudflare Pages deployment logs
2. Verify GitHub repository is connected correctly
3. Ensure DNS records are configured properly
4. Check Cloudflare status page for any outages


