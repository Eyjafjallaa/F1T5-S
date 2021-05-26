var express = require('express');
var router = express.Router();
let request = require('request');
const db=require('../model/db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/search', function(req, res, next) {
  var word= '%'+req.query.keyword+'%';
  var start,count;
  if(req.query.start==null) start=0;
  else start=parseInt(req.query.start);
  
  if(req.query.count==null) count=10;
  else count = parseInt(req.query.count);
  
  const sorting=()=>{
    var c="";
    switch(req.query.sort){
      case "1":
        c+="timestamp DESC";
        break;
      case "2":
        c+="timestamp ASC";
        break;
      case "3":
        c+="price DESC";
        break;
      case "4":
        c+="price ASC";
        break;
      default:
        c+="timestamp DESC";
        break;
    }
    return c;
  }
  const search_post=()=>{
    const promise = new Promise((resolve,reject)=>{
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
        LIMIT ?,?`,[word,word,sorting(),start,count],(err,result)=>{
          if(err) reject(err);
          else{
            var arr_result=[];
            for(var i=0;i<result.length;i++){
              arr_result.push({
                postid: result[i].postid,
                title: result[i].title,
                tag: result[i].tag,
                userid: result[i].userid,
                nickname: result[i].nickname,
                price: result[i].price,
                timestamp: result[i].timestamp,
                attachment: result[i].URL,
              })
            }
            resolve(arr_result);
          }
        })
      }
    })
    return promise;
  }
  
  const substr_URL = (result) => {
    const promise = new Promise((resolve, reject) => {
      var arr_result = [];
      for (var i = 0; i < result.length; i++) {
        if(result[i].attachment==undefined)continue;
        const a=result[i].attachment.split(',');
        result[i].attachment=a;
      }
      resolve(result);
    })
    return promise;
  }

  const respond = (result) => {
    res.status(200).json(result);
  }

  const error = (error) => {
    res.status(500).json({ error: error });
  }

  search_post()
  .then(substr_URL)
  .then(respond)
  .catch(error);
  
});

router.get('/schoolinfo', function(req, res, next) {//학교검색하기
  let school = req.query.schoolName;
  let url = "https://open.neis.go.kr/hub/schoolInfo?KEY=f08d52196c3a48ecbd679177083b65f0&Type=json&SCHUL_NM=" + encodeURI(school);
  request(url, (err, response, body) => {
    if(err){
      return res.status(400).json({err});
    }
    let jsonbody = JSON.parse(body); //json으로 파싱
    if(jsonbody.schoolInfo == undefined){
      res.status(200).json({});
      return;
    }
    let school = jsonbody.schoolInfo[1]
    let result = [];
    for(let i = 0; school.row[i] != undefined; i++){
        if('초등학교' === school.row[i].SCHUL_KND_SC_NM){
          continue;
        }
        let schoolcode = school.row[i].SD_SCHUL_CODE;   //학교 코드
        let schoolname = school.row[i].SCHUL_NM;     //학교이름
        let schoollocation = school.row[i].LCTN_SC_NM; //학교 위치

        let tmp = new Object();
        tmp.school_code = schoolcode;
        tmp.school_name = schoolname;
        tmp.school_location = schoollocation;

        result.push(tmp);
    }
    res.status(200).json(result);
  });
});

module.exports = router;
