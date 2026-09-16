# Eventify 🎯 — Full-Stack Event Discovery & Booking Platform

Eventify is a full-stack MERN (MongoDB, Express, React, Node.js) application designed for seamless event discovery, ticket reservation, and administrative event management. Featuring a clean, subtle **Neumorphism** UI design system, built-in 2FA email OTP verification, real-time seating availability validation, and an administrative control panel.

---

## ✨ Features

- **🎨 Subtle Neumorphic UI**: Soft raised surfaces, inset input controls, tactile buttons, and clean off-white design palette built with Tailwind CSS.
- **🔐 2FA Email OTP Verification**: 
  - Mandatory Email OTP verification to activate new user accounts.
  - Mandatory 2FA OTP code validation to authorize event ticket reservations.
- **🛡️ Role-Based Access Control (RBAC)**:
  - **Admin**: Create, edit, and delete events. Inspect platform revenue, approve ticket reservations as 'Paid' or 'Free', and reject pending requests.
  - **User**: Browse upcoming events, search by title/category/location, submit ticket reservations via 2FA OTP, view personal dashboard, and cancel bookings.
- **🎟️ Seating & Availability Validation**:
  - Real-time seat reservation tracking and overbooking prevention.
  - Automatic seat restoration upon booking cancellation.
- **📊 Admin Analytics Dashboard**: Live metrics for Total Revenue, Paid Clients count, and Pending Requests queue.
- **📧 Automated Email Notifications**: Instant booking confirmation receipts sent via Nodemailer.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Heroicons v2 (`react-icons/hi2`), Axios, React Router v6.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose ORM, JSON Web Tokens (JWT), Bcrypt.js, Nodemailer.
- **Design System**: Neumorphic UI tokens with Plus Jakarta Sans typography.

---

## 📁 Repository Architecture

```text
Eventify/
├── client/                     # React Frontend Application
│   ├── src/
│   │   ├── components/         # Reusable UI Components (Navbar, etc.)
│   │   ├── context/            # React AuthContext Provider
│   │   ├── pages/              # App Pages (Home, Login, Register, Dashboards)
│   │   ├── utils/              # Axios Instance & Interceptors
│   │   ├── App.jsx             # React Router Configuration
│   │   └── index.css           # Neumorphism CSS Utilities & Design Tokens
│   ├── index.html              # Entry HTML & Google Fonts
│   └── package.json
│
├── server/                     # Express Backend API Server
│   ├── controllers/            # Route Controllers (Auth, Events, Bookings)
│   ├── middleware/             # Auth & Admin JWT Middleware
│   ├── models/                 # Mongoose Data Schemas (User, Event, Booking, OTP)
│   ├── routes/                 # Express API Endpoints
│   ├── utils/                  # Nodemailer Transporter Utility
│   ├── seed.js                 # Database Seeding Utility
│   ├── server.js               # Main Express App Entrypoint
│   └── package.json
│
├── Eventify_Postman_Collection.json  # Pre-configured End-to-End Postman API Tests
├── SETUP_GUIDE.md              # MongoDB & Gmail App Password Setup Guide
├── README.md                   # Project Documentation
└── package.json                # Root Concurrently Orchestration Scripts
```

---

## 🚀 Quick Setup & Run Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (Local MongoDB Community Server or MongoDB Atlas Cloud)

### 1. Environment Configuration
Create a `.env` file in the `server/` directory:

```env
MONGO_URI=mongodb://localhost:27017/eventify
JWT_SECRET=supersecretjwtkey_eventify
PORT=5000

# Optional: Real Gmail Delivery Credentials
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_character_app_password
```

> **Note**: If `EMAIL_USER` and `EMAIL_PASS` are omitted, the backend will print all generated 2FA OTP codes directly to the server terminal console for easy local testing.

### 2. Install Dependencies
Run the installation command from the project root:

```bash
npm run install:all
```

Or install root dependencies:
```bash
npm install
```

### 3. Seed Database (Optional)
To populate your MongoDB database with sample events and demo users:

```bash
npm run seed --prefix server
```

### 4. Start Development Servers
Start both backend (Port 5000) and frontend (Port 5173) simultaneously:

```bash
npm run dev
```

---

## 🔑 Demo Account Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@eventify.com` | `password123` |
| **User** | `user@eventify.com` | `password123` |
| **User** | `alice@eventify.com` | `password123` |

---

## 🧪 Postman API Testing

An exported Postman Collection is included at [`Eventify_Postman_Collection.json`](./Eventify_Postman_Collection.json):
1. Open Postman and click **Import**.
2. Drag and drop `Eventify_Postman_Collection.json`.
3. Test pre-configured requests for Authentication, Event Creation, OTP Verification, and Admin Approval workflows.

---

## 📜 License

Distributed under the MIT License. Developed by [000aksh000](https://github.com/000aksh000).
