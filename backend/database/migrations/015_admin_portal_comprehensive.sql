-- 015_admin_portal_comprehensive.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS ba_audit_logs (
    audit_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_user_id UUID REFERENCES ba_users(user_id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    target_record_id UUID,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ba_audit_logs_actor ON ba_audit_logs(actor_user_id);

-- System Settings Table
CREATE TABLE IF NOT EXISTS ba_system_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO ba_system_settings (setting_key, setting_value, description)
VALUES 
('ACADEMY_NAME', 'Brillexia Academy', 'Official institution name'),
('DEFAULT_LESSON_DURATION_MINS', '60', 'Default 1-on-1 session duration in minutes'),
('ATTENDANCE_GRACE_PERIOD_MINS', '15', 'Grace period before marking late')
ON CONFLICT (setting_key) DO NOTHING;

-- Session Duration Monitoring Table (Admin Only)
CREATE TABLE IF NOT EXISTS ba_session_duration_audit (
    duration_audit_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID UNIQUE NOT NULL REFERENCES ba_lessons(lesson_id) ON DELETE CASCADE,
    scheduled_duration_minutes INT NOT NULL,
    provider_reported_minutes INT DEFAULT 0,
    verified_duration_minutes INT DEFAULT 0,
    verification_status VARCHAR(50) DEFAULT 'PENDING',
    discrepancy_reason TEXT,
    adjusted_by UUID REFERENCES ba_users(user_id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ba_session_duration_lesson ON ba_session_duration_audit(lesson_id);
