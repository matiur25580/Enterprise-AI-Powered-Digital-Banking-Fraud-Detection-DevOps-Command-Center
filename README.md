# TrustShield — Enterprise AI-Powered Digital Banking, Fraud Detection & DevOps Command Center

A full-stack enterprise digital banking platform with AI fraud detection, connecting Admin, Risk Manager, Support Agent and Customer in real-time.

**Live:** Frontend (Vercel) | Backend (Render) | AI Service (Python FastAPI) | MongoDB Atlas

## Languages
TypeScript, JavaScript, Python, HTML, CSS, Dockerfile, Shell

## Tech Stack
- Frontend: React + TypeScript, Tailwind CSS, Axios, React Router
- Backend: Node.js + Express + TypeScript, JWT, Bcrypt, Nodemailer OTP
- AI Service: Python FastAPI - real-time fraud scoring
- Database: MongoDB Atlas
- DevOps: Docker, docker-compose, Shell automation

## Roles & Dashboards
### 1. Admin - Command Center
- User management, account freeze/unfreeze, audit logs
- Stats: total users, transactions, flagged fraud
- Live transaction table with actions

### 2. Risk Manager - Fraud Intelligence
- AI fraud scores from Python service
- 7-day fraud trend with NEXT 7 DAYS forecast
- Flagged transaction approve/block workflow

### 3. Support Agent - Customer Care
- KYC verification queue
- Ticket management, customer support

### 4. Customer - Digital Banking
- Balance view, send money, PDF statement
- Recent transactions history

## Security
- Real DB authentication, no demo logins
- 6-digit Email OTP with 3-minute validity, 6 separate boxes
- JWT with role-based access, Bcrypt password hashing
- .env never committed, .env.example provided

## Quick Start
```bash
./setup.sh
cd server && npm start
cd client && npm run dev
cd ai-service && uvicorn main:app --port 8000
Author
Rubel Ali - MERN Full Stack Developer
