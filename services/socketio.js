const acLog = require('../utils/acLog');
const _ = require('lodash');

module.exports = (server) => {
  const io = require('socket.io').listen(server);

  const connections = [];
  io.sockets.on('connection', (socket) => {
    // Init connection obj
    const conObj = {
      socketInfo: socket,
      subscribedPolls: []
    }

    // Save the socket info
    connections.push(conObj);
    const socketIndex = _.findIndex(connections, (c) => c.socketInfo === socket);
    acLog(`Total Connections: ${connections.length}`);

    // Listen to client activities
    socket.on('subscribe poll', (listOfPolls) => {
      connections[socketIndex].subscribedPolls = [...listOfPolls];
    });

    socket.on('disconnect', () => {
      connections.splice(socketIndex, 1);
      acLog(`Total Connections: ${connections.length}`);
    })
  });
};
