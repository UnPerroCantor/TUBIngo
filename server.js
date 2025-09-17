const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let disponibles = Array.from({ length: 75 }, (_, i) => i + 1);
let historial = [];

// Cuando alguien se conecta
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  // Enviar historial actual al que entra
  socket.emit("historial", historial);

  // Moderador saca número
  socket.on("sacarNumero", () => {
    if (disponibles.length === 0) return;

    const index = Math.floor(Math.random() * disponibles.length);
    const numero = disponibles.splice(index, 1)[0];
    historial.push(numero);

    // Avisar a todos los clientes
    io.emit("nuevoNumero", numero);
  });
});

server.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
