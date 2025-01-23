const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Store active connections
const clients = [];

wss.on('connection', (ws) => {
  // Push new connection to clients array
  clients.push(ws);

  // Notify clients when a new user connects
  ws.on('message', (message) => {
    // Broadcast the message to all connected clients
    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    // Remove client from array when disconnected
    const index = clients.indexOf(ws);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
});

server.listen(5001, () => {
  console.log('WebSocket server is listening on ws://localhost:5001');
});
