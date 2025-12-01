# GitHub & Vercel Deployment Guide

Panduan lengkap untuk push project Room Booking App ke GitHub dan deploy ke Vercel.

---

## 📋 Daftar Isi

1. [Setup Git Configuration](#setup-git-configuration)
2. [Push ke GitHub](#push-ke-github)
3. [Deploy ke Vercel](#deploy-ke-vercel)
4. [Environment Variables](#environment-variables)
5. [Troubleshooting](#troubleshooting)

---

## 🔧 Setup Git Configuration

Jika menggunakan akun GitHub yang berbeda, lakukan konfigurasi lokal terlebih dahulu:

```powershell
cd 'c:\Users\Azzam\OneDrive\Documents\room-booking-app'

# Configure git dengan akun baru
git config user.name "NAMA_KAMU"
git config user.email "EMAIL_GITHUB_KAMU"

# Verifikasi konfigurasi
git config user.name
git config user.email
```

**Catatan:** Ganti `NAMA_KAMU` dan `EMAIL_GITHUB_KAMU` dengan data akun GitHub kamu yang sebenarnya.

---

## 🚀 Push ke GitHub

### Langkah 1: Buat Repository Baru di GitHub

1. Buka https://github.com/new
2. Masukkan nama repository: `room-booking-app`
3. Pilih visibility: Public atau Private
4. **Jangan** centang "Initialize this repository with"
5. Klik **Create repository**
6. Salin URL repository (format HTTPS atau SSH)

### Langkah 2: Commit dan Push Semua File

Jalankan perintah berikut di PowerShell:

```powershell
cd 'c:\Users\Azzam\OneDrive\Documents\room-booking-app'

# Stage semua file
git add .

# Commit dengan pesan deskriptif
git commit -m "Initial commit: Room booking application with Next.js, Supabase, and PWA"

# Rename branch ke main (jika belum)
git branch -M main

# Hapus remote lama jika ada
git remote remove origin

# Tambah remote baru dengan URL repository GitHub kamu
git remote add origin https://github.com/USERNAME/room-booking-app.git

# Push ke GitHub
git push -u origin main
```

**⚠️ Ganti `USERNAME` dengan username GitHub kamu yang sebenarnya.**

### Langkah 3: Verifikasi di GitHub

- Buka https://github.com/USERNAME/room-booking-app
- Pastikan semua file sudah ter-push dengan benar
- Cek branch `main` dengan commit message terbaru

---

## 🎯 Deploy ke Vercel

### Opsi A: Dashboard Vercel (Recommended untuk Pemula)

1. **Login ke Vercel:**

   - Buka https://vercel.com/dashboard
   - Login dengan akun GitHub kamu (atau buat akun baru)

2. **Hubungkan Repository:**

   - Klik **"Add New..."** → **"Project"**
   - Klik **"Continue with GitHub"**
   - Authorize Vercel untuk akses GitHub
   - Cari dan pilih repository `room-booking-app`

3. **Konfigurasi Project:**

   - Framework: **Next.js**
   - Root Directory: **./** (default)
   - Build Command: **npm run build**
   - Output Directory: **.next**

4. **Tambah Environment Variables:**

   - Klik **"Environment Variables"**
   - Tambahkan 2 variable dari Supabase:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Lihat bagian [Environment Variables](#environment-variables) untuk mendapatkan nilainya

5. **Deploy:**
   - Klik **"Deploy"**
   - Tunggu hingga deployment selesai
   - Vercel akan memberikan URL live project

### Opsi B: Vercel CLI (untuk User Advanced)

```powershell
# Install Vercel CLI (jika belum)
npm i -g vercel

# Login ke akun Vercel
vercel login

# Deploy ke production
vercel --prod
```

Saat diminta, ikuti instruksi untuk:

- Confirm project setup
- Masukkan nama project: `room-booking-app`
- Setup environment variables

---

## 🔐 Environment Variables

Project memerlukan 2 environment variables dari Supabase:

### Cara Mendapatkan dari Supabase:

1. Buka https://app.supabase.com/projects
2. Pilih project Supabase kamu
3. Pergi ke **Project Settings** → **API**
4. Copy nilai-nilai berikut:
   - **Project URL** → Gunakan untuk `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → Gunakan untuk `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Setup di Vercel:

1. Dashboard Vercel → Pilih project `room-booking-app`
2. **Settings** → **Environment Variables**
3. Tambahkan dua variable:

| Key                             | Value                      |
| ------------------------------- | -------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...`               |

4. Klik **Save**
5. Trigger redeploy agar environment variables ter-load

---

## ✅ Verification Checklist

Setelah semua langkah selesai, pastikan:

- [ ] Repository sudah di GitHub dengan semua file
- [ ] URL GitHub: `https://github.com/USERNAME/room-booking-app`
- [ ] Repository sudah terhubung ke Vercel
- [ ] Environment variables sudah ter-set di Vercel
- [ ] Deployment status: **Success** (berwarna hijau)
- [ ] Live URL: `https://room-booking-app.vercel.app`
- [ ] Buka live URL dan test login/booking functionality

---

## 🐛 Troubleshooting

### Problem: Git Authentication Error

```powershell
# Solution 1: Gunakan Personal Access Token (PAT)
# Buat PAT di https://github.com/settings/tokens
# Gunakan PAT sebagai password saat push

# Solution 2: Setup SSH Key
# Ikuti guide: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
```

### Problem: Build Error di Vercel

- Cek logs di Vercel dashboard: **Deployments** → pilih deployment → **Logs**
- Verifikasi environment variables sudah benar
- Pastikan semua dependencies ter-install: Cek `package.json`

### Problem: Blank Page atau 404

- Clear browser cache (Ctrl + Shift + Del)
- Pastikan environment variables sudah di-set
- Cek console browser untuk error messages (F12)

### Problem: Supabase Connection Error

- Verifikasi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` sudah benar
- Pastikan table dan policies sudah ter-setup di Supabase
- Cek Supabase logs: https://app.supabase.com → **Logs**

---

## 📚 Useful Links

- **GitHub:** https://github.com/new
- **Vercel:** https://vercel.com/dashboard
- **Supabase:** https://app.supabase.com/projects
- **Next.js Docs:** https://nextjs.org/docs
- **Vercel Docs:** https://vercel.com/docs

---

## 📝 Project Info

- **Project Name:** Room Booking App
- **Framework:** Next.js 16
- **Backend:** Supabase
- **Hosting:** Vercel
- **Package Manager:** npm

---

**Last Updated:** December 1, 2025
