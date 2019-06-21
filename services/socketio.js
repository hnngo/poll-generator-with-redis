module.exports = (server) => {
  const io = require('socket.io').listen(server);

  const connections = [];
  io.sockets.on('connection', (socket) => {
    // Save the socket info
    connections.push(socket);
    console.log("Total Connections:", connections.length);

    socket.on('disconnect', () => {
      connections.splice(connections.indexOf(socket), 1);
      console.log("Total Connections:", connections.length);
    })
  });
};
