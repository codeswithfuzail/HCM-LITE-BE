# HCM Lite web app

## Run locally

1. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL=http://localhost:4000/api` (or your running backend URL).
2. Run `npm install` and `npm run dev`.
3. Open the Vite URL shown in the terminal. Start the backend separately.

For a deployed frontend, set `VITE_API_BASE_URL` to the backend's complete public URL ending in `/api`, then redeploy. A Vite environment variable is compiled into the frontend at build time, so changing it requires a new frontend deployment.

## Role workflows

- **Admin:** organization and HR account settings, employee directory/import, attendance review, leave decisions, payroll draft/finalization, analytics, announcements, AI assistant, and audit history.
- **HR:** employee records, attendance and correction review, leave approvals, payroll preparation, analytics, announcements, and AI assistant.
- **Employee:** personal attendance and corrections, leave balance/request/cancellation, payslips, profile, announcements, notifications, and AI assistant.

Protected operations are also checked by the API; hiding a link in the UI is not the security boundary. AI features require backend provider configuration. The first signed-in use of a temporary account requires a password update.

## Build check

Run `npm run build`. The UI expects the backend API groups documented in `../backend/README.md`.
