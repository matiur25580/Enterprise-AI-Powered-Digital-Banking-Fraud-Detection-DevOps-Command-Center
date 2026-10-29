# TrustShield Enterprise Features - Copilot Prompt (sob eksathe)

Wrap the root App component with ThemeProvider from client/src/context/ThemeContext.jsx. Add a theme toggle button (dark/light) on Login, Register, ForgotPassword pages and on all 4 dashboards (Admin, Risk Manager, Support Agent, Customer). Dark mode: black background with white text. Light mode: white background with black text.

In every dashboard header, import formatDateDDMMYYYY and formatTimeHHMMSS from client/src/utils/formatDate.js and display current date as DD.MM.YYYY and time as HH.MM.SS AM/PM, updating every second.

Add a green/blue success toast message for every action across all dashboards: approve, reject, block, unblock, freeze, unfreeze, add, edit, update, delete, transfer, ticket resolve, KYC approve/reject. Never use orange for success.

Ensure registration and forgot-password use 6 separate single-digit OTP boxes with 3-minute countdown, resend button appears at 0 seconds. Login page shows by default until manual login, login and register pages link to each other, only registered emails can login.
