-- 008_results_progress_certificates.sql
CREATE TABLE IF NOT EXISTS ba_lesson_reports (
    report_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID UNIQUE NOT NULL REFERENCES ba_lessons(lesson_id) ON DELETE CASCADE,
    instructor_id UUID NOT NULL REFERENCES ba_instructors(instructor_id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES ba_students(student_id) ON DELETE CASCADE,
    summary TEXT NOT NULL,
    comprehension_rating INT CHECK (comprehension_rating BETWEEN 1 AND 5),
    homework_assigned TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ba_certificates (
    certificate_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES ba_students(student_id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES ba_courses(course_id) ON DELETE CASCADE,
    certificate_code VARCHAR(100) UNIQUE NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    pdf_url TEXT
);
