# CINEFRAME - DEPLOYMENT GUIDE
## Take Your Photography Website LIVE in 10 Minutes

---

## 🚀 FASTEST DEPLOYMENT: Vercel + Railway

### BACKEND (Node.js) on Railway.app - 3 minutes

1. **Go to railway.app**
   - Click "Start a New Project"
   - Select "GitHub"
   - Connect your GitHub repository

2. **Create .env in your repo:**
   ```
   PORT=5000
   JWT_SECRET=super-secret-key-change-this
   NODE_ENV=production
   ```

3. **Deploy**
   - Railway auto-detects Node.js
   - Click "Deploy"
   - Get your live URL: `https://your-app.railway.app`

---

### FRONTEND (React) on Vercel - 3 minutes

1. **Prepare your React app:**
   ```bash
   npx create-react-app photography-portfolio
   cd photography-portfolio
   ```

2. **Replace `src/App.js` with frontend code**

3. **Update API URL in code:**
   ```javascript
   const API_URL = "https://your-app.railway.app";
   // Instead of localhost:5000
   ```

4. **Go to vercel.com**
   - Connect GitHub
   - Select your repository
   - Click "Deploy"
   - Instant URL: `https://your-site.vercel.app`

---

## 📤 UPLOAD YOUR CODE TO GITHUB

### First Time Setup:
```bash
# Create repo on github.com (name: photography-website)

git init
git add .
git commit -m "Initial commit: Full photography website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/photography-website.git
git push -u origin main
```

---

## 🌐 CUSTOM DOMAIN (Optional)

### Step 1: Buy Domain
- Namecheap.com (~$8/year)
- GoDaddy.com
- Or use free: .tk, .ml

### Step 2: Connect to Vercel
1. Go to Vercel Project Settings
2. Click "Domains"
3. Add custom domain
4. Update DNS at registrar:
   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com

5. For apex domain (@):
   - Type: A
   - Value: 76.76.19.165

---

## 💾 DATABASE SETUP (Optional - For Production)

### MongoDB Atlas (Free Tier):

1. **Go to mongodb.com/cloud/atlas**
2. **Create free cluster**
3. **Get connection string:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/photography-db
   ```

4. **Update server.js:**
   ```javascript
   const mongoose = require('mongoose');
   mongoose.connect(process.env.MONGODB_URI);
   ```

5. **Add to environment variables:**
   ```
   MONGODB_URI=your-connection-string
   ```

---

## 📁 FILE STORAGE (Optional)

### AWS S3 for Large Files:

1. **Create AWS account**
2. **Get Access Keys**
3. **Install SDK:**
   ```bash
   npm install aws-sdk
   ```

4. **Update server.js:**
   ```javascript
   const AWS = require('aws-sdk');
   const s3 = new AWS.S3({
     accessKeyId: process.env.AWS_KEY,
     secretAccessKey: process.env.AWS_SECRET
   });
   ```

5. **Add to .env:**
   ```
   AWS_KEY=your-key
   AWS_SECRET=your-secret
   AWS_BUCKET=your-bucket
   ```

---

## 📧 EMAIL NOTIFICATIONS (Optional)

### SendGrid Setup:

1. **Sign up at sendgrid.com**
2. **Get API key**
3. **Install:**
   ```bash
   npm install @sendgrid/mail
   ```

4. **Add to server.js:**
   ```javascript
   const sgMail = require('@sendgrid/mail');
   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
   ```

---

## ✅ DEPLOYMENT CHECKLIST

Before going live:

- [ ] Change JWT_SECRET in .env
- [ ] Set NODE_ENV=production
- [ ] Hide sensitive API keys
- [ ] Test all features on live site
- [ ] Check mobile responsiveness
- [ ] Verify login/registration
- [ ] Test file uploads
- [ ] Test file downloads
- [ ] Set up domain
- [ ] Enable HTTPS
- [ ] Add analytics (Google Analytics)
- [ ] Set up email notifications
- [ ] Create admin account
- [ ] Test client portal
- [ ] Backup database

---

## 📊 MONITORING (Free Options)

### Google Analytics
```html
<!-- Add to frontend -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### Uptime Monitoring
- uptimerobot.com (free)
- pingdom.com

### Error Tracking
- sentry.io (free tier)

---

## 🔒 SECURITY CHECKLIST

- [ ] Use HTTPS everywhere
- [ ] Enable CORS properly
- [ ] Validate all inputs
- [ ] Hash passwords (bcrypt)
- [ ] Rotate JWT secrets
- [ ] Rate limit API calls
- [ ] Log all access
- [ ] Regular backups
- [ ] Monitor suspicious activity
- [ ] Keep dependencies updated

---

## 💰 COST BREAKDOWN

| Service | Cost | Purpose |
|---------|------|---------|
| Vercel | Free ($20+) | Frontend hosting |
| Railway | Free ($5/month) | Backend hosting |
| Domain | ~$8/year | Custom URL |
| MongoDB Atlas | Free (2GB) | Database |
| SendGrid | Free (100/day) | Email |
| AWS S3 | Pay-per-use | File storage |
| **TOTAL** | **~$10-50/year** | **Everything** |

---

## 🎯 NEXT STEPS

1. ✅ Create GitHub account
2. ✅ Upload code
3. ✅ Deploy to Vercel (frontend)
4. ✅ Deploy to Railway (backend)
5. ✅ Connect domain
6. ✅ Test everything
7. ✅ Send to your photographer friend!

---

## 📱 TEST ON ALL DEVICES

```bash
# Test responsive design
- Desktop (1920px, 1366px)
- Tablet (768px)
- Mobile (375px)

# Test browsers
- Chrome
- Firefox
- Safari
- Edge
```

Use: **responsively.app** for easy testing

---

## 🆘 DEPLOYMENT TROUBLESHOOTING

### "Cannot find module"
```bash
npm install
npm ci  # In production
```

### "Port already in use"
```bash
# Change PORT in .env
PORT=8000
```

### "CORS error"
```javascript
// Add to backend
const cors = require('cors');
app.use(cors({
  origin: 'https://your-frontend.vercel.app',
  credentials: true
}));
```

### "File upload failing"
- Check file size limits
- Verify upload folder permissions
- Check disk space

### "Login not working"
- Verify database connection
- Check JWT_SECRET is same everywhere
- Verify user exists in database

---

## 📞 LIVE SUPPORT

Getting stuck?
- **Railway Support**: https://railway.app/support
- **Vercel Support**: https://vercel.com/support
- **Express Docs**: https://expressjs.com
- **React Docs**: https://react.dev

---

## 🎉 YOU'RE LIVE!

Your photography website is now:
- ✅ Accessible 24/7
- ✅ On a real domain
- ✅ Mobile responsive
- ✅ Client portal working
- ✅ File downloads secure
- ✅ Professional & cinematic

**Share it with your photographer friend!** 🚀📸🎬

---

**Total time to deployment: ~15 minutes**
**Annual cost: ~$10-50**
**Professional result: Priceless** ✨
