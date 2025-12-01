#  Deployment Guide - Room Booking System PWA

Panduan lengkap untuk upload project ke GitHub dan deploy ke Vercel.

---

##  Daftar Isi

1. [Prerequisites](#prerequisites)
2. [Setup GitHub](#setup-github)
3. [Push ke GitHub](#push-ke-github)
4. [Deploy ke Vercel](#deploy-ke-vercel)
5. [Post-Deployment](#post-deployment)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Sebelum memulai, pastikan Anda memiliki:

-  Akun GitHub (https://github.com)
-  Akun Vercel (https://vercel.com)
-  Git terinstall di komputer (https://git-scm.com)
-  Project sudah siap dan berjalan di localhost:3000
-  Semua file sudah di-commit dan tidak ada error

---

## Setup GitHub

### Step 1: Create Repository di GitHub

1. Buka https://github.com/new
2. Isi **Repository name**: room-booking-app (atau nama lain sesuai preferensi)
3. Pilih **Public** (agar Vercel bisa akses)
4. **Jangan** pilih "Initialize this repository with a README" (karena project sudah punya README)
5. Klik **Create repository**

Setelah dibuat, Anda akan melihat halaman dengan setup instructions.

---

## Push ke GitHub

### Step 1: Setup Git di Project

Buka terminal di folder project dan jalankan:

\\\ash
# Navigate ke folder project
cd "C:\Users\Azzam\OneDrive\Documents\room-booking-app"

# Inisialisasi git (jika belum ada)
git init

# Set konfigurasi git (ganti dengan nama dan email Anda)
git config user.name "Your Name"
git config user.email "your.email@example.com"
\\\

### Step 2: Add All Files

\\\ash
# Tambahkan semua file ke staging area
git add .

# Cek status (harus ada file yang ditambahkan)
git status
\\\

### Step 3: First Commit

\\\ash
# Buat commit pertama
git commit -m "Initial commit: Room booking PWA application"
\\\

### Step 4: Connect ke Remote Repository

\\\ash
# Ganti USERNAME dengan username GitHub Anda
git remote add origin https://github.com/USERNAME/room-booking-app.git

# Verifikasi remote sudah benar
git remote -v
\\\

### Step 5: Rename Branch ke 'main'

\\\ash
git branch -M main
\\\

### Step 6: Push ke GitHub

\\\ash
# Push branch main ke GitHub
git push -u origin main
\\\

**Gunakan Personal Access Token sebagai password (bukan password akun biasa)**

Cara generate Personal Access Token:
1. Buka https://github.com/settings/tokens
2. Klik **Generate new token**  **Generate new token (classic)**
3. Beri nama: room-booking-deploy
4. Pilih scope:  repo (full control of private repositories)
5. Klik **Generate token**
6. Copy token dan gunakan sebagai password saat git push

---

## Deploy ke Vercel

### Step 1: Buka Vercel Dashboard

1. Buka https://vercel.com
2. Login dengan akun GitHub Anda
3. Klik **New Project**

### Step 2: Import Repository

1. Pilih **Import Git Repository**  GitHub
2. Authorize Vercel untuk akses GitHub
3. Cari repository room-booking-app Anda
4. Klik **Import**

### Step 3: Add Environment Variables

Ini adalah langkah **PENTING**!

1. Di halaman konfigurasi Vercel, scroll ke **Environment Variables**
2. Tambahkan dua variable:

**Variable 1:**
- Name: NEXT_PUBLIC_SUPABASE_URL
- Value: https://[YOUR-PROJECT-ID].supabase.co

**Variable 2:**
- Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
- Value: [YOUR-ANON-KEY]

Cara mendapat nilai di Supabase:
- Buka Supabase dashboard  Settings  API
- Copy **Project URL** untuk NEXT_PUBLIC_SUPABASE_URL
- Copy **anon public** key untuk NEXT_PUBLIC_SUPABASE_ANON_KEY

3. Klik **Deploy**

### Step 4: Tunggu Build Selesai

Vercel akan otomatis build dan deploy. Waktu biasa: 3-10 menit

Setelah build selesai, Anda akan dapat URL seperti:
https://room-booking-app.vercel.app

---

## Post-Deployment

### Update Supabase URL

1. Buka Supabase Dashboard
2. Settings  Auth  URL Configuration
3. Tambahkan URL Vercel Anda: https://room-booking-app.vercel.app

### Setup Custom Domain (Optional)

Di Vercel:
1. Project Settings  Domains
2. Add domain (misal: room-booking.com)
3. Follow instructions untuk update DNS

---

## Update & Re-deploy

Setiap kali membuat perubahan:

\\\ash
cd "C:\Users\Azzam\OneDrive\Documents\room-booking-app"

# Buat perubahan di code

# Test local
npm run dev

# Commit perubahan
git add .
git commit -m "Fix: deskripsi perubahan"

# Push ke GitHub (Vercel otomatis akan re-deploy)
git push
\\\

---

## Troubleshooting

### Error: "Build failed"

**Penyebab umum:**
1. Missing environment variables
2. TypeScript errors
3. Dependency issues

**Solusi:**
- Jalankan local: npm run build
- Fix error yang muncul
- Commit dan push lagi

### Error: "Supabase connection failed"

**Solusi:**
1. Verifikasi environment variables benar di Vercel
2. Pastikan RLS policies sudah di-setup di Supabase
3. Cek browser DevTools console untuk error detail

---

## Quick Commands

### Push ke GitHub
\\\ash
cd "C:\Users\Azzam\OneDrive\Documents\room-booking-app"
git add .
git commit -m "Deskripsi perubahan"
git push
\\\

### View Vercel Logs
1. Buka https://vercel.com
2. Click project
3. Deployments  klik deployment terbaru

---

##  Selesai!

Aplikasi Anda sudah live di internet!

Support:
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
