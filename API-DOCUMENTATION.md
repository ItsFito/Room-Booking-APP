# 📚 API Documentation - Room Booking System

Dokumentasi lengkap semua services dan endpoints yang tersedia.

---

## 🏗️ Architecture Overview

```
Frontend (React/Next.js)
    ↓
Services Layer (/src/services)
    ├── authService
    ├── roomService
    └── bookingService
    ↓
Supabase Client
    ↓
PostgreSQL Database (Supabase)
```

---

## 🔐 Authentication Service

File: `src/services/auth.ts`

### 1. Register (Sign Up)

```typescript
import { authService } from "@/services/auth";

const result = await authService.register(
  email: string,      // "user@example.com"
  password: string,   // "secure_password"
  fullName: string    // "John Doe"
);

// Returns
{
  success: boolean,
  user: {
    id: string,
    email: string,
    // ... other auth fields
  }
}
```

**Usage Example:**

```typescript
try {
  const { success, user } = await authService.register("john@example.com", "Password123!", "John Doe");

  if (success) {
    console.log("User created:", user);
    // Redirect to login
  }
} catch (error) {
  console.error("Registration failed:", error);
}
```

**Database Changes:**

- Creates auth user in `auth.users` table
- Creates profile in `users` table with role = 'user'

---

### 2. Login (Sign In)

```typescript
const result = await authService.login(
  email: string,      // "user@example.com"
  password: string    // "secure_password"
);

// Returns
{
  success: boolean,
  user: {
    id: string,
    email: string,
    // ... auth fields
  }
}
```

**Usage Example:**

```typescript
const { success, user } = await authService.login("john@example.com", "Password123!");

if (success) {
  // User logged in
  // Redirect to dashboard
}
```

---

### 3. Logout (Sign Out)

```typescript
const result = await authService.logout();

// Returns
{
  success: boolean;
}
```

**Usage Example:**

```typescript
const { success } = await authService.logout();

if (success) {
  // Clear local state
  // Redirect to login
}
```

---

### 4. Get Current User

```typescript
const user = await authService.getCurrentUser();

// Returns: User | null
// {
//   id: string,
//   email: string,
//   // ... auth fields
// }
```

**Usage Example:**

```typescript
const currentUser = await authService.getCurrentUser();

if (currentUser) {
  console.log("Logged in as:", currentUser.email);
} else {
  console.log("Not logged in");
}
```

---

### 5. Get User Profile

```typescript
const profile = await authService.getUserProfile(userId: string);

// Returns: User | null
// {
//   id: string,
//   email: string,
//   full_name: string,
//   role: 'user' | 'admin',
//   created_at: string,
//   updated_at: string
// }
```

**Usage Example:**

```typescript
const profile = await authService.getUserProfile(userId);

if (profile) {
  console.log("Name:", profile.full_name);
  console.log("Role:", profile.role);
}
```

---

### 6. On Auth State Change (Listener)

```typescript
const unsubscribe = await authService.onAuthStateChange(
  callback: (user: any) => void
);

// Usage
authService.onAuthStateChange((user) => {
  if (user) {
    console.log("User logged in:", user.id);
  } else {
    console.log("User logged out");
  }
});
```

---

## 🏠 Room Service

File: `src/services/rooms.ts`

### 1. Get All Rooms

```typescript
import { roomService } from "@/services/rooms";

const rooms = await roomService.getAllRooms();

// Returns: Room[]
// {
//   id: string,
//   name: string,
//   description: string,
//   capacity: number,
//   location: string,
//   price_per_hour: number,
//   image_url?: string,
//   created_at: string,
//   updated_at: string
// }[]
```

**Usage Example:**

```typescript
const rooms = await roomService.getAllRooms();

rooms.forEach((room) => {
  console.log(`${room.name} - $${room.price_per_hour}/hr`);
});
```

---

### 2. Get Room By ID

```typescript
const room = await roomService.getRoomById(id: string);

// Returns: Room | null
```

**Usage Example:**

```typescript
const room = await roomService.getRoomById("room-123");

if (room) {
  console.log("Room:", room.name);
  console.log("Capacity:", room.capacity);
} else {
  console.log("Room not found");
}
```

---

### 3. Create Room (Admin Only)

```typescript
const newRoom = await roomService.createRoom(
  room: {
    name: string,
    description: string,
    capacity: number,
    location: string,
    price_per_hour: number,
    image_url?: string
  }
);

// Returns: Room (with id and timestamps)
```

**Usage Example:**

```typescript
const room = await roomService.createRoom({
  name: "Conference Room A",
  description: "Large conference room with projector",
  capacity: 20,
  location: "Building 1, Floor 2",
  price_per_hour: 100,
  image_url: "https://example.com/room.jpg",
});

console.log("Room created with ID:", room.id);
```

---

### 4. Update Room (Admin Only)

```typescript
const updated = await roomService.updateRoom(
  id: string,
  room: Partial<Room>
);

// Returns: Room (updated)
```

