# Kopi Atelier — Katalog Menu & Resep

Aplikasi katalog menu kopi statis, tanpa backend dan tanpa proses build.

## Cara menjalankan
- Ekstrak folder `kopiapp`.
- Buka `index.html` dengan Chrome, Edge, atau Firefox.
- Menu baru, edit, dan hapus tersimpan otomatis pada penyimpanan lokal browser/perangkat tersebut.

## Deploy ke GitHub Pages
1. Buat repository GitHub baru.
2. Unggah seluruh isi folder ini ke root repository (pastikan `index.html` berada di root).
3. Buka **Settings → Pages**.
4. Pada **Build and deployment**, pilih **Deploy from a branch**, branch `main`, folder `/ (root)`, lalu Save.
5. Tunggu proses selesai; GitHub akan menampilkan alamat publik website.

Tidak perlu login di dalam aplikasi dan tidak membutuhkan Supabase.

## Backup dan pemindahan data
- Klik **Ekspor data** untuk mengunduh backup JSON.
- Pada browser/perangkat lain, buka aplikasi lalu klik **Impor data** dan pilih file backup tersebut.
- Penyimpanan otomatis bersifat lokal pada browser/perangkat. Data tidak otomatis tersinkron antar perangkat atau antar pengguna.
- Sebelum menghapus data browser/cache atau mengganti perangkat, ekspor backup terlebih dahulu.

## Catatan
- Aplikasi dapat dibuka langsung sebagai file lokal. Google Fonts hanya digunakan untuk tampilan; bila tidak ada internet, aplikasi tetap dapat digunakan dengan font pengganti.
- Jika GitHub Pages digunakan, semua file harus diunggah, bukan hanya `index.html`.
