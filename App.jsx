import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const API = 'http://localhost:5000';

export default function App() {
  const [summary, setSummary] = useState(null);
  const [students, setStudents] = useState([]);
  const [activity, setActivity] = useState([]);
  const [live, setLive] = useState(false);

  async function loadData() {
    const [s, st, a] = await Promise.all([
      fetch(`${API}/api/analytics/summary`).then(r => r.json()),
      fetch(`${API}/api/students`).then(r => r.json()),
      fetch(`${API}/api/activity`).then(r => r.json())
    ]);
    setSummary(s);
    setStudents(st);
    setActivity(a);
  }

  useEffect(() => {
    loadData();
    const socket = io(API);
    socket.on('connect', () => setLive(true));
    socket.on('disconnect', () => setLive(false));
    socket.on('classroom_activity', () => loadData());
    return () => socket.disconnect();
  }, []);

  return (
    <div className="app">
      <header>
        <div>
          <p className="eyebrow">CLOUD ANALYTICS PLATFORM</p>
          <h1>ClassroomCloud</h1>
          <p className="subtitle">Real-time classroom performance dashboard</p>
        </div>
        <span className={live ? 'status live' : 'status'}>{live ? '● LIVE' : '○ OFFLINE'}</span>
      </header>

      <main>
        <section className="cards">
          <Metric title="Students" value={summary?.total_students ?? '—'} />
          <Metric title="Avg. Attendance" value={summary ? `${summary.avg_attendance}%` : '—'} />
          <Metric title="Avg. Engagement" value={summary ? `${summary.avg_engagement}%` : '—'} />
          <Metric title="Assignments" value={summary?.assignments_completed ?? '—'} />
        </section>

        <section className="panel">
          <div className="panel-title">
            <h2>Student performance</h2>
            <button onClick={loadData}>Refresh</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Student</th><th>Attendance</th><th>Engagement</th><th>Assignments</th></tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td><Bar value={Number(s.attendance_percent)} /></td>
                    <td><Bar value={Number(s.engagement_score)} /></td>
                    <td>{s.assignments_completed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel">
          <h2>Live activity</h2>
          <div className="activity">
            {activity.map(item => (
              <div className="activity-item" key={item.id}>
                <strong>{item.name}</strong>
                <span>{item.activity_type}: {item.value}</span>
                <small>{new Date(item.recorded_at).toLocaleString()}</small>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function Metric({ title, value }) {
  return <div className="metric"><span>{title}</span><strong>{value}</strong></div>;
}

function Bar({ value }) {
  return (
    <div className="bar-row">
      <div className="bar"><i style={{ width: `${Math.min(value, 100)}%` }} /></div>
      <span>{value}%</span>
    </div>
  );
}
