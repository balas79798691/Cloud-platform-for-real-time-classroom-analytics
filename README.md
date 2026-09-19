# ClassroomCloud Analytics

A cloud-ready real-time classroom analytics platform.

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express + Socket.IO
- Database: PostgreSQL
- Real-time updates: WebSockets via Socket.IO
- Containerization: Docker Compose

## Features
- Live classroom attendance dashboard
- Student engagement metrics
- Attendance percentage
- Average engagement score
- Assignment completion
- Real-time event feed
- REST API + WebSocket updates
- PostgreSQL schema and seed data

## Run locally

### 1. Start PostgreSQL
```bash
docker compose up -d db
```

### 2. Backend
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:5000

## API
- GET `/api/analytics/summary`
- GET `/api/students`
- GET `/api/activity`
- POST `/api/activity`

The database schema and sample data are in `database/schema.sql` and `database/seed.sql`.
