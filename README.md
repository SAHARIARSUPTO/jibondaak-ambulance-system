# 🚑 JibonDaak - Emergency Ambulance Service System

**JibonDaak** is a real-time ambulance booking and tracking system that connects patients with ambulance service providers instantly. Built with Next.js and MongoDB, it provides a seamless emergency response platform.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bashh
npm install
```

### 2. Setup Environment Variables
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
```

### 3. Create Demo Accounts (Optional)
Run this script to create demo user and provider accounts for testing:
```bash
node scripts/create-demo-accounts.js
```

This will create:
- **User Account:** `user@demo.com` / `demo123`
- **Provider Account:** `provider@demo.com` / `demo123`

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 🧪 Demo Credentials

### 👤 User/Patient Login
```
Email: user@demo.com
Password: demo123
Dashboard: /dashboard
```

**Features:**
- Emergency SOS button
- Ambulance type selection (Non-AC, AC, ICU, Freezer)
- Digital triage form (3-step patient information)
- Live tracking map with driver location
- ETA display and distance calculation
- Trip sharing via WhatsApp/SMS

### 🚨 Ambulance Provider Login
```
Email: provider@demo.com
Password: demo123
Dashboard: /provider-dashboard
```

**Features:**
- Add ambulance registration
- Online/Offline toggle
- Real-time request notifications with sound
- Accept/Reject incoming requests
- Active bookings tracking
- Live location updates

📖 See `DEMO_CREDENTIALS.md` for detailed testing instructions.

---

## ⚙️ Features

### For Users/Patients:
- 🚨 **Emergency SOS Button** - One-click ambulance request
- 📍 **Live Tracking** - Real-time ambulance location on map
- 🏥 **Ambulance Types** - Non-AC, AC, ICU, Freezer ambulances
- 📋 **Digital Triage Form** - 3-step patient information collection
- ⏱️ **ETA Display** - Estimated time of arrival with distance
- 💬 **Live Chat** - Direct communication with driver
- 📤 **Trip Sharing** - Share trip details via WhatsApp/SMS
- 🔔 **Toast Notifications** - Non-intrusive status updates

### For Ambulance Providers:
- 🚑 **Ambulance Management** - Register and manage fleet
- 🟢 **Online/Offline Toggle** - Control availability status
- 🔔 **Real-time Notifications** - Popup alerts with sound for new requests
- ✅ **Accept/Reject System** - Manual request approval
- 📊 **Dashboard Stats** - Total ambulances, pending requests, active bookings
- 📍 **Live Tracking** - Track user location after accepting request
- 🎨 **Dark Navy Theme** - Professional provider interface

---

## 🧩 Tech Stack

- **Frontend:** Next.js 16.0.1, React, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** MongoDB Atlas
- **Maps:** Leaflet.js with OpenStreetMap
- **Icons:** Lucide React
- **Authentication:** bcryptjs
- **Deployment:** Vercel

---

## 📁 Project Structure

```
jibondaak-ambulance-system/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Login & registration
│   │   ├── bookings/          # Booking management
│   │   ├── provider/          # Provider endpoints
│   │   └── ...
│   ├── components/            # React components
│   │   ├── dashboard/         # User dashboard components
│   │   ├── provider/          # Provider components
│   │   └── Toast.jsx          # Toast notification system
│   ├── dashboard/             # User dashboard page
│   ├── provider-dashboard/    # Provider dashboard page
│   ├── login/                 # Login page
│   ├── register/              # Registration page
│   └── ...
├── lib/
│   └── mongodb.js             # MongoDB connection
├── models/                    # Mongoose models
│   ├── User.js
│   ├── Booking.js
│   ├── AmbulanceType.js
│   └── ...
├── scripts/
│   └── create-demo-accounts.js # Demo account creation script
├── .env.local                 # Environment variables
└── package.json
```

---

## 🗄️ Database Collections

- **users** - User and provider accounts
- **bookings** - Ambulance booking records
- **ambulances** - Registered ambulance vehicles
- **hospitals** - Hospital information
- **firstAidGuides** - First aid instructions
- **ambulanceTypes** - Available ambulance types
- **triageForms** - Patient triage data
- **tripShares** - Shared trip tokens

---

## 🔄 Booking Flow

1. **User clicks SOS** → Status: `searching`
2. **Provider sees request** → Real-time polling (3 seconds)
3. **Provider accepts** → Status: `driver_assigned` → `en_route`
4. **Driver arrives** → Status: `arrived`
5. **Trip completes** → Status: `completed`

---

## 🎨 UI Themes

- **User Dashboard:** Blue gradient theme with cyan accents
- **Provider Dashboard:** Dark navy theme (slate-900 + blue-900)
- **Login/Register:** Blue-950 gradient background
- **Loading Screens:** Animated ambulance icon with gradient

---

## 📍 Default Location

When GPS permission is denied, the system uses:
- **Location:** Dhaka, Bangladesh
- **Coordinates:** 23.8103°N, 90.4125°E

---

## ⚡ Real-time Features

- **User Dashboard Polling:** Every 5 seconds
- **Provider Dashboard Polling:** Every 3 seconds
- **Toast Auto-dismiss:** 3 seconds
- **Notification Popup:** 30 seconds auto-close

---

## 👥 Team Members

- **Supto** – Frontend Developer
- **Shuvo** – Backend Developer
- **Sabbir** – Project Coordinator / Designer

---

## 📄 License

MIT License © 2025 JibonDaak Team

---

## 🆘 Support

For issues or questions:
1. Check `DEMO_CREDENTIALS.md` for testing guide
2. Review `developre-guide.md` for development guidelines
3. Contact the development team

---

## 🔗 Links

- **Repository:** [GitHub](https://github.com/SAHARIARSUPTO/jibondaak-ambulance-system)
- **Documentation:** See markdown files in root directory
- **Next.js Docs:** [nextjs.org/docs](https://nextjs.org/docs)

---

**Built with ❤️ by the JibonDaak Team**
