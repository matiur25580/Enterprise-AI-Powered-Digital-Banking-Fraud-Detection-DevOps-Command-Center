# TrustShield - Advanced AI + DevOps + Banking Pro (Copilot Prompt)

## AI / FRAUD
1. Real-time scoring: on every customer transfer, call Python FastAPI fraud-score API. If score above threshold, auto-block transaction and create fraud case with reasons.
2. Behavioral biometrics: track login hour pattern and transaction velocity per user. Flag anomaly as badge on Risk Manager dashboard.
3. Fraud ring detection: show linked accounts graph (shared device/IP/beneficiary) on Risk Manager case detail page.
4. Model retrain: Admin page button "Retrain AI Model" calling ai-service /retrain endpoint, show training status and accuracy.

## DEVOPS COMMAND CENTER (Admin only)
1. CI/CD status: show GitHub Actions latest build/deploy history table (mock data ok), status badges success/failed/running.
2. Docker health: cards for client/server/ai-service containers with status, uptime, restart button.
3. API uptime: 24-hour uptime chart, incident timeline list.
4. Env manager: table of required env vars (MONGO_URI, JWT_SECRET, EMAIL_USER, etc.) showing set/missing status without revealing values.
5. DB backup: show last backup time, button for manual backup trigger with success toast.

## BANKING PRO (Customer)
1. Multi-currency: currency selector (USD/EUR/INR), converted balance display with exchange rate note.
2. Loan module: loan apply form, EMI calculator (principal, rate, months), application status tracking.
3. Deposits: fixed deposit / recurring deposit create + list with maturity date and interest.
4. Cheque book: request cheque book button, status tracking (requested/issued/delivered).

## SECURITY PRO (all roles)
1. Device management: list logged-in devices with logout button per device.
2. Login history: table with time, IP, location, status. Block suspicious IP button (Admin/Risk Manager).
3. Session timeout: Admin config for auto-logout minutes.

## REPORTS (Admin)
1. AML/KYC compliance summary with export PDF.
2. Daily settlement report: total in/out per day table.
3. Customer analytics: top customers by transaction volume chart.

COMMON: theme toggle everywhere, DD.MM.YYYY + HH.MM.SS AM/PM header clock, green/blue success toast on every action, fully responsive.
