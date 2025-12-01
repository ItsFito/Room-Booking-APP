# 🔧 TROUBLESHOOTING GUIDE - Room Booking System

Panduan lengkap untuk mengatasi masalah umum yang mungkin Anda temui.

---

## 🏗️ Build & Development Issues

### Issue 1: "npm install" Failed

**Gejala:**

```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solusi:**

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules dan package-lock
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstall
npm install
```

---

### Issue 2: Build Error - "Unexpected token"

**Gejala:**

```
error: Unexpected token '<'
```

**Penyebab:** File corruption atau syntax error

**Solusi:**

```bash
# Run build dengan verbose
npm run build

# Lihat error message yang tepat
# Delete file yang error
# Recreate atau copy dari backup
```

---

### Issue 3: "Module not found" Error

**Gejala:**

```
Module not found: Can't resolve '@/components/...'
```

**Penyebab:** Path alias salah atau file tidak ada

**Solusi:**

1. Verify path di `tsconfig.json` - seharusnya ada `"@": "./src/*"`
2. Check file benar-benar ada di `src/`
3. Restart development server: `Ctrl+C` → `npm run dev`

---

### Issue 4: TypeScript Errors

**Gejala:**

```
error TS7006: Parameter 'x' implicitly has an 'any' type
```

**Solusi:**

```typescript
// ❌ WRONG
const handler = (event) => {};

// ✅ CORRECT
const handler = (event: Event) => {};

// atau dengan any (jika tidak tahu type)
const handler = (event: any) => {};
```

---

### Issue 5: "Cannot find module" di Node Modules

**Gejala:**

```
Cannot find module '@supabase/supabase-js' or dependencies
```

**Solusi:**

```bash
# Reinstall specific package
npm install --save @supabase/supabase-js

# atau jika all broken
npm install
```

---

## 🔐 Authentication Issues

### Issue 6: "Login Failed" - Invalid Credentials

**Gejala:**

- Login button tidak work
- No error message

**Troubleshooting:**

1. Check `.env.local` punya `NEXT_PUBLIC_SUPABASE_URL`
2. Verify email yang digunakan ada di Supabase (SQL Editor → SELECT \* FROM auth.users)
3. Check password benar
4. Browser console → lihat error details

**Solusi:**

```bash
# Test Supabase connection
# Buka browser DevTools → Console
# Paste dan run:

import { supabase } from '@/lib/supabase'
const { data, error } = await supabase.auth.getUser()
console.log(data, error)
```

---

### Issue 7: "Session Expired" Randomly

**Gejala:**

- Logout sendiri setelah beberapa menit
- Redirect ke login page

**Penyebab:** Session timeout atau token expired

**Solusi:**

1. Check Supabase → Authentication → Policies
2. Increase session duration jika needed
3. Clear browser cookies: DevTools → Application → Storage → clear

---

### Issue 8: "Email Already Registered"

**Gejala:**

- Signup dengan email baru → Error "Email already exists"
- Padahal email baru

**Penyebab:** Email masih di database

**Solusi:**

1. Verifikasi di Supabase → users table
2. Jika email sudah ada tapi tidak ingat password:
   - Click "Forgot Password" di login page
   - Atau delete user di Supabase SQL Editor
   - Signup ulang

---

## 🏠 Room Management Issues

### Issue 9: "Cannot Create Room" (Admin)

**Gejala:**

- Form submit tidak work
- No error message

**Troubleshooting:**

1. Verify user adalah admin:
   ```sql
   -- Di Supabase SQL Editor
   SELECT id, email, role FROM users WHERE role = 'admin';
   ```
2. Check form fields valid:
   - Name tidak kosong
   - Capacity adalah number
   - Price adalah number
3. Check browser console untuk error

**Solusi:**

```bash
# Debug form submission
# Buka browser DevTools → Console
# Click submit → lihat error message
```

---

### Issue 10: "Room Not Displaying"

**Gejala:**

- Admin create room tapi tidak muncul di user view
- Rooms list kosong

**Troubleshooting:**

1. Check database:
   ```sql
   -- Di Supabase SQL Editor
   SELECT * FROM rooms;
   ```
2. If rooms exist tapi tidak tampil:
   - Refresh page
   - Clear cache: Ctrl+Shift+Delete
