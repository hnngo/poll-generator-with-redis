const acLog = require('../utils/acLog');
const _ = require('lodash');
const redis = require('redis');
const { redisClient } = require('./redis/redisClient');

module.exports = (server) => {
  const io = require('socket.io').listen(server);
  const connections = [];

  // Subscribe channel
  const subscriber = redis.createClient();
  subscriber.subscribe("update-score");

  subscriber.on("message", async (channel, message) => {
    if (!message.startsWith("poll-")) {
      return;
    }

    const redisPollName = message;
    const pollid = redisPollName.split("poll-")[1];
    const res = await redisClient.zrangeAsync([redisPollName, 0, -1, "WITHSCORES"]);

    // Get all the connections that subscribe this pollId
    const receiverCons = connections.filter((c) => c.subscribedPolls.includes(pollid));

    receiverCons.forEach((c) => {
      c.socketInfo.emit("update-poll", { pollid, res })
    })
  });

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
      socket.disconnect(true);
    });
  });
};
