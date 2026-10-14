-- 007_learning_materials_assignments_quizzes.sql
CREATE TABLE IF NOT EXISTS ba_materials (
    material_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES ba_courses(course_id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES ba_lessons(lesson_id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50),
    uploaded_by UUID REFERENCES ba_users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ba_assignments (
    assignment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES ba_lessons(lesson_id) ON DELETE CASCADE,
    course_id UUID REFERENCES ba_courses(course_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    instructions TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ba_submissions (
    submission_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL REFERENCES ba_assignments(assignment_id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES ba_students(student_id) ON DELETE CASCADE,
    file_url TEXT,
    student_comment TEXT,
    grade NUMERIC(5, 2),
    instructor_feedback TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    graded_at TIMESTAMP WITH TIME ZONE
);
