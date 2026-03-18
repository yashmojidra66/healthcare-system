# Modern Medicare System

## Demo Credentials

| Role    | Email               | Password | Name            | Notes                        |
|---------|---------------------|----------|-----------------|------------------------------|
| Patient | user@health.com     | pass1234 | Alex Johnson    | Full patient portal access   |
| Doctor  | doctor@health.com   | pass1234 | Dr. Sarah Mitchell | General Physician, active |
| Admin   | admin@health.com    | pass1234 | Admin User      | Full admin panel access      |

## Extra Doctor Accounts

| Name              | Email              | Password | Specialty       |
|-------------------|--------------------|----------|-----------------|
| Dr. James Carter  | james@health.com   | pass1234 | Cardiologist    |
| Dr. Emily Chen    | emily@health.com   | pass1234 | Nutritionist    |
| Dr. Robert Kim    | robert@health.com  | pass1234 | Psychiatrist    |

## Setup

```bash
# Backend
cd backend
npm install
npx ts-node src/seed.ts   # seed MongoDB
npm run dev               # runs on port 5000

# Frontend
cd frontend
npm install
ng serve                  # runs on port 4200
```

## MongoDB
- URI: `mongodb://localhost:27017/healthcare2`
- Re-seed anytime: `npx ts-node src/seed.ts` from `backend/`
