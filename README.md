# Reyarts — Premium Art Portfolio Platform

A full-stack MERN web application for artist **Reya Saran** — a digital portfolio and creative space.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS v4, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT, bcryptjs |
| Images | Cloudinary |
| Emails | Nodemailer |

## Quick Start

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
# Fill in your MongoDB Atlas URI and Cloudinary credentials in .env
npm install
npm run dev
```

Backend runs at: `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

## Environment Variables (backend/.env)

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `EMAIL_USER` | Gmail address for contact form |
| `EMAIL_PASS` | Gmail app password |
| `EMAIL_TO` | Where contact emails are sent |

## Creating the First Admin

1. Register a new account at `/register`
2. In MongoDB Atlas, find your user document and change `role` from `"user"` to `"admin"`
3. Log in again — you'll now have access to `/admin`

## Features

- 🖼️ **Gallery** — Masonry grid, filter by category/medium/year, search, sort
- 📖 **Journal** — Artist blog with rich categories
- ⏳ **Timeline** — Animated journey timeline
- 🏛️ **Exhibitions** — Past & upcoming show listings
- 👤 **About** — Visual artist story page
- ❤️ **Like & Favorite** — Authenticated user interactions
- 💬 **Comments** — On artworks (authenticated)
- 🌙 **Dark/Light Mode** — Persisted preference
- 🔐 **Admin Dashboard** — Manage all content
- 📱 **Responsive** — Mobile-first design

## Project Structure

```
Reyarts/
├── frontend/          ← React + Vite + Tailwind
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       ├── services/
│       └── ...
└── backend/           ← Express + MongoDB
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    └── utils/
```

## API Base URL

`http://localhost:5000/api`

Health check: `GET /api/health`

---

*Built with ♥ for Reya Saran's creative journey*
