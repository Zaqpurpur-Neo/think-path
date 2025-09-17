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
    npx prisma migrate dev --name init
    npx prisma generate
    ```
4. **Jalankan aplikasi**
    ```bash
    npm run dev
    ```

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