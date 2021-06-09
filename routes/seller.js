var express = require('express');
var router = express.Router();
const db = require('../model/db');
var decode = require('../middleware/token');
router.get('/:userid', function (req, res, next) {
  db.query(`SELECT * FROM user WHERE userid = ?`, [req.params.userid], (err, result) => {
    if (err) {
      res.status(400).json({ error: err });
      return;
    }
    if(result[0]==undefined){
      res.status(403).json({error:"no man"});
      return;
    }
    res.status(200).json({
      nickname: result[0].nickname,
      schoolname: result[0].schoolname,
      profilepicture: result[0].profilepicture,
    });
  })
});

router.get('/:sellerid/products',decode, function (req, res, next) {
  const search_post = ()=>{
    var step;
    if(req.query.step=="0"){
      step=0;
    }else{
      step=1;
    }
    const promise = new Promise((resolve, reject)=>{
      db.query(`SELECT post.postid,post.title,post.tag,post.userid,post.price,post.timestamp,user.nickname,
      group_concat(attachment.url ORDER by attachment.attachmentid) AS URL 
      FROM post LEFT JOIN user ON post.userid=user.userid
      LEFT JOIN attachment on attachment.postid=post.postid
      WHERE user.userid=? AND post.step=?
      GROUP BY post.postid 
      ORDER BY timestamp DESC
      `,[req.params.sellerid,step],(err,result)=>{
        console.log(result)
        console.log(req.params.sellerid+step);
        if(err)reject(err);
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





module.exports = router;
