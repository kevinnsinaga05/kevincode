const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Koneksi database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // ganti sesuai password MySQL Anda
  database: 'soyatrack'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// API Produk
app.get('/api/produk', (req, res) => {
  db.query('SELECT * FROM produk', (err, results) => {
    if (err) return res.status(500).json({error: err});
    res.json(results);
  });
});

app.post('/api/produk', (req, res) => {
  const { nama, deskripsi, rasa, ukuran, harga, gambar } = req.body;
  db.query('INSERT INTO produk SET ?', { nama, deskripsi, rasa, ukuran, harga, gambar }, (err, result) => {
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

// Jalankan server
const PORT = 8000;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
