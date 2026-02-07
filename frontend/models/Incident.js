const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
    incidentId: String,
    senderSocket: String,
    type: String,
    note: String,
    stressLevel: Number,
    lat: Number,
    long: Number,
    verification: Number,
    status: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Incident', incidentSchema);