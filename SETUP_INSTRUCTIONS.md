# CINEFRAME — Status & How To Use

## ✅ DONE (everything is set up and working on your PC)

- [x] Node.js installed
- [x] All project tools installed
- [x] Security vulnerabilities fixed
- [x] MongoDB database connected (your data saves permanently)
- [x] Razorpay payments connected (test mode)
- [x] Full end-to-end test passed (register, login, payment all work)

**Your website backend is FULLY WORKING.** 🎉

---

## ▶ HOW TO USE IT (every time)

### Start the backend
**Double-click `START_SERVER.bat`**
A black window opens saying "CINEFRAME server running". **Keep it open.**
(To stop the server, just close that window.)

### Open the website
Open **`preview.html`** in your browser (Chrome/Edge).
- Register / login → saves to your real database
- Make a booking → pay with a **Razorpay TEST card**:
  - Card: `4111 1111 1111 1111`
  - Expiry: any future date (e.g. `12/30`)
  - CVV: any 3 digits (e.g. `123`)
  - This is fake money — perfect for testing
- The booking saves to your database with a real reference number

### Admin login
- Email: `admin@cineframe.com`
- Password: `admin123`
- (Change this password later for security)

---

## 🌍 PUTTING IT ONLINE (optional — when you're ready)

The site works on your PC. To let the world access it:

### Backend → Render.com (free)
1. Sign up at https://render.com
2. New → Web Service
3. Build command: `npm install`
4. Start command: `npm start`
5. Add the contents of your `.env` file under "Environment"
6. Copy the URL it gives you (e.g. `https://cineframe.onrender.com`)

### Frontend → Netlify.com (free)
1. In `preview.html`, change `const API_URL = 'http://localhost:5000'`
   to your Render URL from above
2. Rename `preview.html` to `index.html`
3. Drag it onto https://netlify.com → instant live link

### Real payments (when you have real customers)
- Complete Razorpay business KYC (PAN + bank account)
- Switch from Test keys to Live keys in `.env`

---

## ⚠️ IMPORTANT — keep these private

- **Never share or upload the `.env` file** — it has your database
  password and payment secret keys
- If putting code on GitHub, the `.env` must NOT be included

---

## If something breaks

- Black window closes immediately → run `START_SERVER.bat`, screenshot the
  error, ask Claude
- "Cannot connect" on website → make sure the black server window is open
- Payment popup doesn't show → check internet; Razorpay loads online
