const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    courseName: { type: String, required: true },
    courseCode: { type: String, required: true, unique: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'subjects' }] // Array of subject references
});

module.exports = mongoose.model('courses', CourseSchema);
