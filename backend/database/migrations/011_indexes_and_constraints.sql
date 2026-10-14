-- 011_indexes_and_constraints.sql
CREATE INDEX IF NOT EXISTS idx_ba_users_email ON ba_users(email);
CREATE INDEX IF NOT EXISTS idx_ba_users_role ON ba_users(role);
CREATE INDEX IF NOT EXISTS idx_ba_lessons_student ON ba_lessons(student_id);
CREATE INDEX IF NOT EXISTS idx_ba_lessons_instructor ON ba_lessons(instructor_id);
CREATE INDEX IF NOT EXISTS idx_ba_lessons_scheduled_start ON ba_lessons(scheduled_start);
CREATE INDEX IF NOT EXISTS idx_ba_notifications_user ON ba_notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_ba_audit_logs_user ON ba_audit_logs(user_id);
