var express = require('express');
var router = express.Router();
const db = require('../model/db');
const upload = require('../middleware/fileload');
const decode = require('../middleware/token');
const secret = require('../secret/primary');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/* GET users listing. */
router.get('/', function (req, res, next) {//sort 하는 방법 추가해야함
  const sorting=(t)=>{
    var c=t;
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
    c+=" LIMIT ?,?"
    return c;
  }
  const search_post = () => {
    const promise = new Promise((resolve, reject) => {
      var start,count;
      if(req.query.start==null) start=0;
      else start=parseInt(req.query.start);
      
      if(req.query.count==null) count=10;
      else count = parseInt(req.query.count);
      
      db.query(sorting(`SELECT post.postid,post.title,post.tag,post.userid,post.price,post.timestamp,user.nickname,user.schoolname,
      group_concat(attachment.url ORDER by attachment.attachmentid) AS URL
      FROM post LEFT JOIN user ON post.userid=user.userid
      LEFT JOIN attachment on attachment.postid=post.postid
      GROUP BY post.postid order by 
      `),[start,count],(err, result) => {
        if (err) reject(err);
        else {
          var arr_result = [];
          for (var i = 0; i < result.length; i++) {
            arr_result.push({
              postid: result[i].postid,
              title: result[i].title,
              tag: result[i].tag,
              userid: result[i].userid,
              nickname: result[i].nickname,
              price: result[i].price,
              timestamp: result[i].timestamp,
              schoolname:result[i].schoolname,
              attachment: result[i].URL,
            });
          }
          resolve(arr_result);
        }
      })
    })
    return promise;
  }

  const substr_URL = (result) => {
    const promise = new Promise((resolve, reject) => {
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


router.post('/',decode,upload.array('attachment'), function (req, res, next) {
  var post = req.body;
  const token = req.token;
  
  const querypost = (data) => {
    var userid=token.sub;
    const promise = new Promise((resolve, reject) => {
      db.beginTransaction();
      db.query('INSERT INTO post (title,tag,userid,step,price,content,timestamp) VALUES(?,?,?,?,?,?,NOW()) ',
        [post.title, post.tag+'#', userid, 0, post.price, post.content], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        })
    })
    return promise;
  }

  const picturequery = (result) => {
    const promise = new Promise((resolve, reject) => {
      for (let i = 0; i < req.files.length; i++) {
        db.query('INSERT INTO attachment (url,postid,originalname) VALUES(?,?,?)',
          ["images/posts/" + req.files[i].filename, result.insertId, req.files[i].originalname], (err, result) => {
            if (err) reject(err);
          })
      }
      resolve(result);
    })
    return promise;
  }

  const respond = (result) => {//json resposne;
    db.commit();
    res.status(200).json({});
  }

  const error = (error) => {
    db.rollback();
    res.status(500).json({ error: error });
  }
  
  querypost()
  .then(picturequery)
  .then(respond)
  .catch(error)
})


router.get('/:postid', function (req, res, next) {
  //게시글 조회
  postid = req.params.postid;
  db.query(`SELECT post.postid, post.title, tag, post.userid, post.price, post.timestamp, user.nickname, user.schoolname,post.content,user.profilepicture, attachment.url, attachment.attachmentid FROM post
    inner join attachment on post.postid = attachment.postid INNER JOIN user ON user.userid=post.userid where post.postid = ?;`, [postid], (err, result) => {
      if (result == undefined) {
        res.status(401).json();
        return;
      }
      if (err) {
      res.status(400).json;
      return;
      }
    //console.log(result)
    let attachment = []; //새로운 배열
    for (let i in (result)) { // 배열에 url, id 객체를 추가
      attachment.push(result[i].url,);
    }
    delete result[0].url;
    delete result[0].attachmentid;

    result[0].attachment = attachment;
    res.status(200).json(result[0]);
  })
});

router.put('/:postid', upload.array('attachment'), function (req, res, next) { //수정
   //url 저장은 path로 저장한다.
  
  const updatequery = (result) => {
    const promise = new Promise((resolve, reject) => {
        db.query('UPDATE post [title = ?, tag = ?, price = ?, content = ?] WHERE postid = ?',
        [req.body.title, req.body.tag, req.body.price, req.params], (err, result) => {
          if (err) reject(err);
        })
      resolve(result);
    })
    return promise;
  }

  const deletequery = (result) => {
    const promise = new Promise((resolve, reject) => {
      for (let i = 0; i < req.files.length; i++) {
        db.query('DELETE FROM attachment WHERE url = ?',
        [attach], (err, result) => {
          if (err) reject(err);
        })
      }
      resolve(result);
    })
    return promise;
  }
  const respond = (result) => {//json resposne;
    db.commit();
    res.status(200).json({});
  }

  const error = (error) => {
    db.rollback();
    res.status(500).json({ error: error });
  }
  updatequery()
    .then(deletequery)
    .then(respond)
    .catch(error)
});


router.post('/:postid/req', function (req, res, next) {
  res.status(200).json({});
});

router.post('/:postid/like', decode, function (req, res, next) {
  
  const userid = req.token.sub;

  let postid = req.params.postid;

  const dbLikeSelect = () => {
    const promise = new Promise((reject) => {
      db.query('SELECT userid, postid FROM f1t6.like WHERE userid = ? and postid = ?', [userid, postid], (err, result) => {
        if(err){
          reject(err);
        }
        if (result === undefined || result.length ==0) {
          dbLikeInsert()
          .then(resposne)
          .catch((err) => {
            res.status(403).json({err});
          });
        }
        else{
          dbLikeDelete()
          .then(resposne)
          .catch((err) => {
            res.status(403).json({err});
          });
        }
      });
    })
    return promise;
  }

  const dbLikeInsert = () =>{
    const promise = new Promise((resolve, reject) =>{
      db.query('insert into f1t6.like (userid, postid) values(?, ?)', [userid, postid], (err, result) =>{
        if(err) {
          reject(err);
        }
        resolve();
      })
    })
    return promise;
  }

  const dbLikeDelete = () =>{
    const promise = new Promise((resolve,reject) => {
      db.query('delete from f1t6.like where userid = ? and postid = ?', [userid, postid], (err, result) => { 
        if(err) {
          reject(err);
        }
        resolve();
      })
    })
    return promise;
  }

  const resposne = () => {
    const promise = new Promise((resolve, reject) => {
      res.status(201).json({});
    })
  }

  dbLikeSelect();
});


router.put('/:postid/step',decode,(req,res,next)=>{
  db.query('UPDATE post SET step = 1 WHERE postid = ?',[req.params.postid],(err,result)=>{
    if(err){
    console.log(err);
    res.status(200).json({err:err});
    return;
    }
    res.status(200).json({});
  })
})
module.exports = router;
