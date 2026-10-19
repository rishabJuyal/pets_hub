# Pet's Hub 🐾 — Expo Go App

Modern, premium pet care business management mobile application built with **React Native** and **Expo Go** (SDK 52), featuring role-based Admin and Customer dashboards, appointment scheduling, pet health profiles, store inventory, and Supabase cloud sync.

---

## 🚀 Quick Start with Expo Go

### Prerequisites
- Install **Node.js** (v18+ or v20+)
- Install the **Expo Go** app on your physical mobile device ([Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) or [iOS App Store](https://apps.apple.com/app/expo-go/id982107772))

### 1. Run the Development Server
In this project directory, run:

```bash
npm start
# or
npx expo start
```

### 2. Scan & Launch in Expo Go
- **Android**: Open the **Expo Go** app and scan the QR code displayed in the terminal.
- **iOS**: Open the native **Camera** app, scan the QR code, and tap the prompt to open in Expo Go.
- **Web preview**: Press `w` in the terminal to view in your web browser.

---

## 🔑 One-Tap Demo Logins

No setup required! On the login screen, use the **Quick Demo Access** buttons:

- **Admin Demo**:
  - Name: Dr. Raj Sharma (Pet's Hub Sikar)
  - Email: `admin@petshub.com`
  - Access: Full clinic KPI dashboard, appointment approval/rejection/reschedule, store inventory (add/edit/delete/stock toggle), and broadcast announcements.
- **Customer Demo**:
  - Name: Rohan Verma
  - Email: `alex@petshub.com`
  - Access: Registered pets (Sheru, Simba), book care visits, view visits history & cancel, browse store products, view push notifications, and manage profile.
- **Registration**:
  - Anyone can register as a new pet owner with their name, email, password, and phone number.
  - Clinic staff can use the secret admin passcode `PETSHUB_ADMIN_2026` during signup to create an Admin account.

---

## 📱 App Highlights & Architecture

### 🐾 Customer Experience
1. **Home**:
   - Crimson red hero welcome banner with clinic location & direct phone call (`+91 9672288833`).
   - "My Furry Family" horizontal carousel of registered pets with quick "+ Add Pet".
   - Upcoming care visit card with inline cancel option.
   - Quick clinic services shortcuts (Vet Doctor ₹450, Grooming ₹850, Boarding ₹700).
2. **Book Appointment**:
   - 5-step booking flow: Choose Pet ➔ Select Service ➔ Select Date ➔ Select Time Slot ➔ Symptoms & Care Notes.
   - Live fee calculation & immediate confirmation dispatch.
3. **Visits**:
   - Filter tabs: All, Upcoming, Completed, Cancelled.
   - Detailed appointment modal with status badges (Pending, Confirmed, Completed, Cancelled).
4. **Shop**:
   - Product catalog with categories (Food & Treats, Grooming, Health & Care, Accessories, Toys).
   - In Stock / Out of Stock indicators and counter pickup details.
5. **Care Alerts**:
   - Real-time notifications for booking confirmations, rescheduling, and clinic vaccination camps.
6. **Profile**:
   - Contact details, full list of registered pets with health tags, clinic information, and Supabase config.

### 🛡️ Admin Experience
1. **Dashboard**:
   - Welcome card with quick actions: `+ Product` and `Broadcast Notice`.
   - Actionable alert banner when pending consultation requests arrive.
   - 4 KPI metric cards: Today's Schedule, Pending Requests, Confirmed Slots, and Registered Owners.
   - Today's appointments timeline with 1-tap Approve, Decline, Reschedule, or Complete.
2. **Clinic Bookings**:
   - Search by pet name, customer name, phone, or service title.
   - Filter tabs: All, Pending, Confirmed, Completed, Cancelled with real-time badges.
   - Reschedule modal with date presets, time slots, and doctor notes to owner.
3. **Store Inventory**:
   - Floating Action Button (`+ Product`) to add new items.
   - Edit, delete, and 1-tap stock availability toggles.
4. **Broadcast Center**:
   - Dispatch clinic announcements and vaccination camp alerts to all registered pet owners.
   - Complete notification dispatch history log.

---

## ☁️ Supabase Cloud & PostgreSQL Integration

The app includes offline demo seed data and persistence via `@react-native-async-storage/async-storage`.

To connect your own live **Supabase** backend:
1. Tap the **Cloud** icon in the header or in Profile.
2. Enter your Supabase Project URL and Public Anon Key.
3. Toggle **Enable Live Supabase Sync**.
4. Tap **View PostgreSQL Schema Script** to copy the ready-to-use table definitions (Profiles, Pets, Services, Appointments, Products, Notifications).

---

## 📁 Project Structure

```
├── App.tsx                      # Root App component with SafeArea & StatusBar
├── index.js                     # Expo entrypoint
├── app.json                     # Expo configuration (icons, splash, bundle ID)
├── package.json                 # Dependencies (React Native 0.76, Expo 52)
├── assets/                      # Official Pet's Hub signboards, badges, icons
├── src/
│   ├── types/                   # TypeScript models & data interfaces
│   ├── theme/                   # Crimson red & porcelain white design system
│   ├── context/                 # PetsHubContext (auth, state, seed data, storage sync)
│   ├── components/              # Header, StatCard, AppointmentCard, PetCard, ProductCard
│   │   └── Modals/              # AddPet, AddEditProduct, Reschedule, AppointmentDetails, Broadcast, Supabase
│   ├── screens/
│   │   ├── auth/                # Login & Registration
│   │   ├── admin/               # AdminDashboard, AdminAppointments, AdminProducts, AdminNotifications
│   │   └── customer/            # CustomerHome, BookAppointment, MyAppointments, CustomerShop, CustomerNotifications, CustomerProfile
│   └── navigation/              # AdminNavigator, CustomerNavigator, RootNavigator
└── android-native/              # Original Android Studio native project backup
```
