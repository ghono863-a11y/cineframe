// ============================================================================
//  CINEFRAME — Photography & Cinematography Website Backend
//  Node.js + Express + MongoDB + Razorpay
// ============================================================================
//  This is the "kitchen" of your website. It checks passwords, saves bookings
//  to a real database, and talks to Razorpay to actually charge money.
// ============================================================================

const express  = require('express');
const cors     = require('cors');
const jwt      = require('jsonwebtoken');
const bcrypt   = require('bcryptjs');          // scrambles passwords safely
const multer   = require('multer');
const path     = require('path');
const fs       = require('fs');
const mongoose = require('mongoose');          // talks to MongoDB
const Razorpay = require('razorpay');          // the payment gateway
const crypto   = require('crypto');
const dns      = require('dns');
const dotenv   = require('dotenv');

dotenv.config();

// Some ISPs/routers block MongoDB's special "SRV" DNS records.
// Force a public DNS resolver (Google + Cloudflare) so it always works.
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

const app        = express();
const PORT       = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-key';

// ---- Middleware ------------------------------------------------------------
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static('uploads'));

// ============================================================================
//  1. DATABASE CONNECTION (MongoDB)
// ============================================================================
//  Get a FREE database URL from https://mongodb.com/atlas and put it in .env
//  as MONGODB_URI. Until then this logs a friendly warning but still starts.
// ----------------------------------------------------------------------------
const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB database'))
    .catch(err => console.error('❌ MongoDB connection failed:', err.message));
} else {
  console.warn('⚠️  No MONGODB_URI in .env — database features will not work.');
  console.warn('   Get a free database at https://mongodb.com/atlas');
}

// ---- Database "shapes" (Schemas) -------------------------------------------
const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },     // stored SCRAMBLED, never plain
  role:     { type: String, default: 'client' },
  createdAt:{ type: Date,   default: Date.now },
});

const bookingSchema = new mongoose.Schema({
  clientName:  String,
  clientEmail: String,
  clientPhone: String,
  eventType:   String,
  eventDate:   String,
  venue:       String,
  notes:       String,
  packageId:   String,
  packageName: String,
  totalAmount: Number,
  paidAmount:  Number,
  balanceDue:  Number,
  status:      { type: String, default: 'Confirmed' },
  paymentId:   String,
  orderId:     String,
  bookingRef:  String,
  createdAt:   { type: Date, default: Date.now },
});

const gallerySchema = new mongoose.Schema({
  name:        String,
  description: String,
  date:        String,
  type:        String,
  owner:       String,
  files:       [{ fileId: String, name: String, type: String, size: String, path: String }],
  accessList:  [String],
  createdAt:   { type: Date, default: Date.now },
});

const User    = mongoose.model('User', userSchema);
const Booking = mongoose.model('Booking', bookingSchema);
const Gallery = mongoose.model('Gallery', gallerySchema);

// ============================================================================
//  2. RAZORPAY SETUP (the payment gateway)
// ============================================================================
//  Get FREE test keys from https://razorpay.com → Settings → API Keys
//  Put them in .env as RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
// ----------------------------------------------------------------------------
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id:     process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  console.log('✅ Razorpay payment gateway ready');
} else {
  console.warn('⚠️  No Razorpay keys in .env — payments will not work.');
  console.warn('   Get free test keys at https://razorpay.com');
}

// ============================================================================
//  3. FILE UPLOAD SETUP
// ============================================================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'uploads', String(req.user?.id || 'temp'));
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// ============================================================================
//  4. THE BOUNCER (auth middleware) — checks the login wristband
// ============================================================================
const auth = (req, res, next) => {
  const header = req.headers['authorization'];
  const token  = header && header.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Please log in first' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Session expired, log in again' });
    req.user = user;
    next();
  });
};

// ============================================================================
//  5. AUTH ROUTES — register & login (with SECURE passwords)
// ============================================================================
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already registered' });

    // Scramble the password — even YOU can't read it after this
    const hashed = await bcrypt.hash(password, 10);
    const user   = await User.create({ name, email, password: hashed, role: 'client' });

    const token = jwt.sign({ id: user._id, email, role: 'client' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: user._id, name, email, role: 'client' } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    // Compare the typed password against the scrambled one
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: user._id, name: user.name, email, role: user.role } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/auth/verify', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

// ============================================================================
//  6. BOOKING + PAYMENT ROUTES  (THE NEW PART — this is what you wanted!)
// ============================================================================

