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

## HPP dan target harga jual
Pada formulir Tambah/Edit Menu tersedia perhitungan HPP per porsi. Isi biaya bahan baku, kemasan, dan biaya lain. Atur target margin laba serta biaya platform online sesuai potongan aktual marketplace/layanan pesan antar.

Rumus yang digunakan:
- HPP = biaya bahan baku + kemasan + biaya lain per porsi.
- Target jual offline = HPP / (1 - target margin).
- Target jual online = target jual offline / (1 - biaya platform online).
- Harga target dibulatkan ke atas ke kelipatan Rp500.

Harga jual yang sudah ada tetap disimpan sebagai harga jual saat ini; target offline dan online ditampilkan terpisah pada detail menu. Data HPP ikut tersimpan otomatis dan tercakup dalam backup JSON. Saat impor Excel, kolom opsional: `hppBahan`, `kemasan`, `biayaLain`, `marginTarget`, `biayaOnline`.

## Simpan otomatis ke folder komputer
Aplikasi statis tidak dapat mengubah ukuran atau isi `index.html` ketika menu ditambah. Data katalog disimpan di penyimpanan browser (`localStorage`), bukan ditulis ke folder proyek, karena browser membatasi akses tulis ke folder komputer.

Untuk membuat salinan data otomatis di folder komputer:
1. Buka website menggunakan Chrome atau Edge terbaru.
2. Klik **Pilih folder simpan** dan pilih folder khusus, misalnya `Dokumen/Nasimie Roja`.
3. Izinkan akses baca/tulis saat browser memintanya.
4. Setiap tambah/edit/hapus menu atau perubahan identitas akan memperbarui file `nasimie-roja-data.json` di folder tersebut.
5. Jika setelah membuka ulang website status meminta izin lagi, klik **Pilih folder simpan** dan pilih folder yang sama.

Catatan: fitur folder otomatis memerlukan browser yang mendukung File System Access API (Chrome/Edge desktop) dan izin folder. Pada browser lain atau perangkat mobile, gunakan **Ekspor data** untuk mengunduh backup JSON. Data browser dan file JSON folder adalah dua salinan terpisah; file JSON dapat diimpor kembali melalui menu Impor Excel / JSON.
