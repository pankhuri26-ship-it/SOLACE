
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve the static frontend file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'front.html'));
});

// Storage for active incidents and connected nodes
let activeIncidents = {};
let connectedNodes = {};

io.on('connection', (socket) => {
    console.log(`Node Connected: ${socket.id}`);
    
    // Register node data (simulating GPS/Biometrics)
    socket.on('register_node', (data) => {
        connectedNodes[socket.id] = {
            id: socket.id,
            lat: data.lat || 26.9124,
            long: data.long || 75.7873,
            trustScore: 100
        };
    });
            
    // Handle SOS Broadcast
    socket.on('broadcast_sos', (sosData) => {
        const incidentId = `INC-${Date.now()}`;
        const newIncident = {
            id: incidentId,
            senderId: socket.id,
            type: sosData.type,
            note: sosData.note,
            stressLevel: sosData.stressLevel || 0,
            timestamp: new Date(),
            verification: 0,
            status: 'Relaying'
        };

        activeIncidents[incidentId] = newIncident;

        // Relay to all other connected peers in the mesh
        socket.broadcast.emit('mesh_relay_received', newIncident);
        
        // Return confirmation to sender
        socket.emit('sos_confirmed', { incidentId, status: 'Active' });

        // Simulate mesh verification (Neighbors confirming)
        simulateMeshVerification(incidentId);
    });

    socket.on('disconnect', () => {
        delete connectedNodes[socket.id];
        console.log(`Node Disconnected: ${socket.id}`);
    });
});

// Logic to simulate neighbors verifying the incident
function simulateMeshVerification(id) {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 85) progress = 88; // Max trust cap

        io.emit('incident_update', {
            id: id,
            verification: progress,
            log: progress > 50 ? "High neighbor consensus reached" : "Relaying via Peer_Node_04",
            tech: progress > 50 ? "MESH_TRUST_VERIFIED" : "HOP_COUNT_INCREMENT"
        });

        if (progress >= 88) {
            clearInterval(interval);
            // Simulate Dispatch Assigned
            io.emit('dispatch_assigned', {
                id: id,
                vehicle: "Alpha-1 Emergency Unit",
                eta: "04:20",
                plate: "MESH-09-RJ"
            });
        }
    }, 2000);
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`SOLACE MESH SERVER RUNNING ON PORT ${PORT}`);
    console.log(`Offline access enabled via local network IP.`);
});
