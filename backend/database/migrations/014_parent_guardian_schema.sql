-- 014_parent_guardian_schema.sql
CREATE TABLE IF NOT EXISTS ba_parents (
    parent_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES ba_users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ba_parent_students (
    relationship_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID NOT NULL REFERENCES ba_parents(parent_id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES ba_students(student_id) ON DELETE CASCADE,
    verified BOOLEAN DEFAULT TRUE,
    linked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_parent_student UNIQUE (parent_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_ba_parent_students_parent ON ba_parent_students(parent_id);
CREATE INDEX IF NOT EXISTS idx_ba_parent_students_student ON ba_parent_students(student_id);
