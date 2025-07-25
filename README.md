# 📋 SyncPaste

**SyncPaste** is a lightweight, real-time clipboard-sharing app that allows you to paste text across devices instantly using a 4-digit session code. (no authentication or LogIn needed)

Built with Next.js, Supabase, and Pusher, it enables LIVE syncing of clipboard data between users in a shared session.

---

## 🚀 Features

- 🔐 4-digit session code for easy sharing
- 🔁 Real-time clipboard updates using Pusher
- 📱 Responsive and mobile-friendly interface
- 📦 Supabase integration for data storage
- 📊 Paste counter (lifetime stat)
- 📸 QR code generation for quick access to sessions
- ☁️ Deployed on Vercel

---

## 🧰 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/)
- **Database:** [Supabase](https://supabase.com/) (free tier)
- **Real-Time:** [Pusher](https://pusher.com/)
- **UI Styling:** Tailwind CSS
- **Icons:** Lucide Icons
- **QR Code:** qrcode.react

---

## 🛠️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/johannus22/syncpaste.git
cd syncpaste
```

### 2. Create .env file and use your keys on Supabase and Pusher
