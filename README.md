# EnglishPro - English Learning App (PWA)

## Deskripsi
Aplikasi belajar bahasa Inggris berbasis web (PWA) dengan fitur:
- **Random Conversation** - Latihan percakapan dengan 10 topik (Restoran, Wawancara, Teman, Pasangan, Guru, Atasan, Tetangga, dll)
- **Speech Recognition** - Latihan pengucapan dengan deteksi suara
- **Vocabulary** - Kartu kosakata dengan contoh kalimat
- **IELTS Practice** - Latihan speaking & listening
- **Pronunciation** - Latihan lidah (tongue twisters)

## Fitur Utama Random Conversation
1. User bisa **ketik jawaban sendiri** (bukan pilihan ganda)
2. **Koreksi kata per kata** - salah kata mana, saran koreksi
3. **Toggle** untuk buka/tutup detail koreksi
4. **Tombol Coba Lagi** kalau salah
5. **Pilihan siapa mulai** - kamu atau lawan bicara
6. **10 topik beragam** - Teman, Pasangan, Guru, Atasan, Tetangga, dll

## Struktur File
```
english-learn-app-v2/
├── index.html          # Halaman utama (semua HTML)
├── css/style.css       # Semua styling
├── js/app.js           # Logika aplikasi (conversation engine, speech, vocab)
├── js/data.js          # Data percakapan, kosakata, IELTS
├── sw.js               # Service Worker (PWA offline)
├── manifest.json       # PWA manifest
└── icons/              # Icon PWA
```

## Tech Stack
- Vanilla HTML/CSS/JavaScript (tanpa framework)
- Web Speech API (text-to-speech & speech recognition)
- Service Worker (offline/PWA)
- GitHub Pages (hosting)

## GitHub
- Repo: https://github.com/bramastha48-lgtm/englishpro
- Live: https://bramastha48-lgtm.github.io/englishpro/

