# 🚀 Quick Deployment Guide

## Deploy to Netlify in 3 Steps

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: COD E-commerce website"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Connect to Netlify
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** and authorize Netlify
4. Select your repository: `Shoping-store`

### Step 3: Deploy
Netlify will automatically detect settings from `netlify.toml`:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Functions directory**: `netlify/functions`

Click **"Deploy site"** and wait 2-3 minutes!

## ✅ Your Site is Live!

Once deployed, you'll get a URL like: `https://your-site-name.netlify.app`

### Test Your Deployment

1. **User Side**:
   - Visit homepage: `https://your-site-name.netlify.app/`
   - Browse 8 sample products
   - Add items to cart
   - Place a COD order

2. **Admin Side**:
   - Visit: `https://your-site-name.netlify.app/admin`
   - Login with:
     - Email: `admin@shop.com`
     - Password: `admin123`
   - Manage products and orders

## 🎯 What's Already Done

✅ All 30 files created  
✅ Dependencies installed  
✅ MongoDB seeded with 8 products  
✅ Local testing successful  
✅ Ready for production deployment  

## 📝 Admin Credentials

**Save these for admin access:**
- Email: `admin@shop.com`
- Password: `admin123`
- Admin URL: `/admin`

## 🔧 Optional: Custom Domain

After deployment, you can add a custom domain:
1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Follow Netlify's instructions

---

**Need help?** Check the [README.md](file:///c:/Users/nihal/Desktop/Shoping-store/README.md) for detailed documentation.
