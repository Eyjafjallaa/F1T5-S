var express = require('express');
var router = express.Router();
const db = require('../model/db');
const upload = require('../middleware/fileload');

/* GET users listing. */
router.get('/', function (req, res, next) {//sort 하는 방법 추가해야함
  const search_post = () => {
    const promise = new Promise((resolve, reject) => {
      db.query('SELECT postid,title,tag,post.userid,price,timestamp FROM post LEFT JOIN user ON post.userid=user.userid', (err, result) => {
        if (err) reject(err);
        else {
          var arr_result = [];
          for (var i = 0; i < result.length; i++) {
            arr_result.push({
              postid: result[i].postid,
              title: result[i].title,
              tag: result[i].tag,
              userid: result[i].userid,
              nickname: "",
              price: result[i].price,
              timestamp: result[i].timestamp,
              attachment: [],
            });
          }
          resolve(arr_result);
        }
      })
    })
    return promise;

    
  }

  const search_Url = (result) => {
    const promise = new Promise((resolve, reject) => {
      //console.log(result);
      for (var i = 0; i < result.length; i++) {
        console.log(result[i]);
        db.query('SELECT url FROM attachment WHERE postid=?', [result[i].postid], (err, data) => {
          if (err) reject(err);
          if (data[0] != undefined) {
            result[i].attachment=data;
          }else{
            result[i].attachment=null;
          }
        })
        resolve(result);
      }
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
    .then(search_Url)
    .then(respond)
    .catch(error);
});


router.post('/', upload.array('attachment'), function (req, res, next) {
  var post = req.body;

  const querypost = (result) => {
    const promise = new Promise((resolve, reject) => {
      db.beginTransaction();
      db.query('INSERT INTO post (title,tag,userid,step,price,content,timestamp) VALUES(?,?,?,?,?,?,NOW()) ',
        [post.title, post.tag, post.userid, 0, post.price, post.content], (err, result) => {
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
  db.query(`SELECT post.postid, post.title tag, post.userid, post.price, post.timestamp, attachment.url, attachment.attachmentid FROM post
    inner join attachment on post.postid = attachment.postid where post.postid = ?;`, [postid], (err, result) => {
      if (result[0] == undefined) {
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
      attachment.push({url : result[i].url,
      attachmentid : result[i].attachmentid});
    }
    console.log(attachment);
    delete result[0].url;
    delete result[0].attachmentid;

    result[0].attachment = attachment;
    res.status(200).json(result[0]);
  })
});

router.put('/:postid', upload.array('attachment'), function (req, res, next) { //수정
  console.log(req.files); //url 저장은 path로 저장한다,
  res.status(200).json({});
});

router.post('/:postid/req', function (req, res, next) {
  res.status(200).json({});
});



module.exports = router;
