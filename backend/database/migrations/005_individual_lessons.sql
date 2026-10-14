-- 005_individual_lessons.sql
-- STRICT 1-ON-1 RULE ENFORCED: Exactly 1 student_id and 1 instructor_id per lesson.
CREATE TABLE IF NOT EXISTS ba_lessons (
    lesson_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES ba_students(student_id) ON DELETE CASCADE,
    instructor_id UUID NOT NULL REFERENCES ba_instructors(instructor_id) ON DELETE CASCADE,
    course_id UUID REFERENCES ba_courses(course_id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    scheduled_start TIMESTAMP WITH TIME ZONE NOT NULL,
    scheduled_end TIMESTAMP WITH TIME ZONE NOT NULL,
    meeting_provider ba_meeting_provider DEFAULT 'GOOGLE_MEET',
    meeting_url TEXT,
    meeting_id VARCHAR(100),
    status ba_lesson_status DEFAULT 'SCHEDULED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_lesson_duration CHECK (scheduled_end > scheduled_start)
);
