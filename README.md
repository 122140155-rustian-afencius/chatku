# ChatKu - Realtime Chat Application

Aplikasi web chat realtime yang dibangun dengan Next.js 16, shadcn/ui, dan Ably untuk komunikasi realtime.

## ✨ Fitur

- 🚀 **Realtime Messaging** - Pesan langsung terkirim ke semua pengguna yang aktif
- 👥 **Active Users** - Lihat siapa saja yang sedang online
- ⌨️ **Typing Indicator** - Indikator ketika pengguna lain sedang mengetik
- 📜 **Message History** - Muat 50 pesan terakhir secara otomatis
- 🎨 **Clean UI** - Menggunakan shadcn/ui components dengan Tailwind CSS
- 📱 **Responsive** - Tampilan optimal di desktop dan mobile
- 🔒 **Anonymous Auth** - Cukup masukkan nama, tanpa perlu akun
- ⚡ **Anti-spam** - Cooldown 800ms untuk mencegah spam
- 🎯 **Message Validation** - Maksimal 300 karakter per pesan
- 📊 **Virtualized List** - Performa optimal dengan react-virtuoso

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: shadcn/ui + Tailwind CSS v4
- **Realtime**: Ably (Messages + Presence)
- **Validation**: Zod
- **ID Generation**: nanoid
- **Virtualization**: react-virtuoso
- **TypeScript**: Full type safety

## 📦 Instalasi

1. Clone repository:

```bash
git clone <repository-url>
cd chatku
```

2. Install dependencies:

```bash
bun install
```

3. Setup environment variables:

Salin file `.env.local.example` menjadi `.env.local`:

```bash
cp .env.local.example .env.local
```

Kemudian edit `.env.local` dan tambahkan Ably API key Anda:

```env
NEXT_PUBLIC_ABLY_KEY=your_ably_api_key_here
```

**Cara mendapatkan Ably API Key:**

1. Buat akun gratis di [Ably.com](https://ably.com)
2. Buat aplikasi baru di dashboard
3. Salin API key dari tab "API Keys"
4. Gunakan Root key atau buat key baru dengan capabilities: `publish`, `subscribe`, `presence`

5. Jalankan development server:

```bash
bun dev
```

5. Buka browser di [http://localhost:3000](http://localhost:3000)

## 📁 Struktur Proyek

```
src/
├── app/
│   ├── api/
│   │   └── ably-auth/       # Route handler untuk Ably authentication
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/
│   ├── chat/
│   │   ├── ActiveUsers.tsx   # Daftar user yang aktif
│   │   ├── ChatContainer.tsx # Main container component
│   │   ├── ChatFeed.tsx      # Chat message list
│   │   ├── ConnectionStatus.tsx # Status koneksi indicator
│   │   ├── MessageInput.tsx  # Input untuk kirim pesan
│   │   └── NameForm.tsx      # Form untuk input nama
│   └── ui/                   # shadcn/ui components
├── hooks/
│   ├── useAblyConnection.ts  # Hook untuk Ably connection
│   ├── useMessages.ts        # Hook untuk messages
│   ├── usePresence.ts        # Hook untuk presence
│   └── useTypingIndicator.ts # Hook untuk typing indicator
├── lib/
│   ├── ably/
│   │   ├── client.ts         # Ably client initialization
│   │   └── constants.ts      # Konstanta Ably
│   ├── utils/
│   │   ├── avatar.ts         # Utilities untuk avatar
│   │   └── time.ts           # Utilities untuk timestamp
│   ├── validations/
│   │   └── name.ts           # Zod schemas
│   ├── storage.ts            # localStorage utilities
│   ├── types.ts              # TypeScript types
│   └── utils.ts              # General utilities
```

## 🎯 Clean Architecture Principles

Aplikasi ini mengikuti best practices clean architecture:

### 1. **Separation of Concerns**

- **Components**: UI layer yang fokus pada presentasi
- **Hooks**: Business logic dan state management
- **Lib**: Core utilities dan services
- **API Routes**: Backend endpoints

### 2. **Dependency Injection**

- Components menerima data via props
- Hooks provide abstraction untuk external services (Ably)
- No hard-coded dependencies

### 3. **Single Responsibility**

- Setiap component/hook punya satu tanggung jawab spesifik
- `ChatFeed` = display messages
- `MessageInput` = handle input
- `ActiveUsers` = show presence

### 4. **Type Safety**

- TypeScript untuk semua code
- Zod untuk runtime validation
- Strict type checking

### 5. **Reusability**

- Custom hooks bisa digunakan di component lain
- UI components dari shadcn/ui
- Utility functions tersentralisasi

## 🚀 Fitur Utama

### 1. Realtime Messaging

- Menggunakan Ably Channels untuk pub/sub pattern
- Auto-load 50 pesan terakhir dari history
- Scroll otomatis ke pesan terbaru
- Message grouping berdasarkan pengirim dan waktu

### 2. Presence System

- Real-time list user yang aktif
- Auto enter/leave presence saat join/disconnect
- Avatar dengan inisial nama dan warna unik

### 3. Typing Indicator

- Throttled events (500ms cooldown)
- Auto-hide setelah 3 detik
- Tidak menampilkan typing dari user sendiri

### 4. Connection Management

- Auto-reconnect saat koneksi terputus
- Visual indicator untuk status koneksi
- Graceful degradation

### 5. Input Validation

- Nama: 2-20 karakter, alfanumerik + spasi
- Pesan: 1-300 karakter
- Anti-spam cooldown 800ms
- Character counter

## 🎨 UX Features

- **Message Grouping**: Pesan dari user yang sama dikelompokkan
- **Timestamps**: Relatif time untuk setiap pesan
- **Virtualized List**: Smooth scrolling untuk ribuan pesan
- **Responsive Layout**: Grid yang adaptif untuk mobile/desktop
- **Visual Feedback**: Loading states, error messages, typing indicators
- **Keyboard Shortcuts**: Enter = send, Shift+Enter = new line

## 🔐 Security & Best Practices

- **Token-based Auth**: Ably auth via backend route
- **Input Validation**: Client + server-side validation dengan Zod
- **Rate Limiting**: Anti-spam cooldown
- **No Sensitive Data**: Anonymous users, no PII storage
- **Type Safety**: Full TypeScript coverage

## 📝 Environment Variables

```env
NEXT_PUBLIC_ABLY_KEY=your_ably_api_key
```

**Note**: Prefix `NEXT_PUBLIC_` membuat variable accessible di client-side.

## 🧪 Development

```bash
# Run development server
bun dev

# Build for production
bun run build

# Run production server
bun start

# Lint
bun run lint
```

## 📄 License

MIT

## 👨‍💻 Author

Built with ❤️ using Next.js 16 and Ably
