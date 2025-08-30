# Soyatrack

Static frontend + lightweight native PHP backend (PDO) dengan fitur: menu CRUD, reservasi, newsletter subscribe, autentikasi JWT sederhana, rate limiting & header keamanan dasar.

## Fitur Backend
- CRUD `menu_items`
- Reservasi meja (`/reservations`)
- Newsletter subscribe (`/newsletter/subscribe`)
- Register & Login JWT (`/auth/register`, `/auth/login`)
- Validasi input dasar & error kode HTTP tepat
- Rate limiting per IP + header keamanan
- Routing sederhana tanpa framework
- Struktur modular siap dikembangkan

## Struktur Backend
```
backend/
  composer.json
  public/index.php        # Front controller
  src/
    config/               # DB config & env example
    controllers/          # Controller kelas
    models/               # Model (PDO queries)
    routes/api.php        # Daftar route
    helpers/response.php  # Helper JSON & body parser
```

## Persiapan
1. Install PHP >= 8 dan MySQL/MariaDB (atau ubah ke SQLite nanti).
2. Buat database `soyatrack`.
3. Salin `backend/src/config/env.example` ke `backend/.env` lalu sesuaikan kredensial.
4. Jalankan autoload (akan membuat folder `vendor/`).

## Perintah (PowerShell)
```powershell
cd backend
php -r "copy('src/config/env.example','.env');"  # sekali saja jika belum
composer dump-autoload  # jika sudah install composer global
php -S localhost:8000 -t public
```
Buka http://localhost:8000/menu

## Skema Tabel
```sql
CREATE TABLE menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  people INT NOT NULL,
  message TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE newsletter_subscribers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(120) NOT NULL UNIQUE,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Contoh Request
Create:
```bash
curl -X POST http://localhost:8000/menu \
 -H "Content-Type: application/json" \
 -d '{"name":"Lobster Bisque","category":"Soup","price":55000,"description":"Creamy"}'
```

## Dokumentasi Endpoint (ringkas)
| Method | Path | Deskripsi |
|-------|------|-----------|
| GET | /menu | List menu |
| GET | /menu/{id} | Detail menu |
| POST | /menu | Tambah menu (JWT) |
| PUT | /menu/{id} | Update menu (JWT) |
| DELETE | /menu/{id} | Hapus menu (JWT) |
| POST | /auth/register | Registrasi (email,password) |
| POST | /auth/login | Login -> token JWT |
| POST | /reservations | Buat reservasi (name,email,phone,date,time,people[,message]) |
| POST | /newsletter/subscribe | Subscribe newsletter (email) |

## Cakupan Butir Kompetensi
1. Aplikasi web dinamis: CRUD, auth, reservasi, newsletter sudah ada. (Done)
2. Membangun sistem berbasis web: Struktur modular (models/controllers/routes) (Done)
3. Integrasi basis data: Skema & query PDO (Done)
4. Dokumentasi kode program: README + endpoint table + struktur (Partial -> bisa tambah OpenAPI)
5. Keamanan aplikasi web: Password hash, JWT, route protected, rate limiting, header security, prepared statement (Partial -> bisa tambah CSRF untuk form non-AJAX, input sanitizing output) 
6. Implementasi framework: Menggunakan native (tanpa framework berat) namun pola MVC dasar diterapkan. (Partial; bisa migrasi ke CodeIgniter/Laravel jika diminta)

## Rencana Lanjutan
- OpenAPI file `backend/openapi.yaml` sudah tersedia (import ke Swagger UI / Postman)
- Middleware otorisasi untuk proteksi endpoint admin menu (butuh prefix & pengecekan token)
- CSRF token untuk form tradisional
- Logging request & error
- Unit test tambahan (reservations, auth)

## Catatan Keamanan Awal
- Selalu gunakan prepared statements (sudah dipakai)
- Jangan commit file `.env`
- Tambahkan header security (Content-Security-Policy, X-Frame-Options) di level server / index.php nanti

## Frontend Integrasi
AJAX fetch contoh memuat data menu:
```js
fetch('http://localhost:8000/menu')
 .then(r=>r.json())
 .then(data=>console.log(data));
```

---
Butuh tambahan OpenAPI / admin protection? Minta saja.
