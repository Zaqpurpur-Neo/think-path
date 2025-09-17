# Think Path

Think Path adalah sebuah aplikasi berbasis Next.js yang dirancang untuk membantu pengguna dalam pembelajaran interaktif, latihan soal, dan manajemen progres belajar. Proyek ini menggunakan berbagai komponen modular, database SQLite dengan Prisma ORM, serta menyediakan API untuk berbagai fitur seperti kuis, tes, dan leaderboard.

## Fitur Utama
- **Dashboard**: Menampilkan progres belajar dan statistik pengguna.
- **Kuis & Tes**: Latihan soal interaktif dan tes akhir.
- **Manajemen Modul**: Konten pembelajaran per bab yang terstruktur.
- **Leaderboard**: Papan peringkat untuk memotivasi pengguna.
- **Autentikasi**: Sistem login dan registrasi pengguna.

## Struktur Direktori
- `components/` — Komponen UI modular (Button, DatePicker, ListTable, dsb)
- `content/` — Konten pembelajaran dan soal per bab
- `context/` — React context untuk manajemen state global
- `database/` — Skema database Prisma dan file migrasi
- `hooks/` — Custom React hooks
- `lib/` — Library utilitas (auth, fetch markdown, dsb)
- `pages/` — Halaman Next.js (dashboard, login, register, dsb)
- `public/` — Aset publik (gambar, favicon)
- `styles/` — File CSS modul dan global
- `types/` — Tipe TypeScript global

## Instalasi
1. **Clone repository**
	```bash
	git clone https://github.com/Zaqpurpur-Neo/think-path.git
	cd think-path
	```
2. **Install dependencies**
	```bash
	npm install
	```
3. **Setup database**
	```bash
	npx prisma migrate dev --name init
	npx prisma generate
	```
4. **Jalankan aplikasi**
	```bash
	npm run dev
	```

## Konfigurasi Lingkungan
Buat file `.env` jika diperlukan untuk konfigurasi database atau variabel lingkungan lainnya.

## Kontribusi
Pull request dan issue sangat terbuka untuk pengembangan lebih lanjut.

## Lisensi
MIT License
