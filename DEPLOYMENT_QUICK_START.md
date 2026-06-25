# Quick Start: Deploy to anishneema.com

## Quick Steps

1. **Go to Cloudflare Dashboard**
   - Visit: https://dash.cloudflare.com/
   - Click "Workers & Pages" → "Create application" → "Pages" → "Connect to Git"

2. **Connect GitHub**
   - Click "Connect to GitHub"
   - Authorize and select: `anishneema/personalwebsite`
   - Click "Begin setup"

3. **Build Settings** (Copy these exactly)
   ```
   Project name: anishneema-portfolio
   Production branch: main
   Framework preset: Next.js (Static HTML Export)
   Build command: npm run build
   Build output directory: out
   Root directory: / (leave empty)
   ```

4. **Deploy**
   - Click "Save and Deploy"
   - Wait 2-3 minutes for first build

5. **Add Custom Domain**
   - In project settings → "Custom domains"
   - Add: `anishneema.com`
   - Add: `www.anishneema.com` (optional)
   - Cloudflare will auto-configure DNS

6. **Verify**
   - Wait 5-10 minutes for DNS
   - Visit: https://anishneema.com

## That's it! 🎉

Your site will auto-deploy on every push to `main` branch.




