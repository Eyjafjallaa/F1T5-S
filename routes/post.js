var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/posts', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/posts', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/posts/:postid', function(req, res, next) {
  res.send('respond with a resource');
});

router.put('/posts/:postid', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/posts/:postid/req', function(req, res, next) {
  res.send('respond with a resource');
});



module.exports = router;