//  STEP 1: Frontend asks "create a payment order for ₹X"
app.post('/api/bookings/create-order', async (req, res) => {
  try {
    if (!razorpay) return res.status(503).json({ error: 'Payments not configured yet' });

    const { amount } = req.body;                 // amount in rupees
    if (!amount || amount <= 0)
      return res.status(400).json({ error: 'Invalid amount' });

    const order = await razorpay.orders.create({
      amount:   Math.round(amount * 100),        // Razorpay wants paise (×100)
      currency: 'INR',
      receipt:  'rcpt_' + Date.now(),
    });

    res.json({ success: true, orderId: order.id, amount: order.amount, key: process.env.RAZORPAY_KEY_ID });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//  STEP 2: After client pays, frontend sends proof — we VERIFY it's real,
//          then save the booking to the database.
app.post('/api/bookings/confirm', async (req, res) => {
  try {
    const {
      razorpay_order_id, razorpay_payment_id, razorpay_signature,
      booking,
    } = req.body;

    // Verify the payment signature — proves Razorpay really charged the card
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (expected !== razorpay_signature)
      return res.status(400).json({ error: 'Payment verification failed' });

    const bookingRef = 'CF-' + Date.now().toString(36).toUpperCase();
    const saved = await Booking.create({
      ...booking,
      paymentId:  razorpay_payment_id,
      orderId:    razorpay_order_id,
      bookingRef,
      balanceDue: booking.totalAmount - booking.paidAmount,
      status:     booking.paidAmount >= booking.totalAmount ? 'Fully Paid' : 'Confirmed',
    });

    res.json({ success: true, bookingRef, booking: saved });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//  Client: see my own bookings
app.get('/api/bookings/mine', auth, async (req, res) => {
  const bookings = await Booking.find({ clientEmail: req.user.email }).sort({ createdAt: -1 });
  res.json(bookings);
});

//  Admin: see ALL bookings + revenue totals
app.get('/api/bookings/all', auth, async (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ error: 'Admin only' });

  const bookings = await Booking.find().sort({ createdAt: -1 });
  const revenue  = bookings.reduce((s, b) => s + (b.paidAmount || 0), 0);
  const pending  = bookings.reduce((s, b) => s + (b.balanceDue || 0), 0);
  res.json({ bookings, revenue, pending, count: bookings.length });
});

// ============================================================================
//  7. GALLERY ROUTES (photo/video management)
// ============================================================================
app.get('/api/galleries', async (req, res) => {
  const galleries = await Gallery.find();
  res.json(galleries.map(g => ({
    id: g._id, name: g.name, description: g.description,
    type: g.type, date: g.date, fileCount: g.files.length,
  })));
});

app.post('/api/galleries', auth, async (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ error: 'Admin only' });
  const { name, description, type } = req.body;
  const gallery = await Gallery.create({
    name, description: description || '', type: type || 'event',
    date: new Date().toISOString().split('T')[0],
    owner: req.user.id, files: [], accessList: [],
  });
  res.json({ success: true, gallery });
});

app.delete('/api/galleries/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ error: 'Admin only' });
  await Gallery.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Gallery deleted' });
});

//  Upload files to a gallery
app.post('/api/galleries/:id/upload', auth, upload.array('files', 50), async (req, res) => {
  const gallery = await Gallery.findById(req.params.id);
  if (!gallery) return res.status(404).json({ error: 'Gallery not found' });

  const uploaded = req.files.map(f => ({
    fileId: Date.now() + '-' + Math.random().toString(36).slice(2),
    name:   f.originalname,
    type:   f.mimetype.startsWith('video') ? 'video' : 'photos',
    size:   (f.size / 1048576).toFixed(2) + ' MB',
    path:   f.path,
  }));
  gallery.files.push(...uploaded);
  await gallery.save();
  res.json({ success: true, files: uploaded });
});

//  Download a file (only if client has access)
app.get('/api/download/:galleryId/:fileId', auth, async (req, res) => {
  const gallery = await Gallery.findById(req.params.galleryId);
  if (!gallery) return res.status(404).json({ error: 'Gallery not found' });
  if (!gallery.accessList.includes(req.user.id))
    return res.status(403).json({ error: 'Access denied' });

  const file = gallery.files.find(f => f.fileId === req.params.fileId);
  if (!file || !fs.existsSync(file.path))
    return res.status(404).json({ error: 'File not found' });
  res.download(file.path, file.name);
});

// ============================================================================
//  8. SEED ADMIN — creates the first admin account automatically
// ============================================================================
async function seedAdmin() {
  if (!MONGODB_URI) return;
  try {
    const exists = await User.findOne({ email: 'admin@cineframe.com' });
    if (!exists) {
      const hashed = await bcrypt.hash('admin123', 10);
      await User.create({ name: 'Admin', email: 'admin@cineframe.com', password: hashed, role: 'admin' });
      console.log('✅ Admin account created: admin@cineframe.com / admin123');
    }
  } catch (e) { /* db not ready yet — ignore */ }
}
mongoose.connection.once('open', seedAdmin);

// ---- Error handler ---------------------------------------------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

// ============================================================================
//  START THE SERVER (open the kitchen)
// ============================================================================
app.listen(PORT, () => {
  console.log('');
  console.log('🎬  CINEFRAME server running on http://localhost:' + PORT);
  console.log('📸  Booking + Payment API ready');
  console.log('');
});
