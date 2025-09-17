# Think Path

Think Path adalah sebuah aplikasi berbasis Next.js yang dirancang untuk membantu pengguna dalam pembelajaran interaktif, latihan soal, dan manajemen progres belajar. Proyek ini menggunakan berbagai komponen modular, database SQLite dengan Prisma ORM, serta menyediakan API untuk berbagai fitur seperti kuis, tes, dan leaderboard.

## Fitur Utama
- **Dashboard**: Menampilkan progres belajar dan statistik pengguna.
- **Kuis & Tes**: Latihan soal interaktif dan tes akhir.
- **Manajemen Modul**: Konten pembelajaran per bab yang terstruktur.
- **Leaderboard**: Papan peringkat untuk memotivasi pengguna.
- **Autentikasi**: Sistem login dan registrasi pengguna.

## Struktur Direktori
- `components/` – Komponen UI modular (Button, DatePicker, ListTable, dsb)
- `content/` – Konten pembelajaran dan soal per bab
- `context/` – React context untuk manajemen state global
- `database/` – Skema database Prisma dan file migrasi
- `hooks/` – Custom React hooks
- `lib/` – Library utilitas (auth, fetch markdown, dsb)
- `pages/` – Halaman Next.js (dashboard, login, register, dsb)
- `public/` – Aset publik (gambar, favicon)
- `styles/` – File CSS modul dan global
- `types/` – Tipe TypeScript global

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
    npm run db:migrate
    ```
4. **Jalankan aplikasi**
    ```bash
    npm run dev
    ```

## Mendapatkan API Key dari OpenRouter

Untuk menggunakan layanan OpenRouter, Anda perlu memiliki API Key. Berikut langkah-langkahnya:

1. **Daftar akun di OpenRouter**  
   Buka [https://openrouter.ai/](https://openrouter.ai/) dan buat akun baru, atau login jika sudah memiliki akun.

2. **Akses halaman API Keys**  
   Setelah login, buka menu **Dashboard** → pilih **API Keys**.

3. **Buat API Key baru**  
   Klik tombol **Create Key**, lalu beri nama sesuai kebutuhan (misalnya: `ThinkPath Development`).

4. **Salin API Key Anda**  
   Salin API Key yang ditampilkan dan simpan di tempat aman.  
   ⚠️ Catatan: API Key hanya ditampilkan sekali saat dibuat. Jika hilang, Anda perlu membuat yang baru.

5. **Tempel ke file `.env`**  
   Buka file `.env` Anda dan isi variabel berikut dengan API Key yang sudah didapatkan:

   ```env
   OPENROUTER_DEEPSEK_API_KEY=API_KEY_DARI_OPENROUTER
6. **Selesai**
   Sekarang aplikasi Anda bisa menggunakan layanan OpenRouter

## Konfigurasi Lingkungan

1. Duplikat file `.env.example` menjadi `.env`
    ```bash
    cp .env.example .env
    ```

2. Edit file `.env` dan sesuaikan nilai variabel lingkungan berikut:

    ```env
    OPENROUTER_DEEPSEK_API_KEY=API_KEY_DARI_OPENROUTER_DEEPSEK
    OPENROUTER_URL=https://openrouter.ai/api/v1/chat/completions
    JWT_SECRET_TOKEN=unsoed-blater
    ```

3. Pastikan Anda sudah mendapatkan `API_KEY_DARI_OPENROUTER_DEEPSEK` dari [OpenRouter](https://openrouter.ai/) sebelum menjalankan aplikasi.

## Kontribusi
Pull request dan issue sangat terbuka untuk pengembangan lebih lanjut.

## Lisensi
MIT License