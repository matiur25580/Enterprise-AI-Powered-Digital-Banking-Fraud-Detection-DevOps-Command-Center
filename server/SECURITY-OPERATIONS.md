# TrustShield Security Operations

## Required production environment

Configure these values in the backend hosting provider before deploying:

- `MONGO_URI`: production MongoDB connection string.
- `JWT_SECRET`: a unique random value of at least 32 characters. Generate one with:
  `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`
- `CLIENT_URL`: exact frontend origin(s), comma-separated. Do not use a wildcard.

The API intentionally refuses to start when the JWT secret or MongoDB connection is missing. Existing access tokens are not compatible with the new JWT session format; users must sign in again.

## Legacy password migration

The previous application stored passwords as plaintext. Before treating the deployment as production-ready, run the one-time migration against a verified database backup:

1. Set `MONGO_URI` in the server environment.
2. From the `server` directory run `npm run migrate:passwords`.
3. Confirm the command reports the number migrated and skipped.
4. Keep the database backup until login checks have been completed.

The login endpoint also upgrades an individual legacy password after successful authentication, but that is not a substitute for the bulk migration.

## Initial administrator provisioning

Public registration creates Customer accounts only. To provision the first administrator, set `MONGO_URI`, `BOOTSTRAP_ADMIN_EMAIL`, and `BOOTSTRAP_ADMIN_PASSWORD` (at least 16 characters) temporarily in a trusted shell, then run `npm run create:admin` from the `server` directory. Remove the temporary bootstrap variables immediately afterward. Never expose this operation through a public API.

## Current functional limitations

- Password recovery and email OTP verification are intentionally unavailable until a complete hashed, expiring, rate-limited OTP workflow is implemented.
- Customer balance, transfers, bills, cards, and fixed deposits in the current UI are demonstration-only local state. No real funds are moved.
- The API transfer endpoint records a review request only; it does not execute a financial transfer.
- Statement PDF generation is not implemented and returns HTTP 501.
- Authentication and basic role gates are a security baseline, not a complete banking authorization model. Each remaining resource route still needs ownership and field-level authorization tests before production use.
