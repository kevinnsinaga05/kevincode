# Migration Notes

Proyek ini saat ini memakai frontend statis + backend Node.js/Express di `server.js`.

## Riwayat Migrasi
- Dari pendekatan statis murni menuju aplikasi web yang punya API server-side.
- Penanganan auth, health check, dan monitoring resource dipindahkan ke backend Express.
- Fitur PWA tetap dipertahankan agar bisa offline-first.

## Alasan Migrasi
- Memudahkan integrasi data dan akses basis data.
- Memberi ruang untuk monitoring, logging, dan pengujian yang lebih jelas.
- Meningkatkan kesiapan untuk perluasan fitur di masa depan.

## Langkah Lanjut
- Pecah handler besar menjadi modul yang lebih kecil jika backend berkembang.
- Tambahkan CI untuk menjalankan `npm test` dan `npm run analyze` otomatis.