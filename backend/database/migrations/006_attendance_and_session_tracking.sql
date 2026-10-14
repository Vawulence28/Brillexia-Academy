-- 006_attendance_and_session_tracking.sql
CREATE TABLE IF NOT EXISTS ba_attendance (
    attendance_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID UNIQUE NOT NULL REFERENCES ba_lessons(lesson_id) ON DELETE CASCADE,
    student_present BOOLEAN DEFAULT FALSE,
    instructor_present BOOLEAN DEFAULT FALSE,
    student_joined_at TIMESTAMP WITH TIME ZONE,
    instructor_joined_at TIMESTAMP WITH TIME ZONE,
    scheduled_duration_minutes INT NOT NULL,
    verified_duration_minutes INT DEFAULT 0,
    verification_source ba_meeting_provider DEFAULT 'MANUAL',
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
