# RSA Generator - Matematika Diskrit

Althaf & Farras // Website algoritma RSA (Rivest-Shamir-Adleman) // Matematika Diskrit.

## 🚀 Fitur

- **🔑 Generate Key RSA** - Generate pasangan kunci publik dan privat
- **🔒 Enkripsi Pesan** - Enkripsi teks menggunakan kunci publik RSA
- **🔓 Dekripsi Pesan** - Dekripsi ciphertext menggunakan kunci privat RSA
- **🧮 Kalkulator Modular** - Hitung operasi modular eksponensial manual
- **🌙 Dark Mode** - Interface dengan tema gelap/terang
- **📱 Responsive Design** - Bekerja di desktop dan mobile

## 📚 Materi

Website ini dibuat berdasarkan materi kuliah Matematika Diskrit tentang kriptografi RSA:

- Prinsip dasar RSA dengan pasangan kunci (publik e, privat d)
- Prosedur generate key: pilih p & q prima, hitung n = pq, φ(n) = (p-1)(q-1)
- Enkripsi: c = m^e mod n
- Dekripsi: m = c^d mod n
- Blocking untuk pesan panjang (contoh: 3 digit per blok)

## 🛠️ Teknologi

- **Frontend**: HTML5, Tailwind CSS, shadcn/ui components
- **Backend**: Node.js (Vercel Serverless Functions)
- **Algoritma**: Murni JavaScript tanpa library eksternal
- **Deploy**: Vercel (Free hosting)

## 📦 Cara Deploy

### Via Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
```

### Via GitHub
1. Fork repository ini
2. Import ke Vercel dashboard
3. Auto-deploy pada setiap push

## 🎯 Contoh Penggunaan

### Generate Key
- Input p = 47, q = 71
- Hasil: n = 3337, e = 79, d = 1019

### Enkripsi
- Pesan: "HARI INI"
- ASCII: 7265827332737873
- Blok 3 digit: 726 582 733 273 787 003
- Ciphertext: 215 776 1743 933 1731 158

### Dekripsi
- Input ciphertext dengan kunci privat d = 1019
- Hasil: "HARI INI"

## 📄 License

MIT License - Bebas digunakan untuk pembelajaran

## 👨‍💻 Author

Althaf Syakir (5052231020) - Institut Teknologi Sepuluh Nopember (ITS)
Farras (5052231002)
