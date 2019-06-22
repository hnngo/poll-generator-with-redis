const proxy = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(proxy([
    '/polling'
  ], { target: 'http://localhost:5000' }));
};
