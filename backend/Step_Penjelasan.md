# Alur Mengajar Express.js + Sequelize (Update Terbaru)

Pendekatan terbaik untuk mengajarkan materi ini adalah dengan gaya **Top-Down (Dari Server ke Fitur)** lalu diakhiri dengan **Pengujian (Testing API)**. Karena ada perubahan file (struktur terlisah dalam `schema/` serta `api.rest` untuk testing), berikut adalah urutan materi yang disarankan:

## 1. Titik Awal: `index.js` (Jantung Aplikasi)
Mulailah dari file utama tempat aplikasi berjalan.
- **Yang dijelaskan:**
  - Proses inisialisasi Express (`const app = express()`).
  - Mengaktifkan middleware `app.use(express.json())` untuk membaca kiriman data berformat JSON (Ini nantinya berhubungan dengan materi Postman/REST Client).
  - Route dasar (`app.get("/")`).
  - Koneksi database dengan `sequelize.sync()` yang disusul oleh berjalannya server di port (`app.listen()`).
- *Tips Mengajar:* Biarkan baris penggunaan `userRoutes` lewat sebentar alias jangan terlalu detail. Cukup sebutkan: *"Ini adalah rute API kita yang nanti akan dibahas"*.

## 2. Setting Database: `config/database.js`
Setelah server bisa jalan, beritahukan audiens bahwa sebuah aplikasi butuh pangkalan data (database).
- **Yang dijelaskan:**
  - Pemakaian ORM **Sequelize** untuk mempermudah koneksi ke MySQL.
  - Praktik keamanan yang baik dengan menggunakan `dotenv` (tidak hard-code username/password DB).
  - `module.exports = sequelize` agar koneksi ini bisa dipinjam oleh file lain.

## 3. Desain Tabel Database: `schema/User.js` (Update Terbaru)
Database sudah konek, tapi isinya belum ada. Di tahap ini, ajarkan cara mendesain tabel.
- **Yang dijelaskan:**
  - Fungsi `sequelize.define` untuk menciptakan rancangan tabel bernama `User`.
  - Definisi setiap atribut seperti `username` dan `email` (`DataTypes.STRING`).
  - Syarat/kemutlakan (constraint) seperti `allowNull: false`, `unique: true`, serta bagaimana kita memvalidasi email dengan fitur bawaan sequelize `isEmail: true`.

*(Catatan: Sebutkan juga relasinya dengan folder `models/` bila kedua folder ini akan digabungkan fungsinya di kemudian hari)*

## 4. Logika Bisnis: `controllers/userController.js`
Data mentah sudah dirancang. Selanjutnya ajarkan bagaimana Node.js bisa memainkannya (CRUD).
- **Yang dijelaskan:**
  - Mengimpor Skema/Model yang telah dibuat.
  - **`getAllUsers` (Read):** Menunjukkan cara `User.findAll()` mengambil seluruh list data user dari DB untuk dikirim balik dengan JSON status 200.
  - **`createUser` (Create):** Menunjukkan cara model `User.create(req.body)` menampung data baru dan menyimpan ke DB.
  - Tekankan pentingnya blok `try...catch` pada fungsi `async/await` jika seandainya operasi DB gagal atau error (misalnya saat validasi gagal).

## 5. Menyiapkan Gerbang API: `routes/userRoutes.js`
Siapa yang menghubungkan fungsi dari Controller agar bisa dipanggil lewat URL?
- **Yang dijelaskan:**
  - Definisi `express.Router()`.
  - Relasi HTTP Method dengan fungsi Controller. (Metode HTTP `GET /` diarahken ke `getAllUsers`, sedangkan `POST /` dialamatkan ke `createUser`).
  - Di sini barulah Anda ingatkan peserta didik untuk menengok `index.js` lagi. Bahwa router ini menempel *(mounted)* pada path `/api/v1/users`.

## 6. Pembuktian / Pengujian API: File `api.rest` (Penting!)
Kode tak asyik kalau tak dibuktikan nyala. 
- **Yang dijelaskan:**
  - Menjelaskan bahwa ekstensi *REST Client* (atau tools seperti Postman) di VSCode merupakan pengganti *browser* khusus untuk mengetes API.
  - Tunjukkan `GET /` untuk health check.
  - Lakukan `GET /api/v1/users` untuk melihat data DB yang kosong.
  - Lakukan simulasi mendaftar user menggunakan `POST /api/v1/users` dengan *body* JSON yang ada di file `api.rest`. Ingatkan bahwa karena tadi di `index.js` kita pakai `express.json()`, kita di sini wajib pakai header `Content-Type: application/json`.
  - Lalu ulangi cek lagi dengan `GET /api/v1/users` untuk menunjukkan hasil akhirnya. Pasti muncul data barunya!

---
