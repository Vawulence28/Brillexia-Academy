-- 012_student_portal_enhancements.sql
-- Ensure quiz questions and attempts tables exist for secure backend validation
CREATE TABLE IF NOT EXISTS ba_quizzes (
    quiz_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES ba_courses(course_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    time_limit_minutes INT DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ba_quiz_questions (
    question_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES ba_quizzes(quiz_id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of choices
    correct_option INT NOT NULL, -- Index of correct choice
    points INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS ba_quiz_attempts (
    attempt_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES ba_quizzes(quiz_id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES ba_students(student_id) ON DELETE CASCADE,
    score NUMERIC(5, 2),
    total_points INT,
    answers JSONB,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ba_quiz_attempts_student ON ba_quiz_attempts(student_id, quiz_id);
