# Local Testing

The frontend on port 3000 is now configured to use a local backend by default.

## Current local URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api
- Backend files/images: http://localhost:8000

## Important
- Running the Next.js app on port 3000 does not test backend authorization by itself.
- To test the new behavior/report permissions locally, a local backend must be running on port 8000 with the updated PHP route/controller files.
- If no backend is running on port 8000, the frontend will fail locally instead of calling the live website. That is intentional.

## Start frontend
```powershell
cd c:\Windows-\Osteps-main\Osteps
npm run dev
```

## Local env file
This repo now includes:
- [.env.local](.env.local)

Change it only if your local backend uses another port.