3. Check RLS policy:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'rooms';
   ```

---

## 📅 Booking Issues

### Issue 11: "Cannot Create Booking"

**Gejala:**

- Click "Book This Room" → Error
- Form tidak submit

**Troubleshooting:**

1. Check tanggal pilih >= hari ini
2. Check time range valid (start < end)
3. Check room sudah dipilih
4. Browser console → lihat error

**Solusi:**

```bash
# Debug: Check unavailable slots
# Di browser console:

import { bookingService } from '@/services/bookings'
const slots = await bookingService.getUnavailableSlots('room-id', '2025-12-01')
console.log(slots)
```

---

### Issue 12: "Cannot See Booking Token"

**Gejala:**

- Admin approve booking
- User booking tidak tampil token

**Troubleshooting:**

1. Refresh page
2. Check booking status di database:
   ```sql
   SELECT id, status, token, token_expires_at FROM bookings;
   ```
3. Verify token di-generate

**Solusi:**

- Token hanya tampil jika status = 'approved'
- Jika admin approve tapi tidak ada token:
  - Check browser console untuk error
  - Try approve ulang

---

### Issue 13: "Slot Sudah Dibook" Tapi Slot Kosong

**Gejala:**

- Slot menunjukkan unavailable
- Tapi user tidak lihat booking lain

**Penyebab:** Pending bookings juga count sebagai unavailable

**Solusi:**

- Ini by design: pending dan approved slots tidak bisa dibook
- Admin harus reject pending bookings yang tidak jadi
- Atau wait sampai auto-cancel (jika diimplementasi)

---

## 🌐 PWA & Offline Issues

### Issue 14: "Service Worker Not Registering"

**Gejala:**

- App tidak bisa install
- Offline tidak work

**Troubleshooting:**

1. Check di browser → DevTools → Application → Service Workers
2. Should show: `sw.js` → Status "activated"
3. If tidak ada:
   - Check `public/sw.js` ada
   - Hard refresh: `Ctrl+Shift+R`
   - Clear site data

**Solusi:**

```bash
# Di browser console
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('✅ SW registered', reg))
    .catch(err => console.log('❌ SW failed', err))
}
```

---

### Issue 15: "Cannot Install PWA"

**Gejala:**

- No install button di browser
- Manifest error

**Troubleshooting:**

1. Check manifest.json:
   ```bash
   # Di browser DevTools → Application → Manifest
   ```
2. Manifest harus valid JSON
3. Icons harus ada
4. Display mode: "standalone"

**Solusi:**

- Manual test di mobile:
  - Chrome/Edge: Share menu → "Add to Home Screen"
  - Safari: Safari menu → "Add to Home Screen"

---

### Issue 16: "App Tidak Bekerja Offline"

**Gejala:**

- Offline mode → blank page
- Static pages tidak cached

**Troubleshooting:**

1. Check service worker aktif
2. Check manifest icons
3. Network → offline mode → reload

**Solusi:**

- SW cache hanya static assets
- Dynamic content (bookings, rooms) perlu offline DB (future feature)
- For now: offline = readonly access ke cached pages

---

## 🚀 Deployment Issues

### Issue 17: "Vercel Build Failed"

**Gejala:**

```
Build failed: npm run build exited with code 1
```

**Troubleshooting:**

1. Check build logs di Vercel
2. Same errors seperti local build
3. Run `npm run build` locally untuk debug

**Solusi:**

```bash
# Fix locally
npm run build

# Push ke GitHub
git add .
git commit -m "Fix build error"
git push origin main

# Vercel auto-redeploy
```

---

### Issue 18: "Supabase Connection Failed di Production"

**Gejala:**

- App work locally
- Vercel deployment → cannot connect DB

**Penyebab:** Environment variables tidak terset di Vercel

**Solusi:**

1. Vercel Dashboard → Settings → Environment Variables
2. Verify ada: `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Redeploy

---

### Issue 19: "Auth Redirect Loop di Production"

**Gejala:**

- Deployment → redirect ke login infinite
- Cannot login

**Penyebab:** Redirect URLs tidak set di Supabase

**Solusi:**

1. Supabase → Authentication → URL Configuration
2. Add Vercel URL:
   - `https://your-app.vercel.app`
   - `https://your-app.vercel.app/auth/callback`
3. Wait 5 minutes
4. Test login di Vercel URL

---

### Issue 20: "CORS Error di Production"

**Gejala:**

```
Access to XMLHttpRequest blocked by CORS policy
```

**Penyebab:** Supabase CORS settings

**Solusi:**

