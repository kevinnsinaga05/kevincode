# Analisis Tools

## Tujuan
Menentukan tools yang efisien untuk website PWA dengan backend API ringan.

## Hasil Analisis
1. Node.js + Express dipilih untuk API karena setup cepat dan banyak ekosistem.
2. mysql2 dipilih untuk akses MySQL native dengan parameterized query.
3. Bootstrap dipilih untuk percepatan UI responsif.
4. Service Worker dipilih untuk dukungan offline dan update cache.
5. Script internal `npm test` dan `npm run analyze` dipakai untuk quality gate minimal.

## Dampak
- Development cepat.
- Mudah dipelihara untuk skala kecil-menengah.
- Ada baseline pengujian statis dan smoke test.