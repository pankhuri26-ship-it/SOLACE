const express = require("express");
const http = require("http");
const cors = require("cors");
const { initSocket } = require("./socket");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use("/api/sos", require("./routes/sos"));

initSocket(server);

const PORT = 5000;
server.listen(PORT, () =>
  console.log(`🚨 Solace backend running on port ${PORT}`)
);