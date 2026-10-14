const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const errorHandler = require('./middleware/error.middleware');

const authRoutes = require('./modules/auth/auth.routes');
const adminRoutes = require('./modules/admin/admin.routes');
const studentRoutes = require('./modules/student/student.routes');
const assignmentRoutes = require('./modules/assignments/assignment.routes');
const quizRoutes = require('./modules/quizzes/quiz.routes');
const instructorRoutes = require('./modules/instructor/instructor.routes');
const reportRoutes = require('./modules/reports/report.routes');
const materialRoutes = require('./modules/materials/material.routes');
const attendanceRoutes = require('./modules/attendance/attendance.routes');
const parentRoutes = require('./modules/parent/parent.routes');



const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/student', studentRoutes);
app.use('/api/v1/assignments', assignmentRoutes);
app.use('/api/v1/quizzes', quizRoutes);
app.use('/api/v1/instructor', instructorRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/materials', materialRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/parent', parentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', academy: 'Brillexia Academy LMS', timestamp: new Date() });
});

app.use(errorHandler);

module.exports = app;