const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const { monitorEventLoopDelay } = require('perf_hooks');
const { version: appVersion } = require('./package.json');

const app = express();
app.use(cors());
app.use(bodyParser.json());
// Serve public site static files so PWA can run at / 
app.use(express.static(path.join(__dirname)));

app.use((req, res, next) => {
  const requestId = crypto.randomBytes(8).toString('hex');
  req.requestId = requestId;
  res.setHeader('x-request-id', requestId);
  res.on('finish', () => {
    if (res.statusCode >= 500) {
      console.error(`[http ${res.statusCode}] [req:${requestId}] ${req.method} ${req.originalUrl}`);
    }
  });
  next();
});

// Sajikan halaman admin statis terpisah (tidak ditautkan dari frontend publik)
// Akses: http://localhost:8000/admin/
app.use('/admin', express.static(path.join(__dirname, 'admin')));

class TokenStore {
  constructor() {
    this.tokens = new Map();
  }

  create(userId) {
    const token = crypto.randomBytes(24).toString('hex');
    this.tokens.set(token, userId);
    return token;
  }

  has(token) {
    return this.tokens.has(token);
  }

  get(token) {
    return this.tokens.get(token);
  }

  size() {
    return this.tokens.size;
  }
}

class SystemMonitor {
  constructor() {
    this.eventLoopDelay = monitorEventLoopDelay({ resolution: 20 });
    this.eventLoopDelay.enable();
  }

  snapshot() {
    const usage = process.memoryUsage();
    return {
      uptimeSeconds: Number(process.uptime().toFixed(1)),
      memory: {
        rssMb: Number((usage.rss / 1024 / 1024).toFixed(2)),
        heapUsedMb: Number((usage.heapUsed / 1024 / 1024).toFixed(2)),
        heapTotalMb: Number((usage.heapTotal / 1024 / 1024).toFixed(2)),
        externalMb: Number((usage.external / 1024 / 1024).toFixed(2))
      },
      eventLoopDelay: {
        meanMs: Number((this.eventLoopDelay.mean / 1e6).toFixed(2)),
        maxMs: Number((this.eventLoopDelay.max / 1e6).toFixed(2)),
        minMs: Number((this.eventLoopDelay.min / 1e6).toFixed(2))
      }
    };
  }

  startLogging(intervalMs = 60000) {
    setInterval(() => {
      const snapshot = this.snapshot();
      console.log(
        `[monitor] uptime=${snapshot.uptimeSeconds}s rss=${snapshot.memory.rssMb}MB heap=${snapshot.memory.heapUsedMb}MB eventLoopMean=${snapshot.eventLoopDelay.meanMs}ms`
      );
    }, intervalMs).unref();
  }
}

const tokenStore = new TokenStore();
const systemMonitor = new SystemMonitor();
let databaseReady = false;

// Koneksi database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // ganti sesuai password MySQL Anda
  database: 'soyatrack'
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection failed:', err.code || err.message);
    return; // continue serving static site and APIs will return errors if used
  }
  databaseReady = true;
  console.log('Connected to MySQL');
  // Pastikan tabel users ada
  db.query(`CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) DEFAULT NULL,
    email VARCHAR(150) DEFAULT NULL,
    role ENUM('admin','editor') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uniq_email (email)
  ) ENGINE=InnoDB`, (e) => { if(e) console.error('Init users table error', e); });
});

systemMonitor.startLogging();

// API Produk
app.get('/api/produk', (req, res) => {
  db.query('SELECT * FROM produk', (err, results) => {
    if (err) return res.status(500).json({error: err});
    res.json(results);
  });
});

app.post('/api/produk', (req, res) => {
  const { nama, deskripsi, rasa, ukuran, harga, gambar } = req.body;
  const insertData = { nama, deskripsi, rasa, ukuran, harga };
  if (typeof gambar !== 'undefined' && gambar !== null && String(gambar).length > 0) {
    insertData.gambar = gambar;
  }
  db.query('INSERT INTO produk SET ?', insertData, (err, result) => {
    if (err) return res.status(500).json({error: err});
    res.json({ success: true, id: result.insertId });
  });
});

