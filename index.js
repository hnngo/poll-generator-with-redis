const express = require("express");
const session = require("express-session");
const pollRoutes = require('./routes/pollRoutes');
const userRoutes = require('./routes/userRoutes');
const keys = require('./config/keys');
const redisStore = require('connect-redis')(session);
const acLog = require('./utils/acLog');
require('./models/postgres');

// Create express app
const app = express();
const server = require('http').createServer(app);

// Redis connection init
const { redisClient } = require('./services/redis/redisClient');

// Socketio connection init
require('./services/socketio')(server);

// Express middlewares
app.use(session({
  secret: keys.sessionKey,
  name: '_redisStore',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
  store: new redisStore({
    host: 'localhost',
    port: 6379,
    client: redisClient,
    ttl: 6 * 60 * 60
  })
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Express init routes
const redisAttach = (req, res, next) => {
  // Passing redis client through middlewares
  res.locals.redisClient = redisClient;
  next();
}
app.use('/pollser', pollRoutes);
app.use('/user', redisAttach, userRoutes);

// App listen to a port
const port = process.env.PORT || 5000;
server.listen(port, () => {
  acLog(`Node app listening on http://localhost:${port}`);
});
