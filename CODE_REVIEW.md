# Code Review Checklist

Gunakan checklist ini sebelum merge perubahan ke proyek Soyatrack.

## Checklist
- [ ] Kode baru mengikuti struktur yang ada dan tidak mengubah perilaku tanpa alasan.
- [ ] Query SQL tetap memakai parameterized query atau prepared statement.
- [ ] Perubahan frontend tetap responsif di mobile dan desktop.
- [ ] Error handling sudah ditambahkan untuk kondisi gagal.
- [ ] Perubahan yang menyentuh API memiliki validasi input.
- [ ] `npm test` lulus.
- [ ] `npm run analyze` lulus.
- [ ] Dokumentasi README diperbarui bila perilaku atau endpoint berubah.

## Catatan Review
- Periksa file yang terdampak secara langsung.
- Cocokkan perubahan dengan endpoint, tampilan, dan alur data yang ada.
- Prioritaskan bug, regresi perilaku, dan keamanan input.