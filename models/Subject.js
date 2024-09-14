const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    subjectName: { type: String, required: true },
    subjectCode: { type: String, required: true, unique: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'courses', required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
});

module.exports = mongoose.model('subjects', SubjectSchema);
