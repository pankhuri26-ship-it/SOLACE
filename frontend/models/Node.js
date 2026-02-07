const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
    socketId: String,
    lat: Number,
    long: Number,
    trustScore: Number,
    lastSeen: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Node', nodeSchema);