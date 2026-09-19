import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const { Pool } = pg;
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173'
  }
});

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/classroom_analytics'
});

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'classroom-cloud-analytics' });
});

app.get('/api/students', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM students ORDER BY id`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/summary', async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        COUNT(*)::int AS total_students,
        ROUND(AVG(attendance_percent), 1) AS avg_attendance,
        ROUND(AVG(engagement_score), 1) AS avg_engagement,
        COALESCE(SUM(assignments_completed), 0)::int AS assignments_completed
      FROM students
    `);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/activity', async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT a.id, s.name, a.activity_type, a.value, a.recorded_at
      FROM classroom_activity a
      JOIN students s ON s.id = a.student_id
      ORDER BY a.recorded_at DESC
      LIMIT 20
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/activity', async (req, res) => {
  try {
    const { student_id, activity_type, value } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO classroom_activity
       (student_id, activity_type, value)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [student_id, activity_type, value]
    );

    io.emit('classroom_activity', rows[0]);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
});

const port = process.env.PORT || 5000;

httpServer.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
