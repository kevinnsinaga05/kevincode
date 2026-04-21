# Soyatrack

Soyatrack adalah website PWA dengan frontend HTML/CSS/JS dan backend Node.js + Express + MySQL.

## Jalankan Proyek
```powershell
Set-Location "c:\Users\KEVIN BINSAR\Desktop\soyatrack"
npm install
npm start
```

Server berjalan di `http://localhost:8000`.

## Struktur Utama
- `index.html`, `about.html`, `produk.html`: halaman utama frontend.
- `assets/css/style.css`: styling responsif.
- `assets/js/main.js`, `assets/js/about.js`: logic frontend.
- `server.js`: API backend, autentikasi sederhana, monitoring, debugging.
- `sw.js`, `register-sw.js`, `manifest.json`, `offline.html`: komponen PWA.
- `tests/smoke.test.js`: smoke test.
- `scripts/analyze.js`: static quality check.

## Endpoint API Aktif
| Method | Path | Keterangan |
|---|---|---|
| GET | `/api/produk` | Ambil daftar produk |
| POST | `/api/produk` | Tambah produk |
| POST | `/api/order` | Simpan order |
| GET | `/api/artikel` | Ambil artikel |
| GET | `/api/testimoni` | Ambil testimoni |
| GET | `/api/lokasi` | Ambil lokasi |
| GET | `/api/media-sosial` | Ambil media sosial |
| POST | `/api/auth/signup` | Daftar akun |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Profil user by token |
| GET | `/api/health` | Health status aplikasi |
| GET | `/api/metrics` | Resource metrics aplikasi |
| GET | `/api/version` | Info versi aplikasi |

## Tooling dan Validasi
- `npm test`: smoke test.
- `npm run analyze`: cek sintaks dan checklist kualitas statis.

## Dokumen Pemenuhan Kriteria
- `KRITERIA_CHECKLIST.md`: status lengkap semua kriteria.
- `TOOLS_ANALYSIS.md`: analisis pemilihan tools.
- `SCALABILITY_ANALYSIS.md`: analisis skalabilitas.
- `LIBRARY_IDENTIFICATION.md`: identifikasi library/framework.
- `UX_DESIGN.md`: rancangan UX.
- `CODE_REVIEW.md`: checklist code review.
- `MIGRATION.md`: catatan migrasi teknologi.
