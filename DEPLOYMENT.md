# 🚀 Deployment Guide for AT&T Proto Buy Flow

This guide covers how to deploy your AT&T Proto Buy Flow application with proper Groq API key configuration.

## 🔐 API Key Setup Options

### Option 1: GitHub Pages (Recommended for Public Repos)

**Best for**: Public repositories, demo purposes, user-provided API keys

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Add API key configuration system"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: "main"
   - Your site: `https://yourusername.github.io/ATTProtoBuyFlow`

3. **API Key Handling**
   - Users will be prompted to enter their Groq API key on first visit
   - Key is stored securely in browser localStorage
   - No server-side configuration needed
   - Each user uses their own API key

**Pros**: 
- ✅ Free hosting
- ✅ No API key exposure in code
- ✅ Users control their own API usage
- ✅ Perfect for demos and portfolios

**Cons**: 
- ❌ Users need to get their own API key
- ❌ Extra setup step for users

### Option 2: Netlify with Environment Variables

**Best for**: Private deployments, team use, production apps

1. **Connect to Netlify**
   - Go to https://netlify.com
   - "New site from Git" → Connect GitHub repo
   - Deploy automatically

2. **Set Environment Variables**
   - Netlify Dashboard → Site Settings → Environment Variables
   - Add variable: `GROQ_API_KEY` = `your_actual_api_key`
   - Redeploy site

3. **Update Code for Server Environment**
   ```javascript
   // The config.js already handles this automatically
   // It will use process.env.GROQ_API_KEY if available
   ```

### Option 3: Vercel Deployment

**Best for**: Professional deployments, team collaboration

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add GROQ_API_KEY
   # Enter your API key when prompted
   ```

### Option 4: Custom Server Deployment

**Best for**: Full control, enterprise use

1. **Create .env file** (never commit this!)
   ```bash
   cp env.example .env
   # Edit .env with your actual API key
   ```

2. **Deploy to your server**
   ```bash
   # Upload files to your web server
   # Ensure .env is in the root directory
   # Configure your server to load environment variables
   ```

## 🔒 Security Best Practices

### For Public Repositories:
- ✅ **Never commit API keys**
- ✅ Use the browser prompt system (already implemented)
- ✅ Add `.env` to `.gitignore`
- ✅ Users provide their own API keys

### For Private Repositories:
- ✅ Use environment variables on hosting platform
- ✅ Store API keys in platform-specific secret management
- ✅ Never commit `.env` files

### API Key Protection:
```bash
# Add to .gitignore
echo ".env" >> .gitignore
echo "*.env" >> .gitignore
```

## 🛠 Configuration Files Explained

### `config.js`
Handles API key management with multiple fallback options:
1. Environment variables (server deployments)
2. localStorage (browser persistence) 
3. User prompt (fallback)

### `env.example`
Template for environment variables:
```bash
GROQ_API_KEY=your_groq_api_key_here
```

## 📋 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] API key configuration method chosen
- [ ] Environment variables set (if using server deployment)
- [ ] `.env` added to `.gitignore`
- [ ] Site deployed and accessible
- [ ] AI functionality tested
- [ ] API key prompt working (if using client-side method)

## 🆘 Troubleshooting

### "API key required" message:
- Check if API key is properly set in environment variables
- Verify the key starts with `gsk_`
- Try refreshing the page and re-entering the key

### AI not responding:
- Check browser console for API errors
- Verify Groq API key is valid at https://console.groq.com/keys
- Check network connectivity

### Environment variables not working:
- Restart your deployment after setting variables
- Check variable name is exactly `GROQ_API_KEY`
- Verify hosting platform supports environment variables

## 🔗 Getting a Groq API Key

1. Visit https://console.groq.com/keys
2. Create a free account
3. Click "Create API Key"
4. Copy the key (starts with `gsk_`)
5. Use in your deployment method of choice

## 📞 Support

- **Groq API Issues**: https://console.groq.com/docs
- **GitHub Pages**: https://docs.github.com/pages
- **Netlify**: https://docs.netlify.com
- **Vercel**: https://vercel.com/docs
