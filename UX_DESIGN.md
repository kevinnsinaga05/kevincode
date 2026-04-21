# Rancangan User Experience (UX)

## Tujuan UX
1. Pengunjung cepat menemukan informasi brand.
2. Pengunjung mudah menemukan lokasi dan kanal order.
3. Website tetap usable saat koneksi lemah.

## Alur Utama Pengguna
1. Landing di Beranda.
2. Lihat konten produk, sosial media, atau lokasi.
3. Buka kanal pemesanan (Grab/Gojek) atau navigasi maps.

## Keputusan UX yang Diterapkan
- Navigasi konsisten lintas halaman (`index`, `about`, `produk`).
- Layout mobile-first dengan Bootstrap.
- CTA jelas untuk order online dan lokasi.
- PWA offline fallback via `offline.html`.
- Smooth scrolling dan loading UX pada skrip frontend.

## Aksesibilitas Dasar
- Elemen navigasi memakai atribut `aria-*`.
- Teks alternatif gambar disediakan pada elemen utama.