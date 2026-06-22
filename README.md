# 🚀 NebulaCart – Full Stack E-Commerce Platform

A modern, full-stack e-commerce platform built with React, Node.js, Express, and MongoDB.

## ✨ Features

### Customer Side
- 🏠 Beautiful landing page with featured products
- 🛍️ Product listing with filters, search, sorting, pagination
- 📦 Detailed product pages with reviews and ratings
- 🛒 Shopping cart with quantity management
- 🎟️ Coupon / discount code system
- ✅ Multi-step checkout (Address → Payment → Confirm)
- 📋 Order history and tracking
- 👤 User profile management
- 🔐 JWT Authentication (Login / Register)

### Admin Dashboard
- 📊 Analytics with revenue charts and order stats
- 📦 Full product CRUD (Add / Edit / Delete)
- 🛒 Order management with status updates and tracking
- 🎟️ Coupon management (percentage & fixed discounts)
- 👥 User management (roles & account control)

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Recharts |
| Styling | CSS Variables, Inline styles (no framework needed) |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT (JSON Web Tokens) |
| Images | Cloudinary |
| Deployment | Render (backend) + Vercel (frontend) |

## 📁 Project Structure

```
nebulacart/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth middleware
│   ├── seeder.js        # Sample data seeder
│   └── server.js        # Express server entry
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/  # Reusable components
│       ├── context/     # React Context (Auth, Cart)
│       ├── pages/       # All page components
│       └── utils/       # API helper functions
├── .env.example         # Environment template
├── .gitignore
└── package.json
```

## 🚀 Quick Start

See the setup guide below or follow SETUP.md.

### 1. Install dependencies
```bash
npm run install-all
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and secrets
```

### 3. Seed sample data
```bash
node backend/seeder.js
```

### 4. Run development servers
```bash
npm run dev
```

Frontend: http://localhost:3000  
Backend API: http://localhost:5000

## 🔑 Demo Accounts (after seeding)
- **Admin:** admin@nebulacart.com / admin123456
- **Customer:** customer@test.com / customer123

## 🎟️ Sample Coupons
- `NEBULA10` — 10% off (min ₹500)
- `SPACE20` — 20% off (min ₹2000, max discount ₹500)
- `COSMOS200` — ₹200 flat off (min ₹1000)
- `LAUNCH50` — 50% off (min ₹3000, max ₹1000)
