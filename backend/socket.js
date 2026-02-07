const { Server } = require("socket.io");
const { sosSessions } = require("./store");

function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: "*" }
  });

  io.on("connection", socket => {
    console.log("🔗 Client connected");

    socket.on("join-sos", sosId => {
      socket.join(sosId);
    });

    socket.on("start-verification", sosId => {
      const session = sosSessions.get(sosId);
      if (!session) return;

      session.status = "verifying";

      let score = 0;
      const interval = setInterval(() => {
        score += Math.floor(Math.random() * 25);
        if (score > 100) score = 100;

        session.trustScore = score;

        io.to(sosId).emit("verification-update", {
          trustScore: score
        });

        if (score >= 70) {
          session.status = "dispatched";
          io.to(sosId).emit("dispatch-confirmed", {
            vehicle: session.emergencyType
          });
          clearInterval(interval);
        }
      }, 1500);
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected");
    });
  });
}

module.exports = { initSocket };