# Praktikum TCC

Silakan deploy repository ini melalui Compute Engine. Repository ini merupakan sebuah implementasi Front-end sederhana dari praktik Back-end yang telah kita lakukan pada pertemuan 2 dan 3. Untuk Back-end **TIDAK PERLU** ikut di-deploy ke VM, cukup dijalankan secara local.

File Back-end dapat di-download melalui link ini:
```
git clone --branch pert2_sequelize https://github.com/Simad9/praktikum_tcc_2025-2026 "pert2_sequelize"
```

Sebelum mengikuti langkah-langkah di bawah, **pastikan teman-teman telah menjalankan server Back-End secara lokal terlebih dahulu**. Untuk caranya silakan ikuti instruksi yg terdapat pada README link di atas.

## How to deploy to VM:

- Lakukan update package pada instance VM dengan perintah `sudo apt update`
- Install web server apache dengan perintah `sudo apt install apache2`
- Clone/download repository ini pada instance VM dengan perintah `git clone --branch pert4_fe https://github.com/Simad9/praktikum_tcc_2025-2026 "pert4_fe"`
- Agar dapat men-download repository di atas, pastikan instance VM telah terinstall git terlebih dahulu. Jika belum, ketik `sudo apt install git`
- Jika repository telah di-download, copy seluruh isi file dari repository tersebut ke `/var/www/html/` dengan perintah `sudo cp -r pert4_fe. /var/www/html/`
- Jalankan web dengan mengetikkan http://[EXTERNAL IP]
- Jika data sudah muncul, maka Front-End dan Back-End telah terhubung
