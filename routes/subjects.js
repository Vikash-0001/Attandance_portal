const express = require('express');
const auth = require('../middleware/authMiddleware');
const Subject = require('../models/Subject');
const Course = require('../models/Course');
const router = express.Router();

// Add a Subject to a Course
router.post('/add', auth, async (req, res) => {
    const { subjectName, subjectCode, courseId, teacherId } = req.body;

    try {
        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        // Create new subject
        let subject = new Subject({
            subjectName,
            subjectCode,
            courseId,
            teacherId
        });

        // Save the subject
        subject = await subject.save();

        // Add subject to the course
        course.subjects.push(subject._id);
        await course.save();

        res.json(subject);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
