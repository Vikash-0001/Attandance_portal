const express = require('express');
const auth = require('../middleware/authMiddleware');
const Course = require('../models/Course');
const User = require('../models/User');
const router = express.Router();

// Create Course (only for teachers/admin)
router.post('/', auth, async (req, res) => {
    const { courseName, courseCode, teacherId } = req.body;
    try {
        let course = new Course({ courseName, courseCode, teacherId });
        await course.save();
        res.json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get Courses for a Teacher or Student
router.get('/', auth, async (req, res) => {
    try {
        let courses;
        if (req.user.role === 'teacher') {
            courses = await Course.find({ teacherId: req.user.id });
        } else if (req.user.role === 'student') {
            courses = await Course.find({ students: req.user.id });
        }
        res.json(courses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
// Get Subjects for a Specific Course
router.get('/:courseId/subjects', auth, async (req, res) => {
    try {
        const { courseId } = req.params;

        // Find the course by ID and populate the subject details
        const course = await Course.findById(courseId).populate('subjects');

        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        res.json(course.subjects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Add Courses to a Teacher's Profile
router.put('/addCourses/:teacherId', auth, async (req, res) => {
    const { teacherId } = req.params;
    const { courseIds } = req.body;

    try {
        // Find the teacher by ID
        const teacher = await User.findById(teacherId);
        if (!teacher || teacher.role !== 'teacher') {
            return res.status(404).json({ msg: 'Teacher not found' });
        }

        // Validate course IDs
        const courses = await Course.find({ _id: { $in: courseIds } });
        if (courses.length !== courseIds.length) {
            return res.status(400).json({ msg: 'One or more course IDs are invalid' });
        }

        // Update the teacher's profile with the new courses
        teacher.profile.courses.push(courseIds);
        await teacher.save();

        // Map teacher to the selected courses
        await Course.updateMany(
            { _id: { $in: courseIds } },
            { $set: { teacherId: teacher._id } }
        );

        res.json({ msg: 'Courses updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get Courses Assigned to a Teacher
router.get('/:teacherId/courses', auth, async (req, res) => {
    const { teacherId } = req.params;

    try {
        // Find the teacher by ID
        const teacher = await User.findById(teacherId).populate('profile.courses');
        if (!teacher || teacher.role !== 'teacher') {
            return res.status(404).json({ msg: 'Teacher not found' });
        }

        res.json(teacher.profile.courses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;
