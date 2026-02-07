const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 1. Connect to MongoDB (Replace with your URI)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/solace_db')
    .then(() => console.log("✅ Solace Database Connected"))
    .catch(err => console.error("❌ Connection Error:", err));

// 2. Define Data Models
const AppointmentSchema = new mongoose.Schema({
    name: String,
    email: String,
    service: String,
    date: Date,
    message: String,
    status: { type: String, default: 'Pending' }
});
const Appointment = mongoose.model('Appointment', AppointmentSchema);

// 3. API Routes

// Health Check
app.get('/', (req, res) => res.send('Solace Backend API is Running...'));

// Route: Handle Appointment Bookings
app.post('/api/book-appointment', async (req, res) => {
    try {
        const newAppointment = new Appointment(req.body);
        await newAppointment.save();
        res.status(201).json({ message: "Success! Your appointment is requested.", data: newAppointment });
    } catch (err) {
        res.status(500).json({ error: "Failed to book appointment" });
    }
});

// Route: Get all Appointments (for an Admin Dashboard)
app.get('/api/appointments', async (req, res) => {
    const appointments = await Appointment.find();
    res.json(appointments);
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));