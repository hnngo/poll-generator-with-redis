const acLog = require('../utils/acLog');

module.exports = (server) => {
  const io = require('socket.io').listen(server);

  const connections = [];
  io.sockets.on('connection', (socket) => {
    // Save the socket info
    connections.push(socket);
    acLog(`Total Connections: ${connections.length}`);

    socket.on('disconnect', () => {
      connections.splice(connections.indexOf(socket), 1);
      acLog(`Total Connections: ${connections.length}`);
    })
  });
};
