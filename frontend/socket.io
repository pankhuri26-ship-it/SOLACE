// Add this at the top of your script section
const socket = io(); 

// 1. Send SOS when hold is complete
function triggerEmergency(type) {
    const note = document.getElementById('incidentNote').value;
    const stress = currentStress; // From your biometric logic

    socket.emit('broadcast_sos', {
        type: type,
        note: note,
        stressLevel: stress,
        location: { lat: 26.9124, long: 75.7873 } // Hardcoded for demo
    });
    
    // Switch UI to responder mode
    goToResponder();
    updateRelayLog("Initial signal broadcasted...", "SIG_SENT");
}

// 2. Listen for Mesh Updates
socket.on('incident_update', (data) => {
    // Update Trust Bar
    const bar = document.getElementById('verificationBar');
    const text = document.getElementById('verificationPercent');
    bar.style.width = data.verification + '%';
    text.innerText = data.verification + '% Verified';
    
    // Update Logs
    updateRelayLog(data.log, data.tech);
    
    // Visual Node Activation on Map
    if(data.verification > 20) activateNode('node1', 'line1');
    if(data.verification > 40) activateNode('node2', 'line2');
    if(data.verification > 60) activateNode('node3', 'line3');
});

// 3. Listen for Dispatch
socket.on('dispatch_assigned', (data) => {
    document.getElementById('dispatchDetails').classList.remove('hidden');
    document.getElementById('vehicleName').innerText = data.vehicle;
    document.getElementById('etaCountdown').innerText = data.eta;
    document.getElementById('vehiclePlate').innerText = data.plate;
    updateRelayLog("Dispatch Unit En-Route", "UNIT_DISPATCHED");
});

function updateRelayLog(simple, tech) {
    const logs = document.getElementById('relayLogs');
    const entry = document.createElement('div');
    entry.className = 'relay-log-item';
    entry.innerHTML = `<span class="log-simple">${simple}</span><span class="log-tech">${tech}</span>`;
    logs.prepend(entry);
}

function activateNode(nodeId, lineId) {
    document.getElementById(nodeId).classList.replace('opacity-20', 'opacity-100');
    document.getElementById(lineId).classList.replace('opacity-0', 'opacity-100');
}