# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


## Local image upload service

Fitur foto profil menggunakan Node.js + Express + Multer.

### Menjalankan backend

```bash
cd server
npm install
npm run dev
```

Backend berjalan pada `http://localhost:5000`.

### Menjalankan frontend

Pada terminal lain:

```bash
npm install
npm run dev
```

Frontend berjalan pada URL Vite yang ditampilkan di terminal (biasanya `http://localhost:5173`).

Foto yang diupload disimpan di:

```text
server/uploads/profile/
```

Endpoint upload:

```text
POST http://localhost:5000/api/upload/profile
```

Field multipart/form-data:

```text
profileImage
```

## Deploy ke Hostinger

Aplikasi ini bisa dijalankan sebagai **satu aplikasi Node.js**: server menyajikan API, file front-end hasil build, dan unggahan melalui satu domain. Jadi, kamu bisa mengirim satu ZIP proyek; tidak perlu upload front-end ke `public_html` secara terpisah.

### Siapkan satu ZIP

Build front-end di komputer sebelum membuat ZIP. Jangan set `VITE_API_URL` ke `localhost` atau domain lain; tanpa nilai itu, front-end produksi otomatis memanggil API pada domain yang sama.

Jalankan dari PowerShell di folder proyek:

```powershell
$env:VITE_API_URL = ""
npm run build
```

Buat ZIP yang mempertahankan struktur ini:

```text
package.json
package-lock.json
dist/
server/
  package.json
  package-lock.json
  index.js
  config/
  controllers/
  database/
  middleware/
  routes/
  scripts/
  services/
```

Sertakan kode front-end dan folder `dist` hasil build. **Jangan sertakan** folder `node_modules`, `.git`, file `.env`/`server/.env`, atau isi `server/uploads` dari komputer lokal. Jangan upload folder proyek yang membungkus susunan di atas; setelah diekstrak, folder `server` harus langsung menjadi application root yang dipilih di Hostinger. Hostinger akan memasang dependensi backend dari `server/package.json`.

### Atur aplikasi Node.js dan MySQL

Di hPanel, buat aplikasi Node.js dengan application root `server`, versi Node.js yang didukung Hostinger, dan startup file/perintah `index.js` atau `npm start` sesuai opsi panel. Hubungkan domain ke aplikasi ini, bukan ke folder `dist` di `public_html`.

Buat database MySQL dan user-nya lebih dulu di hPanel, lalu import `server/database/schema.sql` ke database tersebut. Isi environment variables aplikasi di panel:

```text
DB_HOST=<host MySQL dari panel>
DB_PORT=<port MySQL dari panel>
DB_USER=<user MySQL dari panel>
DB_PASSWORD=<password MySQL>
DB_NAME=<nama database dari panel>
DB_CREATE_DATABASE=false
CLIENT_URL=https://domain-anda
API_PUBLIC_URL=https://domain-anda
JWT_SECRET=<secret acak yang hanya disimpan di environment variables>
```

Jangan set `PORT` sendiri jika panel menetapkannya otomatis. Jangan gunakan nilai contoh dari `.env.example` sebagai kredensial produksi. Setelah aplikasi aktif, halaman utama harus terbuka di `https://domain-anda/` dan health check API di `https://domain-anda/api/health`.

ZIP ini menggabungkan proses upload, tetapi data MySQL tetap harus dibuat/import secara terpisah. File yang diunggah disimpan di `server/uploads`; pastikan penyimpanan aplikasi Hostinger persisten agar foto dan bukti pembayaran tidak hilang saat aplikasi di-deploy ulang.