**Usage Example:**

```typescript
const updated = await roomService.updateRoom("room-123", {
  price_per_hour: 120,
  capacity: 25,
});

console.log("Room updated:", updated);
```

---

### 5. Delete Room (Admin Only)

```typescript
const result = await roomService.deleteRoom(id: string);

// Returns: { success: boolean }
```

**Usage Example:**

```typescript
const { success } = await roomService.deleteRoom("room-123");

if (success) {
  console.log("Room deleted");
}
```

---

## 📅 Booking Service

File: `src/services/bookings.ts`

### 1. Create Booking

```typescript
import { bookingService } from "@/services/bookings";

const booking = await bookingService.createBooking(
  booking: {
    user_id: string,
    room_id: string,
    start_date: string,      // "2025-12-01"
    end_date: string,        // "2025-12-01"
    start_time: string,      // "09:00"
    end_time: string,        // "10:00"
    status: 'pending',
    notes?: string
  }
);

// Returns: Booking (with id and timestamps)
```

**Usage Example:**

```typescript
const booking = await bookingService.createBooking({
  user_id: "user-123",
  room_id: "room-456",
  start_date: "2025-12-01",
  end_date: "2025-12-01",
  start_time: "09:00",
  end_time: "10:00",
  status: "pending",
  notes: "Meeting with team",
});

console.log("Booking created with ID:", booking.id);
```

---

### 2. Get Bookings By User

```typescript
const bookings = await bookingService.getBookingsByUserId(userId: string);

// Returns: Booking[]
```

**Usage Example:**

```typescript
const myBookings = await bookingService.getBookingsByUserId("user-123");

console.log(`You have ${myBookings.length} bookings`);

myBookings.forEach((booking) => {
  console.log(`${booking.start_date} ${booking.start_time}`);
});
```

---

### 3. Get All Bookings (Admin)

```typescript
const bookings = await bookingService.getAllBookings();

// Returns: Booking[]
```

---

### 4. Get Booking By ID

```typescript
const booking = await bookingService.getBookingById(id: string);

// Returns: Booking | null
```

**Usage Example:**

```typescript
const booking = await bookingService.getBookingById("booking-123");

if (booking) {
  console.log("Status:", booking.status);
  console.log("Token:", booking.token);
}
```

---

### 5. Update Booking Status

```typescript
const updated = await bookingService.updateBookingStatus(
  id: string,
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled'
);

// Returns: Booking (updated)
```

---

### 6. Approve Booking (Admin)

```typescript
const approved = await bookingService.approveBooking(
  id: string,
  expiresAt: string  // ISO format timestamp
);

// Returns: Booking (with token and token_expires_at set)
```

**Usage Example:**

```typescript
// Calculate expiration time (end of booking time)
const expiresAt = new Date("2025-12-01 10:00").toISOString();

const approved = await bookingService.approveBooking("booking-123", expiresAt);

console.log("Token generated:", approved.token);
console.log("Expires at:", approved.token_expires_at);
```

**What Happens:**

- Status changed to 'approved'
- Token auto-generated (32 char random string)
- Token expiration set to booking end time
- User can see token in booking detail

---

### 7. Reject Booking (Admin)

```typescript
const rejected = await bookingService.rejectBooking(id: string);

// Returns: Booking (with status = 'rejected')
```

**Usage Example:**

```typescript
const rejected = await bookingService.rejectBooking("booking-123");

console.log("Booking rejected");
```

**What Happens:**

- Status changed to 'rejected'
- Booking disappears from admin list (filtering by status)
- User can still see it in their history (status visible)
- No token generated

---

### 8. Get Unavailable Slots

```typescript
const slots = await bookingService.getUnavailableSlots(
  roomId: string,
  date: string  // "2025-12-01"
);

// Returns: Array of { start_time, end_time }
// [
//   { start_time: "09:00", end_time: "10:00" },
//   { start_time: "14:00", end_time: "15:00" }
// ]
```

**Usage Example:**

```typescript
const unavailable = await bookingService.getUnavailableSlots("room-123", "2025-12-01");

console.log("Cannot book these times:");
unavailable.forEach((slot) => {
  console.log(`${slot.start_time} - ${slot.end_time}`);
});
```

**Used For:**

- Disable dropdown options dalam form
- Show booked slots
- Prevent double bookings

---

### 9. Delete Booking

```typescript
const result = await bookingService.deleteBooking(id: string);

// Returns: { success: boolean }
```

---

## 🛠️ Utility Functions

File: `src/lib/utils.ts`

### 1. Generate Token

```typescript
import { generateToken } from "@/lib/utils";

const token = generateToken();

// Returns: string (32 character random token)
// Example: "a7f3e2d9c1b4f6a8e5d2c9b1f4a7e3d6"
```

---

### 2. Format Date

```typescript
import { formatDate } from "@/lib/utils";

const formatted = formatDate(date: Date | string);

// Returns: string in Indonesian format
// Example: "1 Desember 2025"
```

