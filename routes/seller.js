var express = require('express');
var router = express.Router();

router.get('/seller/:userid', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/seller/:userid', function(req, res, next) {
    res.send('respond with a resource');
  });

router.get('/seller/:userid/selling', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/seller/:userid/selled', function(req, res, next) {
    res.send('respond with a resource');
  });

module.exports = router;
