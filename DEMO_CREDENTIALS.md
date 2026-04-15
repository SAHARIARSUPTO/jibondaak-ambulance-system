# Demo Credentials for JibonDaak Ambulance System

## 🚑 Demo Accounts for Testing

### 👤 User/Patient Account
Use this account to test the user dashboard and booking features:

```
Email: user@demo.com
Password: demo123
```

**Features to Test:**
- Emergency SOS button
- Ambulance type selection (Non-AC, AC, ICU, Freezer)
- Digital triage form (3-step patient information)
- Live tracking map
- ETA display
- Quick action cards
- Trip sharing

---

### 🚨 Ambulance Service Provider Account
Use this account to test the provider dashboard:

```
Email: provider@demo.com
Password: demo123
```

**Features to Test:**
- Add ambulance registration
- Online/Offline toggle
- View incoming requests
- Accept/Reject requests
- Active bookings tracking
- Real-time notifications

---

## 📝 How to Create Demo Accounts

### Option 1: Register via UI
1. Go to `/register` page
2. Select user type from dropdown
3. Fill in the form with demo credentials
4. Click "Create Account"

### Option 2: Direct Database Insert (MongoDB)

#### User Account:
```javascript
db.users.insertOne({
  name: "Demo User",
  email: "user@demo.com",
  phone: "01712345678",
  password: "$2a$10$YourHashedPasswordHere", // demo123
  role: "user",
  createdAt: new Date()
})
```

#### Provider Account:
```javascript
db.users.insertOne({
  name: "Demo Provider",
  email: "provider@demo.com",
  phone: "01798765432",
  password: "$2a$10$YourHashedPasswordHere", // demo123
  role: "provider",
  companyName: "Demo Ambulance Services",
  licenseNumber: "DAS-2024-001",
  isOnline: false,
  createdAt: new Date()
})
```

---

## 🧪 Testing Flow

### Complete User Journey:
1. **Login** as user (`user@demo.com`)
2. **Dashboard** opens with map
3. Click **SOS** button
4. Select **ambulance type** (e.g., AC Ambulance)
5. Fill **triage form** (3 steps)
6. Wait for **provider to accept**
7. See **live tracking** and **ETA**
8. **Share trip** via WhatsApp/SMS

### Complete Provider Journey:
1. **Login** as provider (`provider@demo.com`)
2. **Provider Dashboard** opens
3. Click **"Add Ambulance"** button
4. Fill ambulance details:
   - Driver Name: "Karim Ahmed"
   - Phone: "01712345678"
   - Vehicle Number: "Dhaka Metro-GA-11-1234"
   - Type: "AC Ambulance"
5. Toggle **"Online"** status
6. Wait for **user to click SOS**
7. **Popup notification** appears with sound
8. Click **"Accept"** button
9. See booking in **Active Bookings**
10. Track **user location** on map

---

## 🔐 Password Hash Generation

If you need to generate password hashes for MongoDB:

```javascript
const bcrypt = require('bcryptjs');
const password = 'demo123';
const hash = await bcrypt.hash(password, 10);
console.log(hash);
```

---

## 📍 Default Test Location

**Dhaka, Bangladesh:**
- Latitude: `23.8103`
- Longitude: `90.4125`

This is used as the default location when GPS permission is denied.

---

## ⚠️ Important Notes

1. **Real-time Polling:**
   - User dashboard: Every 5 seconds
   - Provider dashboard: Every 3 seconds

2. **Toast Notifications:**
   - Auto-dismiss after 3 seconds
   - No alert() or prompt() used

3. **Database:**
   - MongoDB Atlas: `jibondaak`
   - Collections: users, bookings, ambulances, hospitals, firstAidGuides, ambulanceTypes

4. **Status Flow:**
   - `searching` → User clicked SOS
   - `driver_assigned` → Provider accepted
   - `en_route` → Driver on the way
   - `arrived` → Driver reached location
   - `completed` → Trip finished
   - `cancelled` → Booking cancelled

---

## 🎨 UI Themes

- **User Dashboard:** Blue gradient theme
- **Provider Dashboard:** Dark navy theme with slate-900 and blue-900
- **Login/Register:** Blue-950 gradient background

---

## 📞 Support

For any issues or questions, contact the development team.

**Database:** MongoDB Atlas  
**Framework:** Next.js 16.0.1  
**Styling:** Tailwind CSS
