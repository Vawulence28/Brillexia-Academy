-- 013_instructor_portal_enhancements.sql
-- Ensure lesson reports support comprehensive feedback and topics
CREATE TABLE IF NOT EXISTS ba_lesson_reports_extended (
    report_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID UNIQUE NOT NULL REFERENCES ba_lessons(lesson_id) ON DELETE CASCADE,
    instructor_id UUID NOT NULL REFERENCES ba_instructors(instructor_id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES ba_students(student_id) ON DELETE CASCADE,
    topic_covered VARCHAR(255) NOT NULL,
    learning_objectives TEXT,
    activities_completed TEXT,
    comprehension_rating INT CHECK (comprehension_rating BETWEEN 1 AND 5),
    challenges_encountered TEXT,
    homework_assigned TEXT,
    instructor_remarks TEXT,
    status VARCHAR(50) DEFAULT 'SUBMITTED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ba_lesson_reports_instructor ON ba_lesson_reports_extended(instructor_id);
CREATE INDEX IF NOT EXISTS idx_ba_lesson_reports_student ON ba_lesson_reports_extended(student_id);
