const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'courses', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    subjectId: {type: mongoose.Schema.Types.ObjectId, ref: 'subjects',required:true},
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent'], required: true },
});

module.exports = mongoose.model('attendances', AttendanceSchema);
