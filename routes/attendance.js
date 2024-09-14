const express = require('express');
const auth = require('../middleware/authMiddleware');
const Attendance = require('../models/Attendance');
const Course = require('../models/Course');
const router = express.Router();

// Get Students Enrolled in a Specific Course (Teacher/Admin Only)
router.get('/:courseId/students', auth, async (req, res) => {
    try {
        const { courseId } = req.params;

        // Find the course by ID and populate the student details
        const course = await Course.findById(courseId).populate('students', 'username email profile');

        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        // Check if the requesting user is the teacher for this course
        if (req.user.role === 'teacher' && !course.teacherId.equals(req.user.id)) {
            return res.status(403).json({ msg: 'Not authorized to view students for this course' });
        }

        res.json(course.students);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Mark Attendance for a Specific Subject (Teacher Only)
router.post('/mark', auth, async (req, res) => {
    const { courseId, subjectId, studentId, date, status } = req.body;

    try {
        // Check if the subject belongs to the course
        const course = await Course.findById(courseId).populate('subjects');
        if (!course.subjects.map(subject => subject._id.toString()).includes(subjectId)) {
            return res.status(400).json({ msg: 'Subject not part of this course' });
        }

        // Check if the student is enrolled in the course
        if (!course.students.includes(studentId)) {
            return res.status(400).json({ msg: 'Student not enrolled in this course' });
        }

        let attendance = new Attendance({ courseId, subjectId, studentId, date, status });
        await attendance.save();
        res.json(attendance);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get Attendance for a Student in a Specific Subject
router.get('/:studentId/:courseId/:subjectId', auth, async (req, res) => {
    try {
        const { studentId, courseId, subjectId } = req.params;
        const attendance = await Attendance.find({ studentId, courseId, subjectId }).populate('studentId courseId subjectId');
        res.json(attendance);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get Attendance for a Student in a Specific Course
router.get('/:studentId/:courseId', auth, async (req, res) => {
    try {
        const { studentId, courseId } = req.params;
        const attendance = await Attendance.find({ studentId, courseId });
        res.json(attendance);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
