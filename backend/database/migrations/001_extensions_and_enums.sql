-- 001_extensions_and_enums.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ BEGIN
    CREATE TYPE ba_user_role AS ENUM ('ADMIN', 'INSTRUCTOR', 'STUDENT', 'PARENT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ba_lesson_status AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'MISSED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ba_meeting_provider AS ENUM ('GOOGLE_MEET', 'ZOOM', 'MANUAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;