1. Supabase → Settings → CORS
2. Add Vercel domain:
   ```
   https://your-app.vercel.app
   ```
3. Clear browser cache
4. Retry

---

## 💾 Database Issues

### Issue 21: "Cannot Query Database"

**Gejala:**

- Error: "Row level security policy for table"
- Cannot read/write data

**Penyebab:** RLS policy tidak set atau user tidak punya permission

**Solusi:**

1. Check RLS enabled:
   ```sql
   -- Di Supabase SQL Editor
   SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'rooms';
   ```
2. Check policies:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'rooms';
   ```
3. If no policies → create:
   ```sql
   CREATE POLICY allow_select ON rooms FOR SELECT USING (true);
   ```

---

### Issue 22: "Duplicate Key Error"

**Gejala:**

```
Error: duplicate key value violates unique constraint
```

**Penyebab:** Data sudah ada atau unique constraint violation

**Solusi:**

1. Check data existing:
   ```sql
   SELECT * FROM rooms WHERE name = 'Room Name';
   ```
2. Delete jika duplicate:
   ```sql
   DELETE FROM rooms WHERE id = 'id-value';
   ```
3. Retry operation

---

### Issue 23: "Foreign Key Constraint Failed"

**Gejala:**

```
Error: insert or update on table violates foreign key constraint
```

**Penyebab:** Referenced row tidak ada

**Solusi:**
Contoh: Create booking dengan room_id yang tidak ada

```bash
# Verify room exists
SELECT * FROM rooms WHERE id = 'room-id';

# Verify user exists
SELECT * FROM users WHERE id = 'user-id';
```

---

## 🎨 UI/UX Issues

### Issue 24: "Layout Broken di Mobile"

**Gejala:**

- Mobile view tidak responsive
- Bottom nav cut off
- Text overflowing

**Troubleshooting:**

1. Check MainLayout punya `pb-24`
2. Check responsive classes: `md:`, `lg:`
3. Browser DevTools → Toggle device toolbar

**Solusi:**

```tsx
// Ensure pb-24 untuk bottom nav space
export function MainLayout({ children }: { children: React.ReactNode }) {
  return <div className="pb-24">{children}</div>;
}
```

---

### Issue 25: "Dropdown Not Working"

**Gejala:**

- Date/time dropdown tidak open
- Cannot select values

**Troubleshooting:**

1. Check `<select>` element ada di form
2. Check JavaScript tidak disabled
3. Browser DevTools → Console: lihat errors

**Solusi:**

- Ensure form element proper:

```tsx
<select className="w-full p-2 border rounded">
  <option value="">Select Date</option>
  <option value="2025-12-01">2025-12-01</option>
</select>
```

---

## 🔗 Network & API Issues

### Issue 26: "Slow Loading / Timeout"

**Gejala:**

- Request timeout
- "Request timed out after 30s"

**Penyebab:** Database slow atau connection issue

**Troubleshooting:**

1. Check Supabase project active
2. Check network speed
3. Check query kompleks

**Solusi:**

```bash
# Optimize database query
# Add indexes pada frequently searched columns
CREATE INDEX idx_bookings_room_date ON bookings(room_id, start_date);
```

---

### Issue 27: "Rate Limit / 429 Error"

**Gejala:**

```
Error: 429 Too Many Requests
```

**Penyebab:** Terlalu banyak request dalam waktu singkat

**Solusi:**

- Vercel: Auto-handles
- Supabase: Upgrade plan jika needed
- Code: Add request debounce/throttle

---

## 🆘 Getting Help

### Saat Stuck:

1. **Check Error Message:**

   - Browser DevTools Console (F12)
   - Server logs (terminal/console)
   - Vercel build logs

2. **Search Solution:**

   - Google error message
   - Stack Overflow
   - GitHub issues

3. **Reproduce Locally:**

   ```bash
   npm run dev
   # Try same action locally
   # See if error persists
   ```

4. **Review Code:**

   - Check recent changes
   - Git diff
   - Rollback jika perlu

5. **Ask Community:**
   - Next.js Discord
   - Supabase Discord
   - Stack Overflow

---

## ✅ Prevention Tips

- ✅ Always test locally before pushing
- ✅ Use TypeScript strict mode
- ✅ Commit frequently with clear messages
- ✅ Document environment setup
- ✅ Keep dependencies updated
- ✅ Monitor error logs
- ✅ Backup database regularly

---

**Selamat, Anda siap mengatasi masalah! 🎯**
