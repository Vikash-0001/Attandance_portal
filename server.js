const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Connect to Database
mongoose.connect('mongodb+srv://bijaykumarg1490:KErI5RRBXL3jbzY6@cluster0.cykfi.mongodb.net/VSBM?retryWrites=true&w=majority&appName=Cluster0').then(()=> console.log('connected')).catch((err)=>{console.log('Error',err)});

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/seatBooking', require('./routes/seatBooking'));
app.use('/api/subject', require('./routes/subjects'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
