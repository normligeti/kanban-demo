function createWsHub(server) {
  const WebSocket = require('ws');
  const wsServer = new WebSocket.Server({ server, path: '/ws' });

  function broadcast(payload) {
    const message = JSON.stringify(payload);
    wsServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  wsServer.on('connection', (socket) => {
    socket.send(
      JSON.stringify({
        type: 'connected',
        message: 'WebSocket connection established'
      })
    );
  });

  return { broadcast };
}

module.exports = { createWsHub };
