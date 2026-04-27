# 🎩 Shelby's Crew — Complete Setup & Deployment Guide

## 🖥️ Local Dev (Running Now)

| App     | URL                     | Credentials          |
|---------|-------------------------|----------------------|
| Client  | http://localhost:5173   | Public               |
| Admin   | http://localhost:5174   | admin / admin123     |
| Backend | http://localhost:5000   | N/A (API)            |

---

## 🗄️ Step 1: Setup Supabase

1. Go to https://supabase.com and create a free account
2. Create a new project (e.g. `shelbys-crew`)
3. Go to **SQL Editor** → paste the entire contents of `backend/supabase_schema.sql` → Run
4. Go to **Project Settings → API**
5. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role key** (secret) → `SUPABASE_SERVICE_KEY`
6. Open `backend/.env` and replace the placeholder values:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=eyJhbGci...your-key
   ```

---

## 🚀 Step 2: Deploy Backend to Render (Free)

1. Push your code to GitHub (create a new repo)
2. Go to https://render.com → **New Web Service**
3. Connect your GitHub repo → select the `backend` folder
4. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
5. Add Environment Variables (from your `.env`):
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `JWT_SECRET`
   - `ADMIN_USERNAME` = `admin`
   - `ADMIN_PASSWORD_HASH` = `$2b$10$X3ebjQ.vJOavy2U7gjiGse0xF0TDPor1coKBy2b2E/2O8ylinosem`
   - `ALLOWED_ORIGINS` = (your Vercel client + admin URLs, comma-separated)
6. Click **Deploy** → note your backend URL (e.g. `https://shelbys-crew-api.onrender.com`)

---

## 🌐 Step 3: Deploy Client to Vercel

1. Go to https://vercel.com → **New Project**
2. Import your GitHub repo → set **Root Directory** to `client`
3. Add Environment Variable:
   - `VITE_API_URL` = `https://shelbys-crew-api.onrender.com/api`
4. Click **Deploy**
5. Note your client URL (e.g. `https://shelbys-crew.vercel.app`)

---

## 🛡️ Step 4: Deploy Admin to Vercel

1. Go to https://vercel.com → **New Project**
2. Import same GitHub repo → set **Root Directory** to `admin`
3. Add Environment Variable:
   - `VITE_API_URL` = `https://shelbys-crew-api.onrender.com/api`
4. Click **Deploy**
5. Note your admin URL (e.g. `https://shelbys-crew-admin.vercel.app`)

---

## 🔗 Step 5: Update CORS on Backend

After deploying, go to Render → update `ALLOWED_ORIGINS`:
```
ALLOWED_ORIGINS=https://shelbys-crew.vercel.app,https://shelbys-crew-admin.vercel.app
```

---

## 🔑 Admin Login
- **Username:** `admin`
- **Password:** `admin123`

> ⚠️ Change the password before going live! Run:
> `node -e "require('bcryptjs').hash('YOUR_NEW_PASSWORD',10).then(console.log)"` in the backend folder, then update `ADMIN_PASSWORD_HASH` in Render env vars.

---

## 📁 Project Structure
```
friut site/
├── backend/              ← Node.js Express API
│   ├── server.js
│   ├── supabase_schema.sql   ← Run in Supabase SQL Editor
│   ├── .env              ← Add your Supabase credentials here
│   └── src/routes/       ← menu, combos, quotes, auth
├── client/               ← Customer-facing React app (Vercel)
│   └── src/pages/        ← Home.jsx, Menu.jsx
└── admin/                ← Admin dashboard (Vercel)
    └── src/pages/        ← Dashboard, MenuItems, Combos, Quotes
```

---

## ✅ Admin Features
| Page         | What you can do                                    |
|--------------|----------------------------------------------------|
| **Menu Items** | Add / Edit / Delete fruits with name, price, unit, category |
| **Combos**    | Add / Edit / Delete combo deals with item lists    |
| **Quotes**    | Add / Edit / Delete / Toggle quotes shown on homepage |
| **Dashboard** | See total counts of items, combos, quotes          |
