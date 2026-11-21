# TrustShield Bank — Banking Operations & Fraud-Review Demo

A full-stack banking-operations portfolio application with role-based workspaces, account workflows, transaction features and administrative tooling. It is a **demonstration project**, not a licensed banking service, payment processor or production fraud-detection system.

**Live demo:** https://enterprise-ai-powered-digital-banki-wheat.vercel.app  
**Backend API:** https://enterprise-ai-powered-digital-banking.onrender.com  
**Source:** https://github.com/matiur25580/Enterprise-AI-Powered-Digital-Banking-Fraud-Detection-DevOps-Command-Center

## Product areas

### Roles and workspaces

- **Admin:** staff administration, audit exports, compliance views and platform oversight.
- **Risk Manager:** fraud-review workspace and risk-alert workflows.
- **Support Agent:** customer lookup, dispute support and KYC review.
- **Customer:** account dashboard, transfers, deposits, loans, wallet and statement views.

### Banking workflows

- Registration and sign-in with role-aware access and server-side session revocation.
- Transaction request capture with a review-required default; this does not move funds.
- Static demonstration currency conversion; no live FX quotes or wallet settlement.
- Authenticated Socket.IO handshake.
- Several planned modules (including deposits, loans, KYC, disputes, statements, notifications, settlement and 2FA) currently return HTTP 501 or are otherwise incomplete; they are not end-to-end workflows.

### Fraud intelligence — implementation status

The repository includes fraud-review UI and related API modules, but the AI metrics endpoint is intentionally disabled and returns HTTP 501 until a persistent, authorized and audited implementation is ready. Dashboard sample figures and illustrative risk indicators must not be interpreted as live banking records or validated model predictions. No fraud-model accuracy claim is made.

## Technology

| Layer | Stack |
|---|---|
| Frontend | React 19, Vite, React Router, Recharts |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs, role-based middleware |
| Realtime | Socket.IO |
| Email | Nodemailer |
| Tests | Jest |
| Deployment | Vercel frontend, Render API |

## Architecture

```text
React + Vite client
       |
       | HTTPS / JSON API / JWT
       v
Express API
  ├── Authentication and role authorization
  ├── Banking, transactions and account modules
  ├── KYC, disputes and compliance modules
  ├── Audit and reporting modules
  └── Authenticated Socket.IO gateway
       |
       v
MongoDB / Mongoose
```

## Run locally

### Requirements

- Node.js compatible with the package dependencies
- npm
- MongoDB instance

### 1. Backend

```bash
cd server
npm install
```

Create `server/.env`:

```dotenv
MONGO_URI=mongodb://127.0.0.1:27017/trustshield
JWT_SECRET=replace-with-a-unique-random-secret-at-least-32-characters
EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password
PORT=5000
CLIENT_URL=http://localhost:5173
```

Start the API:

```bash
npm start
```

Run backend tests:

```bash
npm test
```

### 2. Frontend

In a second terminal:

```bash
cd client
npm install
```

Create `client/.env`:

```dotenv
VITE_API_URL=http://localhost:5000
```

Start the client:

```bash
npm run dev
```

## Security and responsible use

The API uses an allowlisted CORS configuration, a 1 MB JSON body limit, baseline security response headers, structured 404/error responses, server-side JWT authentication, role checks and authenticated Socket.IO handshakes. Login and registration have per-process rate limits; use a shared Redis-backed limiter before running multiple API instances. The JWT secret must be a unique random value of at least 32 characters.

This project is not connected to a regulated banking ledger, card network or real payment rail. Use synthetic data only. Before any real-world use, the system would require independent security review, threat modelling, financial reconciliation controls, audit validation, privacy/compliance review, penetration testing, operational monitoring and a validated fraud-model evaluation process.

## Verification status

- Backend test command: `npm test` (Jest). Unit coverage includes basic authentication and rate-limit middleware checks; comprehensive API, authorization and integration coverage is still required.
- Frontend production build: `npm run build` from `client/`.
- Do not interpret a successful local build as evidence of production or regulatory readiness.

## Maintainer

**Matiur Rahaman** · [GitHub](https://github.com/matiur25580)


## Dashboard Gallery

Explore 12 illustrative banking and fraud-operations workspaces for operations, transaction monitoring, alerts, transfers, customer accounts, KYC, risk scoring, disputes, reconciliation, access security, service reliability and analytics. Sample values are for UI illustration only; they are not live banking records, risk scores or financial balances.

### 01. Banking Operations Overview

Account activity, transfer status, service health and risk signals.

![Banking Operations Overview dashboard preview](docs/readme-dashboard-gallery/dashboard-01.svg)

### 02. Transaction Monitoring

Transaction volumes, velocity patterns, review queues and risk distribution.

![Transaction Monitoring dashboard preview](docs/readme-dashboard-gallery/dashboard-02.svg)

### 03. Fraud Detection Alerts

Alert severity, suspicious patterns, analyst review and case outcomes.

![Fraud Detection Alerts dashboard preview](docs/readme-dashboard-gallery/dashboard-03.svg)

### 04. Transfer Activity

Transfer requests, idempotency outcomes, validation and processing states.

![Transfer Activity dashboard preview](docs/readme-dashboard-gallery/dashboard-04.svg)

### 05. Customer & Account Overview

Customer profiles, account status, verification and service activity.

![Customer & Account Overview dashboard preview](docs/readme-dashboard-gallery/dashboard-05.svg)

### 06. KYC & Identity Review

Identity verification queue, document review and compliance status.

![KYC & Identity Review dashboard preview](docs/readme-dashboard-gallery/dashboard-06.svg)

### 07. Risk Scoring Workspace

Risk signal distribution, model score trends and review prioritization.

![Risk Scoring Workspace dashboard preview](docs/readme-dashboard-gallery/dashboard-07.svg)

### 08. Dispute & Case Management

Dispute intake, case ownership, investigation stages and resolution.

![Dispute & Case Management dashboard preview](docs/readme-dashboard-gallery/dashboard-08.svg)

### 09. Operational Reconciliation

Transfer request records, reconciliation exceptions and daily summaries.

![Operational Reconciliation dashboard preview](docs/readme-dashboard-gallery/dashboard-09.svg)

### 10. Access & Security Monitoring

Authentication events, session risks, access roles and security reviews.

![Access & Security Monitoring dashboard preview](docs/readme-dashboard-gallery/dashboard-10.svg)

### 11. DevOps & Service Reliability

API health, latency, error rates, background jobs and availability.

![DevOps & Service Reliability dashboard preview](docs/readme-dashboard-gallery/dashboard-11.svg)

### 12. Fraud & Banking Analytics

Fraud trends, transfer mix, customer risk and operational KPIs.

![Fraud & Banking Analytics dashboard preview](docs/readme-dashboard-gallery/dashboard-12.svg)
