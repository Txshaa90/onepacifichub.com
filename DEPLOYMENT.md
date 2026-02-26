# Deployment Guide

## GitHub Pages Deployment

This project is configured to automatically deploy to GitHub Pages when you push to the `main` or `deploy` branch.

### Setup Steps

1. **Enable GitHub Pages in your repository:**
   - Go to your repository: https://github.com/Txshaa90/onepacifichub-improved
   - Navigate to `Settings` > `Pages`
   - Under "Build and deployment":
     - Source: Select `GitHub Actions`

2. **Push your changes:**
   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push origin deploy
   ```

3. **Wait for deployment:**
   - Go to the `Actions` tab in your GitHub repository
   - Watch the deployment workflow run
   - Once complete, your site will be live at: `https://txshaa90.github.io/onepacifichub-improved/`

### Manual Deployment (Alternative)

If you prefer to deploy manually using gh-pages:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Deploy:**
   ```bash
   npm run deploy
   ```

This will build the project and push it to the `gh-pages` branch.

### Local Development

```bash
npm run dev
```

The site will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Important Notes

- The `base` path in `vite.config.js` is set to `/onepacifichub-improved/` to match your GitHub repository name
- Make sure GitHub Pages is enabled in your repository settings
- The workflow triggers on pushes to `main` or `deploy` branches
