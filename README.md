# 🏦 TrustShield Bank — Enterprise AI-Powered Digital Banking Fraud Detection DevOps Command Center

Live Demo: https://enterprise-ai-powered-digital-banki-wheat.vercel.app
Backend API: https://enterprise-ai-powered-digital-banking.onrender.com

## 🚀 Overview
Enterprise-grade digital banking platform with AI fraud detection, real-time monitoring, and 4 role-based command centers. Built with MERN stack, deployed on Vercel + Render.

## ✨ Features (23 Modules)

### 🔐 Authentication
- Real DB registration with Unique Banking ID (e.g. CRS29081998-4521)
- Separate success page with "Save it for future further reference"
- Duplicate email check, unregistered login check
- 6-digit OTP with 3-min validity, 2FA authenticator
- Role-based login: Admin, RiskManager, SupportAgent, Customer

### 👑 Role Dashboards
**Admin Command Center**
- User stats (2,847 users, $4.2M volume), branch performance
- Staff management, audit log export, compliance reports

**AI Fraud Intelligence (RiskManager)**
- Live fraud alerts with AI risk scores (92, 87, 76)
- Block/Approve actions, 98.2% AI accuracy

**Customer Care Pro (SupportAgent)**
- CSAT 4.8⭐, 360° customer search
- Dispute tickets resolve/escalate, KYC verification

**Premium Banking (Customer)**
- Gradient balance card, instant transfer
- Smart spending insights, AI savings tip, PDF statements

### 🏦 Banking Modules
- KYC document upload & verification
- Dispute/Chargeback ticketing
- Scheduled recurring payments
- Staff management, fund transfer
- Loans, wallet, deposits, credit score
- Branch management, settlement, analytics
- AI chatbot, notifications, real-time WebSocket alerts

## 🛠️ Tech Stack
**Frontend:** React 19, Vite, React Router v7, Recharts
**Backend:** Node.js, Express, MongoDB, JWT, Nodemailer
**DevOps:** Vercel (frontend), Render (backend), GitHub Actions CI

## 📦 Setup

### Backend
```bash
cd server
npm install
# .env
MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret
EMAIL_USER=your_gmail
EMAIL_PASS=your_app_password
PORT=5000
CLIENT_URL=https://your-vercel-url
npm start
```

### Frontend
```bash
cd client
npm install
# .env
VITE_API_URL=https://your-render-url
npm run dev
```

## 🔑 Environment Variables
| Variable | Description |
|----------|-------------|
| MONGO_URI | MongoDB Atlas URI |
| JWT_SECRET | JWT signing secret |
| EMAIL_USER | Gmail for OTP |
| EMAIL_PASS | Gmail App Password |
| VITE_API_URL | Backend Render URL |

## 📊 Project Stats
- 23 backend routes
- 14 frontend routes
- 4 role dashboards
- 100% button clickable, all functions working

## 👨‍💻 Author
**Rubel Ali** — MERN Full Stack Developer
GitHub: [@matiur25580](https://github.com/matiur25580)

## 📄 License
MIT
