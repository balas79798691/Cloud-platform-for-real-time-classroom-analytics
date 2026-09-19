INSERT INTO students
(name, email, attendance_percent, engagement_score, assignments_completed)
VALUES
('Aarav Kumar', 'aarav@example.com', 94, 88, 9),
('Diya Sharma', 'diya@example.com', 91, 92, 10),
('Rohan Patel', 'rohan@example.com', 82, 74, 7),
('Ananya Rao', 'ananya@example.com', 97, 95, 10),
('Vikram Singh', 'vikram@example.com', 76, 68, 6),
('Meera Iyer', 'meera@example.com', 89, 84, 8)
ON CONFLICT (email) DO NOTHING;

INSERT INTO classroom_activity (student_id, activity_type, value)
SELECT id, 'engagement', engagement_score FROM students
ON CONFLICT DO NOTHING;
