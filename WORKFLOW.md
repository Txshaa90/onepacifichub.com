# Development & Deployment Workflow

## 🚀 Your Automated Deployment Pipeline

### Step 1: Make Changes Locally
Edit your code in VS Code, make changes to components, styles, etc.

### Step 2: Commit & Push to Main
```bash
git add .
git commit -m "Update animation / hero"
git push origin main
```

### Step 3: GitHub Actions Automatically Builds
- Workflow triggers on push to `main`
- Installs dependencies
- Runs `npm run build`
- Copies only `dist/*` contents to `deploy` branch
- Force-pushes clean static files

### Step 4: Hostinger Deploys
- Click "Deploy" in Hostinger Git panel
- OR set up webhook for automatic deployment
- Hostinger pulls from `deploy` branch
- Your site updates live!

## ✅ What's Automated

| Action | Automated? | How |
|--------|-----------|-----|
| Build project | ✅ Yes | GitHub Actions |
| Update deploy branch | ✅ Yes | GitHub Actions |
| Push to GitHub | ❌ Manual | `git push origin main` |
| Deploy to Hostinger | ⚡ Optional | Manual click or webhook |

## 📁 Repository Structure

### Main Branch
Contains your source code:
- `src/` - React components
- `public/` - Static assets
- `package.json` - Dependencies
- `.github/workflows/` - Automation

### Deploy Branch
Contains only built static files:
- `index.html`
- `assets/` - Compiled JS & CSS
- `images/` - Product images

## 🔧 Hostinger Configuration

**Repository:** `https://github.com/Txshaa90/onepacifichub.com.git`  
**Branch:** `deploy`  
**Deploy Path:** `/public_html`  
**Output Directory:** `/` (root)  
**Build Command:** *(leave empty)*

## 🎯 Example Workflow

```bash
# 1. Make changes to Hero component
code src/components/Hero.jsx

# 2. Test locally
npm run dev

# 3. Commit changes
git add .
git commit -m "Update hero animation"
git push origin main

# 4. Wait 30 seconds for GitHub Actions to complete
# Check: https://github.com/Txshaa90/onepacifichub.com/actions

# 5. Deploy on Hostinger (click Deploy button)
# Your site is now live with changes! 🎉
```

## 🔄 Continuous Updates

Every time you push to `main`:
1. GitHub Actions builds automatically
2. Deploy branch updates with fresh build
3. Hostinger can pull latest changes
4. Site updates live

No manual building, no manual file management! ✨
