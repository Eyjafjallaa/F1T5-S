var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/posts', function(req, res, next) {
  res.status(200).json({
    id : "1",
    title : "제목",
    tag : "#태그",
    userid : "userid",
    nickname : "nickname",
    price : "3000",
    timestamp : "2021-03-31 17:30:36",
    attachment : [
      "대충URL1", "대충URL2", "대충URL3", 
    ]
  });
});

router.post('/posts', function(req, res, next) {
  res.status(200).json({});
});

router.get('/posts/:postid', function(req, res, next) {
  res.status(200).json([
    {
      id : "1",
      title : "제목",
      tag : "#태그1 #태그2",
      userid : "userid",
      nickname : "nickname",
      price : "3000",
      timestamp : "2021-03-31 17:30:36"
    },
    {
      id : "2",
      title : "제목2",
      tag : "#태그1 #태그2",
      userid : "userid2",
      nickname : "nickname2",
      price : "4000",
      timestamp : "2021-03-31 17:30:37"
    }
  ]);
});

router.put('/posts/:postid', function(req, res, next) {
  res.status(200).json({});
});

router.post('/posts/:postid/req', function(req, res, next) {
  res.status(200).json({});
});



module.exports = router;
