const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['student', 'teacher', 'admin'], required: true },
    profile: {
        name: String,
        age: Number,
        enrollmentYear: Number,
        department: String,
        courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'courses' }], // Array of course references
    },
});

module.exports = mongoose.model('users', UserSchema);
