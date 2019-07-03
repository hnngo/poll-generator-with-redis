const acLog = require('../utils/acLog');
const _ = require('lodash');
const redis = require('redis');
// const { redisClient } = require('./redis/redisClient');

module.exports = (server) => {
  const io = require('socket.io').listen(server);
  
  // Subscribe channel
  const redisClient = redis.createClient();
  redisClient.subscribe("update-score");
  redisClient.on("message", (channel, message) => {
    console.log("Message '" + message + "' on channel '" + channel + "' arrived!")
  });

  const connections = [];
  io.sockets.on('connection', async (socket) => {
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
    });


  });
};
