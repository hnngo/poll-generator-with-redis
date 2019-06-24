const proxy = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(proxy([
    '/polling',
    '/user'
  ], { target: 'http://localhost:5000' }));
};
