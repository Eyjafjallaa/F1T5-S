var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/search', function(req, res, next) {
  res.status(200).json([
    {
      post:"1234",
      title:"이물건팝니다",
      tag:"태그1 태그2 태그3 태그5",
      userid:"kseocken",
      price:"30230300",
      timestamp:"2020-04-04-11-23-60",
      attachment:["url1","url2","url3","url4"]
    }
  ])
});

router.get('/schoolinfo', function(req, res, next) {//학교검색하기
  res.status(200).json([
    {
      school_code:"대충학교코드",
      school_name:"대고소푸토웨아고등학교",
      school_location:"대구 구지 구지로 182",
    },
    {
      school_code:"대충학교코드2",
      school_name:"대고소푸토웨아고등학교2",
      school_location:"대구 구지 구지로 182+2",
    },
    {
      school_code:"대충학교코드3",
      school_name:"대고소푸토웨아고등학교3",
      school_location:"대구 구지 구지로 182+3",
    }
  ])
});

module.exports = router;
