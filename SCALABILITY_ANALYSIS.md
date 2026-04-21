# Analisis Skalabilitas Perangkat Lunak

## Kondisi Saat Ini
- Backend monolith pada satu file `server.js`.
- Koneksi DB tunggal via mysql2.
- Metrics dasar tersedia di `/api/metrics`.

## Risiko Skala
1. Beban tinggi dapat menekan event loop Node.js.
2. Query berat tanpa index akan menaikkan latensi.
3. Token in-memory tidak cocok untuk multi-instance.

## Mitigasi yang Sudah Ada
- Monitoring resource dan event loop delay (`/api/metrics`).
- Health endpoint (`/api/health`) untuk pemeriksaan cepat.
- Logging periodik pada server.

## Rencana Skalabilitas Lanjutan
1. Refactor route per modul jika endpoint bertambah.
2. Gunakan connection pool mysql2.
3. Pindahkan token store ke Redis untuk horizontal scale.
4. Tambahkan reverse proxy + rate limiting layer.