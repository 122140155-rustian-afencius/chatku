# Setup ChatKu - Panduan Lengkap

## 📋 Prerequisites

- Node.js 18+ atau Bun
- Akun Ably (gratis)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
bun install
```

### 2. Setup Ably

1. **Buat akun Ably** (jika belum punya):

   - Kunjungi [https://ably.com](https://ably.com)
   - Klik "Sign Up" dan buat akun gratis
   - Verifikasi email Anda

2. **Buat aplikasi baru**:

   - Login ke Ably dashboard
   - Klik "Create New App"
   - Beri nama aplikasi (contoh: "ChatKu")
   - Pilih region terdekat (Singapore untuk Indonesia)
   - Klik "Create app"

3. **Dapatkan API Key**:
   - Di dashboard aplikasi, klik tab "API Keys"
   - Salin "Root Key" atau buat key baru dengan capabilities:
     - ✅ `publish`
     - ✅ `subscribe`
     - ✅ `presence`
     - ✅ `history`

### 3. Configure Environment

1. Copy file environment:

```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` dan paste Ably API key:

```env
NEXT_PUBLIC_ABLY_KEY=YOUR_API_KEY_HERE
```

**Contoh API Key format**: `xxxxx.yyyyyyy:zzzzzzzzzzzzzz`

### 4. Run Development Server

```bash
bun dev
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

### Test dengan Multiple Users

1. Buka aplikasi di browser pertama
2. Masukkan nama (contoh: "Alice")
3. Buka browser/tab kedua (atau incognito)
4. Masukkan nama berbeda (contoh: "Bob")
5. Kirim pesan dari kedua browser
6. Pesan akan muncul realtime di semua browser yang terbuka

### Test Fitur-Fitur

- ✅ **Realtime Messages**: Kirim pesan dari satu browser, muncul di browser lain
- ✅ **Presence**: Lihat user aktif di sidebar kanan
- ✅ **Typing Indicator**: Ketik pesan, user lain akan melihat indikator "sedang mengetik"
- ✅ **Message History**: Refresh browser, pesan sebelumnya tetap muncul
- ✅ **Connection Status**: Matikan internet, akan muncul banner status
- ✅ **Anti-spam**: Coba kirim pesan berturut-turut, ada cooldown 800ms
- ✅ **Input Validation**: Coba input nama < 2 atau > 20 karakter
- ✅ **Message Limit**: Coba kirim pesan > 300 karakter

## 🔍 Troubleshooting

### Error: "Ably API key not configured"

**Solusi**:

1. Pastikan file `.env.local` ada di root project
2. Pastikan variable name tepat: `NEXT_PUBLIC_ABLY_KEY`
3. Restart dev server setelah mengubah .env

### Error: "Failed to create token"

**Solusi**:

1. Cek apakah API key valid (tidak ada spasi tambahan)
2. Pastikan API key punya capabilities yang dibutuhkan
3. Cek di Ably dashboard apakah app masih aktif

### Pesan tidak muncul realtime

**Solusi**:

1. Cek console browser untuk error
2. Pastikan internet connection aktif
3. Cek status koneksi di banner (atas halaman)
4. Coba refresh browser

### Typing indicator tidak muncul

**Solusi**:

1. Tunggu minimal 500ms antara ketikan
2. Pastikan fokus ada di input field
3. Indicator auto-hide setelah 3 detik

## 📊 Ably Usage & Limits

### Free Tier Limits:

- ✅ 3 million messages/month
- ✅ 100 concurrent connections
- ✅ 100 concurrent channels

Untuk aplikasi chat kecil-menengah, ini lebih dari cukup.

### Monitor Usage:

1. Login ke Ably dashboard
2. Klik aplikasi Anda
3. Tab "Stats" menampilkan:
   - Messages count
   - Connections count
   - Data transfer

## 🎯 Best Practices

### Development

1. **Never commit `.env.local`** - sudah di `.gitignore`
2. **Use different Ably apps** untuk dev/production
3. **Test dengan multiple browsers** untuk verifikasi realtime features
4. **Check Ably logs** di dashboard untuk debugging

### Production

1. **Use separate Ably API key** untuk production
2. **Enable Ably token authentication** (sudah implemented)
3. **Monitor Ably stats** untuk usage
4. **Set up rate limiting** jika diperlukan

## 🔒 Security Notes

- ✅ API key aman di backend (route handler)
- ✅ Token-based auth untuk client
- ✅ Input validation dengan Zod
- ✅ Anti-spam cooldown
- ✅ No sensitive data storage

## 📱 Development Tips

### Hot Reload

Next.js 16 mendukung Fast Refresh. Perubahan code akan langsung terlihat tanpa reload.

### TypeScript

Semua code sudah full TypeScript. Jika ada type error, cek:

```bash
bun run build
```

### Linting

```bash
bun run lint
```

### Clean & Rebuild

Jika ada masalah, coba:

```bash
rm -rf .next
bun dev
```

## 🎨 Customization

### Ubah Channel Name

Edit `src/lib/ably/constants.ts`:

```typescript
export const CHANNEL_NAME = "your-custom-channel";
```

### Ubah Message Limit

Edit `src/lib/ably/constants.ts`:

```typescript
export const MESSAGE_HISTORY_LIMIT = 100; // default: 50
```

### Ubah Cooldown

Edit `src/lib/ably/constants.ts`:

```typescript
export const ANTI_SPAM_COOLDOWN = 1000; // default: 800ms
```

### Ubah Max Character

Edit `src/lib/validations/name.ts`:

```typescript
export const messageSchema = z.string().max(500, "Pesan maksimal 500 karakter"); // default: 300
```

## 📞 Support

Jika mengalami masalah:

1. Cek README.md untuk dokumentasi lengkap
2. Cek issues di repository
3. Cek Ably documentation: [https://ably.com/docs](https://ably.com/docs)

## ✅ Checklist Setup

- [ ] Dependencies installed (`bun install`)
- [ ] Ably account created
- [ ] API key obtained
- [ ] `.env.local` configured
- [ ] Dev server running
- [ ] Tested dengan 2+ browsers
- [ ] All features working

Happy coding! 🚀
