var express = require('express');
var router = express.Router();
let request = require('request');
let cheerio = require('cheerio');
const { data } = require('cheerio/lib/api/attributes');
const db=require('../model/db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/search', function(req, res, next) {
  var word= req.params.keyword
  var start,count;
      if(req.query.start==null) start=0;
      else start=parseInt(req.query.start);
      
      if(req.query.count==null) count=10;
      else count = parseInt(req.query.count);
      
  if(word[0]=='#'){//#검색
    word.split('#');
  }
  else{//문장 검색
    db.query(`SELECT post.postid,post.title,post.tag,post.userid,post.price,post.timestamp,user.nickname,
    group_concat(attachment.url ORDER by attachment.attachmentid) AS URL
    FROM post LEFT JOIN user ON post.userid=user.userid
    LEFT JOIN attachment on attachment.postid=post.postid
    WHERE post.title like ? OR post.content like ?
    GROUP BY post.postid order by ?
    LIMIT ?,?`,[word,sorting(),start,count],(err,result)=>{

    })
  }

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
  let school = req.query.schoolName;
  let url = "https://open.neis.go.kr/hub/schoolInfo?KEY=f08d52196c3a48ecbd679177083b65f0&Type=json&SCHUL_NM=" + encodeURI(school);
  request(url, (err, response, body) => {
    if(err){
      return res.status(400).json({err});
    }
    //let bodyJson = JSON.parse(body);
    //console.log(bodyJson);
    console.log(typeof(body));
    let jsonbody = JSON.parse(body);
    console.log(jsonbody);
    
      console.log(jsonbody.schoolInfo[1].row[0]);
    
  });

  res.status(200).json({});
  /*res.status(200).json([
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
  ])*/
});

module.exports = router;