// API Order
app.post('/api/order', (req, res) => {
  const { nama_pemesan, nomor_wa, produk_id, jumlah } = req.body;
  db.query('INSERT INTO orders SET ?', { nama_pemesan, nomor_wa, produk_id, jumlah, status: 'baru' }, (err, result) => {
    if (err) return res.status(500).json({error: err});
    res.json({ success: true, id: result.insertId });
  });
});

// API Artikel
app.get('/api/artikel', (req, res) => {
  db.query('SELECT * FROM artikel', (err, results) => {
    if (err) return res.status(500).json({error: err});
    res.json(results);
  });
});

// API Testimoni
app.get('/api/testimoni', (req, res) => {
  db.query('SELECT * FROM testimoni', (err, results) => {
    if (err) return res.status(500).json({error: err});
    res.json(results);
  });
});

// API Lokasi
app.get('/api/lokasi', (req, res) => {
  db.query('SELECT * FROM lokasi', (err, results) => {
    if (err) return res.status(500).json({error: err});
    res.json(results);
  });
});

// API Media Sosial
app.get('/api/media-sosial', (req, res) => {
  db.query('SELECT * FROM media_sosial', (err, results) => {
    if (err) return res.status(500).json({error: err});
    res.json(results);
  });
});

// ====== AUTH (SIMPLE) ======
function hashPassword(pw){
  return crypto.createHash('sha256').update(pw).digest('hex');
}

app.post('/api/auth/signup', (req,res) => {
  const { username, password, full_name, email, role } = req.body;
  if(!username || !password) return res.status(400).json({error:'username & password required'});
  if(email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return res.status(400).json({error:'invalid email format'});
  const userRole = (role === 'editor' || role === 'admin') ? role : 'admin';
  const password_hash = hashPassword(password);
  const insertData = { username, password_hash, full_name, email, role: userRole };
  db.query('INSERT INTO users SET ?', insertData, (err, result) => {
    if(err){
      if(err.code === 'ER_DUP_ENTRY') return res.status(409).json({error:'username or email already in use'});
      return res.status(500).json({error:err});
    }
    const token = tokenStore.create(result.insertId);
    res.json({success:true, token});
  });
});

app.post('/api/auth/login', (req,res) => {
  const { username, password } = req.body;
  if(!username || !password) return res.status(400).json({error:'username & password wajib'});
  db.query('SELECT * FROM users WHERE username=? LIMIT 1',[username], (err, rows) => {
    if(err) return res.status(500).json({error:err});
    if(!rows.length) return res.status(401).json({error:'username/password salah'});
    const user = rows[0];
    if(user.password_hash !== hashPassword(password)) return res.status(401).json({error:'username/password salah'});
    const token = tokenStore.create(user.id);
    res.json({success:true, token});
  });
});

app.get('/api/auth/me', (req,res) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if(!token || !tokenStore.has(token)) return res.status(401).json({error:'invalid token'});
  const userId = tokenStore.get(token);
  db.query('SELECT id, username, created_at FROM users WHERE id=?',[userId], (err, rows) => {
    if(err) return res.status(500).json({error:err});
    if(!rows.length) return res.status(404).json({error:'user not found'});
    res.json({user:rows[0]});
  });
});

app.get('/api/health', (req, res) => {
  const snapshot = systemMonitor.snapshot();
  res.json({
    status: databaseReady ? 'ok' : 'degraded',
    databaseReady,
    activeTokens: tokenStore.size(),
    timestamp: new Date().toISOString(),
    ...snapshot
  });
});

app.get('/api/metrics', (req, res) => {
  res.json({
    status: databaseReady ? 'ok' : 'degraded',
    databaseReady,
    tokenCount: tokenStore.size(),
    ...systemMonitor.snapshot()
  });
});

app.get('/api/version', (req, res) => {
  res.json({
    app: 'soyatrack',
    version: appVersion,
    updatedAt: new Date().toISOString()
  });
});

app.use((err, req, res, next) => {
  console.error('[unhandled-exception]', err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: 'internal server error' });
});

// Jalankan server
const PORT = 8000;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
