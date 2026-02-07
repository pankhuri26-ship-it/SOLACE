async function triggerSOS() {
  const res = await fetch("http://localhost:5000/api/sos/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      emergencyType: selectedEmergency,
      protocol: currentProtocol,
      note: document.getElementById("incidentNote").value,
      isVoice: isVoiceMode
    })
  });

  const session = await res.json();
  window.currentSosId = session.id;

  socket.emit("join-sos", session.id);
  socket.emit("start-verification", session.id);
}