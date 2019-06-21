const express = require('express');
const router = express.Router();
const redis = require('redis')

//  @METHOD   POST
//  @PATH     /polling/start      
//  @DESC     Start the polling with predefined setting
router.post('/start', (req, res) => {
  console.log(req.body);
  const { client } = res.locals;

  var args = [ 'myzset', 1, 'one', 2, 'two', 3, 'three', 99, 'ninety-nine' ];
  client.zadd(args, function (err, response) {
      if (err) throw err;
      console.log('added '+response+' items.');
   
      // -Infinity and +Infinity also work
      var args1 = [ 'myzset', '+inf', '-inf' ];
      client.zrevrangebyscore(args1, function (err, response) {
          if (err) throw err;
          console.log('example1', response);
          // write your code here
      });
   
      var max = 3, min = 1, offset = 1, count = 2;
      var args2 = [ 'myzset', max, min, 'WITHSCORES', 'LIMIT', offset, count ];
      client.zrevrangebyscore(args2, function (err, response) {
          if (err) throw err;
          console.log('example2', response);
          // write your code here
      });
  });
})

module.exports = router;