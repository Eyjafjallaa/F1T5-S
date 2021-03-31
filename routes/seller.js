var express = require('express');
var router = express.Router();

router.get('/seller/:userid', function(req, res, next) {
    res.status(200).json({
      nickname:"nicname",
      schoolname:"dgswhs",
      prifilepicture:"대충사진URL"
    })
});

router.get('/seller/:userid/selling', function(req, res, next) {
  res.status(200).json([
   {
    id : "1",
    title : "post 제목",
    tag : "#태그",
    nickname : "nickname",
    price : "3000",
    timestamp : "2021-03-31 17:30:36"
  },
  {
    id : "2",
    title : "post 제목2",
    tag : "#태그2",
    nickname : "nickname2",
    price : "4000",
    timestamp : "2021-03-31 17:30:37"
  }
])
});

router.get('/seller/:userid/selled', function(req, res, next) {
    res.status(200).json([
    {
        id : "1",
        title : "제목",
        tag : "#태그 #태그1",
        userid : "userid",
        nickname : "nickname",
        price : "3000",
        timestamp : "2021-03-31 17:30:38",
        attachment : [
            "대충 URL1","대충 URL2","대충 URL3",
        ]
    },
    {
        id : "2",
        title : "제목2",
        tag : "#태그2 #태그22",
        userid : "userid2",
        nickname : "nickname2",
        price : "4000",
        timestamp : "2021-03-31 17:30:39",
        attachment : [
            "대충 URL11","대충 URL22","대충 URL33",
        ]
    }
]);
  });

module.exports = router;
