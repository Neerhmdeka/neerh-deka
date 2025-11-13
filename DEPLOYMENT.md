# Deployment Instructions for neerhdeka.design

## Option 1: Deploy via Vercel Web Interface (Recommended)

1. **Go to Vercel**: Visit https://vercel.com and sign up/login with your GitHub account

2. **Import your repository**:
   - Click "Add New Project"
   - Select "Import Git Repository"
   - Choose your repository: `Neerhmdeka/neerh-deka`
   - Click "Import"

3. **Configure the project**:
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

4. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete

5. **Add your custom domain**:
   - Go to your project settings
   - Navigate to "Domains"
   - Add `neerhdeka.design` and `www.neerhdeka.design`
   - Vercel will provide DNS records to add

6. **Configure DNS on GoDaddy**:
   - Log in to your GoDaddy account
   - Go to DNS Management for neerhdeka.design
   - Add the following records (Vercel will provide exact values):
     - Type: A, Name: @, Value: [Vercel IP]
     - Type: CNAME, Name: www, Value: cname.vercel-dns.com
   - Or use Vercel's nameservers if preferred

## Option 2: Deploy via Vercel CLI

1. **Install and login**:
   ```bash
   npx vercel login
   ```

2. **Deploy**:
   ```bash
   npx vercel --prod
   ```

3. **Add domain**:
   ```bash
   npx vercel domains add neerhdeka.design
   ```

4. **Follow DNS instructions** from Vercel to configure GoDaddy

## Important Notes

- Your site is already built and ready to deploy
- All files are committed to GitHub
- The build was successful (verified)
- After deployment, configure DNS on GoDaddy to point to Vercel

