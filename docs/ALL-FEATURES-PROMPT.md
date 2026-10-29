# TrustShield - Full Enterprise Features (Copilot Prompt - sob eksathe)

## ADMIN - Command Center
1. System health monitor: CPU, memory, API latency, MongoDB status cards with live refresh every 10 seconds, green/yellow/red status indicators.
2. Staff management: create/edit/deactivate Risk Manager and Support Agent accounts, assign roles, reset passwords. Success toast (green/blue) on every action.
3. Audit log: table with filters by date range, user, action type. Export to PDF and Excel buttons.
4. Transaction limits: set per-user daily transaction limit, per-role max amount. Save shows success message.
5. Announcement broadcast: compose title + message, send to all users / by role. Delivery status shown.

## RISK MANAGER - Fraud Intelligence
1. AI fraud score explanation: for each flagged transaction show reasons (location mismatch, amount anomaly, high velocity, new device) as badges.
2. Fraud case management: statuses open/investigating/closed, assign investigator, add notes timeline.
3. Blacklist: add/remove blocked device IDs and IP addresses, with reason and date.
4. Charts: 7-day fraud trend + NEXT 7 DAYS forecast line chart, risk heatmap by region/city.
5. Bulk actions: select multiple flagged transactions, approve/block with one reason note. Success toast per bulk action.

## SUPPORT AGENT - Customer Care
1. Ticket system: list with priority low/medium/high/urgent, status open/in-progress/resolved, assign to self.
2. KYC queue: show pending KYC with document info, approve/reject with reason. Rejected sends message to customer.
3. Customer 360 view: one screen with profile, recent transactions, open tickets, KYC status.
4. Canned responses: template dropdown to insert into ticket reply.
5. Escalate button: escalate ticket to Risk Manager with note.

## CUSTOMER - Digital Banking
1. Beneficiary management: add/delete/edit saved beneficiaries (name, account no, bank). Success toast on each.
2. Scheduled transfers: schedule one-time future transfer + recurring (daily/weekly/monthly) transfer setup, list with cancel option.
3. PDF statement: date range picker, download PDF of transactions in range.
4. Spending analytics: pie/bar chart by category (food, travel, bills, shopping, other).
5. Card management: virtual card view, block/unblock toggle, set spending limit.
6. Notification center: list of all notifications, preferences for email/SMS/push toggles.

## COMMON (all dashboards)
- Theme toggle dark/light on every page (dark=black bg white text, light=white bg black text).
- Header shows date DD.MM.YYYY and time HH.MM.SS AM/PM updating every second (use client/src/utils/formatDate.js).
- Green/blue success toast on EVERY action (approve, reject, add, edit, update, delete, transfer, resolve). Never orange.
- 6 separate single-digit OTP boxes, 3-minute countdown, resend at 0.
- Login page default, login<->register links, only registered emails login.
- Fully responsive: mobile, tablet, desktop 100% viewport.
