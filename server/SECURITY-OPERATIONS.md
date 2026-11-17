# TrustShield Security Operations

## Required production environment

Configure these values in the backend hosting provider before deploying:

- `MONGO_URI`: production MongoDB connection string.
- `JWT_SECRET`: a unique random value of at least 32 characters. Generate one with:
  `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`
- `CLIENT_URL`: exact frontend origin(s), comma-separated. Do not use a wildcard.

The API refuses to start when the JWT secret or MongoDB connection is missing. Existing access tokens are incompatible with the current token-version claim; users must sign in again. Access tokens expire after one hour. Logout and logout-all increment the user's token version and revoke all currently issued access tokens.

## Legacy password migration

The earlier application stored some passwords as plaintext. Before deploying this version:

1. Take and verify a restorable production database backup.
2. Set `MONGO_URI` in a trusted shell.
3. From the `server` directory run `npm run migrate:passwords` first. This is a read-only dry run and reports candidate counts only.
4. Only after independently verifying that the backup can be restored, run `CONFIRM_PRODUCTION_BACKUP=YES CONFIRM_RESTORE_TEST=YES npm run migrate:passwords -- --apply` from a trusted shell. On PowerShell, set the two environment variables for that shell before running the command.
5. Confirm the migrated/skipped counts and test known accounts without exposing credentials in logs. The script uses compare-and-set updates so it does not overwrite a password changed concurrently.
6. Keep the backup until login checks are complete.

Login no longer accepts plaintext passwords or silently upgrades them. Accounts with legacy plaintext credentials cannot sign in until the migration is completed. If any account uses an Argon2 hash, do not run a blind hash conversion; add an Argon2 verification migration or perform a verified password reset first.

## Initial administrator provisioning

Public registration creates Customer accounts only. To provision the first administrator, set `MONGO_URI`, `BOOTSTRAP_ADMIN_EMAIL`, and `BOOTSTRAP_ADMIN_PASSWORD` (at least 16 characters) temporarily in a trusted shell, then run `npm run create:admin` from the `server` directory. Remove the temporary bootstrap variables immediately afterward. Never expose this operation through a public API.

## Current functional limitations — not production banking

- Password recovery, email OTP, two-factor authentication and refresh-token rotation/replay detection are not implemented. The old placeholder 2FA and OTP endpoints are disabled.
- Login and registration use an in-process rate limiter. Replace it with a shared Redis-backed limiter before running multiple API instances.
- Customer balance, transfers, bills, cards and fixed deposits in the current UI are demonstration-only local state. No real funds are moved.
- The API transfer endpoint only records a review request; it does not execute a financial transfer.
- KYC, loans, disputes, scheduled payments, deposits, staff, branches, audit, compliance, analytics, alerts, chatbot and settlement placeholder endpoints return HTTP 501 until they have persistent storage, ownership checks and tests.
- Statement PDF generation is not implemented and returns HTTP 501.
- FX conversion uses static demonstration rates and is not a live quote.
- Authentication and role gates are a security baseline, not a complete banking authorization model. Independent security review, resource-level authorization, monitoring, backup/restore drills and regulatory review are required before production use.