---

### 3. Format Time

```typescript
import { formatTime } from "@/lib/utils";

const formatted = formatTime(time: string);

// Takes: "09:00:00"
// Returns: "09:00"
```

---

### 4. Is Time Slot Available

```typescript
import { isTimeSlotAvailable } from "@/lib/utils";

const available = isTimeSlotAvailable(
  start: string,              // "09:00"
  end: string,                // "10:00"
  unavailableSlots: TimeSlot[]
);

// Returns: boolean
```

---

### 5. Generate Time Slots

```typescript
import { generateTimeSlots } from "@/lib/utils";

const slots = generateTimeSlots();

// Returns: Array of TimeSlot
// [
//   { start: "06:00", end: "07:00" },
//   { start: "07:00", end: "08:00" },
//   ...
//   { start: "22:00", end: "23:00" }
// ]
```

---

### 6. Get Next Days

```typescript
import { getNextDays } from "@/lib/utils";

const days = getNextDays(days: number = 30);

// Returns: Array of date strings (YYYY-MM-DD)
// ["2025-12-01", "2025-12-02", ..., "2025-12-30"]
```

---

## 📊 Type Definitions

File: `src/types/index.ts`

### User Type

```typescript
interface User {
  id: string;
  email: string;
  full_name: string;
  role: "user" | "admin";
  created_at: string;
  updated_at: string;
}
```

### Room Type

```typescript
interface Room {
  id: string;
  name: string;
  description: string;
  capacity: number;
  location: string;
  price_per_hour: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
}
```

### Booking Type

```typescript
interface Booking {
  id: string;
  user_id: string;
  room_id: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled";
  token?: string;
  token_expires_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
```

### TimeSlot Type

```typescript
interface TimeSlot {
  start: string; // "09:00"
  end: string; // "10:00"
}
```

---

## 🔄 Common Usage Patterns

### Pattern 1: Fetch Data on Component Mount

```typescript
import { useEffect, useState } from "react";
import { roomService } from "@/services/rooms";

export function RoomsList() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await roomService.getAllRooms();
        setRooms(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <div>
      {rooms.map((r) => (
        <div key={r.id}>{r.name}</div>
      ))}
    </div>
  );
}
```

---

### Pattern 2: Form Submission

```typescript
import { bookingService } from "@/services/bookings";
import { showToast } from "@/components/common/Toast";

async function handleSubmit(formData) {
  try {
    const booking = await bookingService.createBooking(formData);
    showToast("success", "Booking created successfully");
    // Redirect or refresh
  } catch (error) {
    showToast("error", error.message);
  }
}
```

---

### Pattern 3: Protected Admin Action

```typescript
import { authService } from "@/services/auth";

async function deleteRoom(roomId) {
  const user = await authService.getCurrentUser();
  const profile = await authService.getUserProfile(user.id);

  if (profile.role !== "admin") {
    showToast("error", "Not authorized");
    return;
  }

  await roomService.deleteRoom(roomId);
  showToast("success", "Room deleted");
}
```

---

## 🚀 Error Handling

### Standard Error Response

```typescript
try {
  const data = await roomService.getRoomById(id);
  if (!data) {
    throw new Error("Room not found");
  }
} catch (error) {
  console.error(error.message);
  // Handle error
}
```

### Common Errors

| Error                       | Cause                      | Solution           |
| --------------------------- | -------------------------- | ------------------ |
| "Row level security policy" | No permission              | Check RLS policies |
| "Foreign key constraint"    | Referenced row missing     | Verify IDs exist   |
| "Duplicate key value"       | Unique constraint violated | Check data exists  |
| "Connection failed"         | Supabase unreachable       | Check env vars     |
| "Session expired"           | Token invalid              | Re-authenticate    |

---

## 📖 Integration Example

Complete flow dari register sampai booking:

```typescript
// 1. Register
const { user } = await authService.register("john@example.com", "Password123", "John Doe");

// 2. Login
await authService.login("john@example.com", "Password123");

// 3. Get rooms
const rooms = await roomService.getAllRooms();

// 4. Get unavailable slots
const unavailable = await bookingService.getUnavailableSlots(rooms[0].id, "2025-12-01");

// 5. Create booking
const booking = await bookingService.createBooking({
  user_id: user.id,
  room_id: rooms[0].id,
  start_date: "2025-12-01",
  end_date: "2025-12-01",
  start_time: "09:00",
  end_time: "10:00",
  status: "pending",
});

// 6. Admin approve (separate session)
const profile = await authService.getUserProfile(adminUserId);
if (profile.role === "admin") {
  const approved = await bookingService.approveBooking(booking.id, "2025-12-01T10:00:00Z");
  console.log("Token:", approved.token);
}

// 7. User see booking and token
const myBooking = await bookingService.getBookingById(booking.id);
console.log("Status:", myBooking.status);
console.log("Token:", myBooking.token);
```

---

**Happy Coding! 🚀**
