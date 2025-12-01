# Room Booking System PWA - Complete Setup Guide

Aplikasi PWA modern untuk peminjaman ruangan dengan Supabase backend, Next.js frontend, dan admin panel lengkap.

## 📋 Daftar Isi

1. [Fitur](#-fitur)
2. [Tech Stack](#-tech-stack)
3. [Prerequisites](#-prerequisites)
4. [Setup & Installation](#-setup--installation)
5. [Database Setup](#-database-setup)
6. [Deployment](#-deployment)
7. [Troubleshooting](#-troubleshooting)

---

## 🎯 Fitur

### User Features

- ✅ Autentikasi (Login/Register) via Supabase
- ✅ Browse dan filter ruangan
- ✅ Lihat detail ruangan
- ✅ Form peminjaman dengan date/time dropdowns (BUKAN popup)
- ✅ Real-time unavailable slot detection
- ✅ Riwayat peminjaman dengan status
- ✅ Auto-generated token saat approved
- ✅ Halaman profil & tentang aplikasi

### Admin Features

- ✅ Dashboard dengan statistik
- ✅ Manajemen ruangan (Add/Edit/Delete)
- ✅ Manajemen peminjaman (Approve/Reject)
- ✅ Token otomatis generate & auto-expire
- ✅ Rejected bookings disappear dari admin view (tetap di user history)
- ✅ Real-time status management

### PWA Features

- ✅ Offline support dengan service worker
- ✅ Web manifest untuk installasi ke home screen
- ✅ Mobile-responsive layout
- ✅ Bottom navigation bar (always visible)
- ✅ Toast notifications
- ✅ Installable di iOS, Android, Desktop

---

## 🛠 Tech Stack

| Komponen      | Technology                   |
| ------------- | ---------------------------- |
| Frontend      | Next.js 15+ (TypeScript)     |
| Styling       | Tailwind CSS                 |
| Backend       | Supabase (PostgreSQL + Auth) |
| Notifications | Sonner                       |
| PWA           | next-pwa                     |
| Deployment    | Vercel                       |

---

## 📦 Prerequisites

- Node.js 18+ dan npm
- Akun Supabase (free tier ok)
- Akun GitHub (untuk deploy ke Vercel)
- Browser modern dengan PWA support

---

## ⚙️ Setup & Installation

### Step 1: Clone/Setup Project

Jika sudah ada folder project:

```bash
cd room-booking-app
npm install
```

### Step 2: Konfigurasi Environment

Buat file `.env.local` di root project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...xxxxxxxx
```

Cara mendapat nilai:

1. Buka https://app.supabase.com
2. Login dengan email kamu
3. Pilih project atau buat project baru
4. Buka menu **Settings → API**
5. Copy:
   - **Project URL** → NEXT_PUBLIC_SUPABASE_URL
   - **anon public** key → NEXT_PUBLIC_SUPABASE_ANON_KEY

### Step 3: Database Setup

Buka Supabase dashboard → SQL Editor, jalankan semua query di bawah:

#### 3.1 Create Users Table

```sql
CREATE TABLE IF NOT EXISTS public.users (
  id uuid REFERENCES auth.users(id) PRIMARY KEY,
  email text NOT NULL UNIQUE,
  full_name text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_users_email ON public.users(email);
```

#### 3.2 Create Rooms Table

```sql
CREATE TABLE IF NOT EXISTS public.rooms (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  capacity integer NOT NULL DEFAULT 1 CHECK (capacity > 0),
  location text NOT NULL,
  price_per_hour integer DEFAULT 0 CHECK (price_per_hour >= 0),
  image_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_rooms_location ON public.rooms(location);
```

#### 3.3 Create Bookings Table

```sql
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  room_id uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  start_time text NOT NULL,
  end_time text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'cancelled')),
  token text UNIQUE,
  token_expires_at timestamp with time zone,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_room_id ON public.bookings(room_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_token ON public.bookings(token);
```

#### 3.4 Create Booking Tokens Table

```sql
CREATE TABLE IF NOT EXISTS public.booking_tokens (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id uuid NOT NULL UNIQUE REFERENCES public.bookings(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  expires_at timestamp with time zone NOT NULL,
  used_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_booking_tokens_token ON public.booking_tokens(token);
CREATE INDEX idx_booking_tokens_expires ON public.booking_tokens(expires_at);
```

#### 3.5 Enable Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_tokens ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Rooms policies
CREATE POLICY "Anyone can view rooms" ON public.rooms
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert rooms" ON public.rooms
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update rooms" ON public.rooms
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete rooms" ON public.rooms
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Bookings policies
CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all bookings" ON public.bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only admins can update bookings" ON public.bookings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Booking tokens policies
CREATE POLICY "Users can view own tokens" ON public.booking_tokens
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE id = booking_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all tokens" ON public.booking_tokens
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

#### 3.6 Setup Auth Trigger (Auto-create user profile)

```sql
-- Trigger untuk auto-create user profile saat auth.users dibuat
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Step 4: Create Admin User

Setelah signup via app, buka SQL Editor dan jalankan:

```sql
-- Replace 'admin@example.com' dengan email admin yang terdaftar
UPDATE public.users
SET role = 'admin'
WHERE email = 'admin@example.com';
```

### Step 5: Run Development Server

```bash
npm run dev
```

Akses http://localhost:3000

---

## 🗄️ Database Schema

```
users
├── id (uuid, PK)
├── email (text)
├── full_name (text)
├── role (user | admin)
├── created_at
└── updated_at

rooms
├── id (uuid, PK)
├── name (text)
├── description (text)
├── capacity (int)
├── location (text)
├── price_per_hour (int)
├── image_url (text)
├── created_at
└── updated_at

bookings
├── id (uuid, PK)
├── user_id (uuid, FK → users)
├── room_id (uuid, FK → rooms)
├── start_date (date)
├── end_date (date)
├── start_time (text HH:MM)
├── end_time (text HH:MM)
├── status (pending | approved | rejected | completed | cancelled)
├── token (text)
├── token_expires_at (timestamp)
├── notes (text)
├── created_at
└── updated_at

booking_tokens
├── id (uuid, PK)
├── booking_id (uuid, FK → bookings)
├── token (text, unique)
├── expires_at (timestamp)
├── used_at (timestamp)
└── created_at
```

---

## 🧪 Testing Manual

### User Flow:

1. [ ] Signup → email verification email dikirim
2. [ ] Login dengan email/password
3. [ ] Redirect ke dashboard
4. [ ] Browse rooms dengan search
5. [ ] Klik room → lihat detail
6. [ ] Book Now → form peminjaman
7. [ ] Pilih date/time dari dropdown (bukan popup)
8. [ ] Submit booking
9. [ ] Status pending di My Bookings

### Admin Flow:

1. [ ] Login sebagai admin
2. [ ] Sidebar/menu muncul Admin option
3. [ ] Go to Admin → lihat dashboard
4. [ ] Manage Rooms → add/edit/delete
5. [ ] Manage Bookings → lihat pending
6. [ ] Approve booking → token generated
7. [ ] Token visible di booking detail
8. [ ] Reject booking → hilang dari pending list
9. [ ] Booking masih ada di user history dengan status rejected

---

## 📱 PWA Installation

### Chrome Desktop:

1. Buka app di Chrome
2. Klik icon "Install app" di address bar
3. Click "Install"

### Android:

1. Buka app di Chrome/Edge mobile
2. Menu (⋮) → "Install app"
3. Confirm

### iOS (Safari):

1. Buka app di Safari
2. Share button → "Add to Home Screen"
3. Adjust name → Add

---

## 🚀 Deploy ke Vercel

### Step 1: Push ke GitHub

```bash
cd room-booking-app
git add .
git commit -m "Room booking PWA app"
git branch -M main
git remote add origin https://github.com/USERNAME/room-booking-app.git
git push -u origin main
```

### Step 2: Deploy

1. Buka https://vercel.com
2. Login dengan GitHub
3. Import project
4. Set Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click "Deploy"

### Step 3: Custom Domain (Optional)

Di Vercel Project Settings → Domains, tambahkan custom domain

---

## 📁 Project Structure

```
room-booking-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout + PWA setup
│   │   ├── page.tsx                # Landing page
│   │   ├── globals.css             # Global styles
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── dashboard/page.tsx      # User dashboard
│   │   ├── rooms/
│   │   │   ├── page.tsx            # Rooms list
│   │   │   └── [id]/page.tsx       # Room detail
│   │   ├── bookings/
│   │   │   ├── page.tsx            # My bookings
│   │   │   ├── [id]/page.tsx       # Booking detail
│   │   │   └── create/page.tsx     # Create booking form
│   │   ├── profile/page.tsx        # User profile
│   │   └── admin/
│   │       ├── page.tsx            # Admin dashboard
│   │       ├── rooms/page.tsx      # Manage rooms
│   │       └── bookings/page.tsx   # Manage bookings
│   ├── components/
│   │   ├── common/
│   │   │   ├── BottomNavigation.tsx
│   │   │   ├── MainLayout.tsx
│   │   │   ├── PWAInstall.tsx
│   │   │   └── Toast.tsx
│   │   ├── RoomCard.tsx
│   │   ├── BookingCard.tsx
│   │   └── ProtectedRoute.tsx
│   ├── services/
│   │   ├── auth.ts
│   │   ├── rooms.ts
│   │   └── bookings.ts
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── public/
│   ├── manifest.json
│   ├── sw.js                        # Service worker
│   ├── favicon.ico
│   └── apple-touch-icon.png
├── .env.local                       # Environment variables
├── next.config.js
├── tailwind.config.ts
├── vercel.json
└── package.json
```

---

## 🔧 Configuration Files

### next.config.js

- PWA dengan next-pwa
- Image optimization
- React Strict Mode

### vercel.json

- Build & dev command
- Framework detection
- Environment variables setup

### manifest.json

- PWA metadata
- App icons (192x192, 512x512)
- Theme colors
- Display mode: standalone

---

## 🐛 Troubleshooting

### Error: "Missing Supabase environment variables"

**Solution:**

- Pastikan `.env.local` exist di root project
- Check URL dan key benar
- Restart dev server: `npm run dev`

### Login tidak bekerja

**Solution:**

- Verify Supabase auth enabled
- Check email/password benar
- Lihat Supabase Dashboard → Authentication → Users

### Bookings tidak muncul

**Solution:**

- Cek RLS policies di Supabase
- Verify user_id match dengan auth.uid()
- Check timestamp format (ISO 8601)

### Service Worker tidak register

**Solution:**

- Check browser console untuk error
- PWAInstall component harus di layout.tsx
- Service worker harus di `/public/sw.js`
- Clear browser cache/cookies

### Token tidak generate

**Solution:**

- Check admin approve button di admin/bookings
- Verify booking status = 'approved'
- Token must be unique di database

---

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [PWA Checklist](https://web.dev/pwa-checklist/)

---

## 📄 Important Notes

1. **Date/Time Selection**: Menggunakan `<select>` dropdown, BUKAN date picker popup
2. **Unavailable Slots**: Auto-loaded dari database, slot yang booked tidak bisa dipilih
3. **Rejected Bookings**: Hilang dari admin pending list, tetap di user history
4. **Token System**: Auto-generated, expires pada end_time peminjaman
5. **PWA**: Fully offline-capable dengan service worker caching
6. **RLS**: Semua access control via Supabase Row Level Security

---

## 🎉 You're All Set!

Aplikasi siap untuk production. Untuk questions, check documentation atau Supabase community forum.

Happy coding! 🚀
