var express = require('express');
var router = express.Router();
const db = require('../model/db');
const upload = require('../middleware/fileload');
const { response } = require('express');

/* GET users listing. */
router.get('/', upload.array(), function (req, res, next) {
  res.status(200).json({
    id: "1",
    title: "제목",
    tag: "#태그",
    userid: "userid",
    nickname: "nickname",
    price: "3000",
    timestamp: "2021-03-31 17:30:36",
    attachment: [
      "대충URL1", "대충URL2", "대충URL3",
    ]
  });
});

router.post('/', upload.array('attachment'), function (req, res, next) {
  var post = req.body;
  
  const querypost = (result) => {
    const promise = new Promise((resolve, reject) => {
      db.beginTransaction();
      db.query('INSERT INTO post (title,tag,userid,step,price,content,timestamp) VALUES(?,?,?,?,?,?,NOW()) ',
        [post.title, post.tag, post.userid, 0 ,post.price, post.content], (err, result) => {
          if(err)reject(err);
          else resolve(result);
        })
    })
    return promise;
  }

  const picturequery=(result)=>{
    const promise=new Promise((resolve,reject)=>{
      for(let i=0;i<req.files.length;i++){
        db.query('INSERT INTO attachment (url,postid,originalname) VALUES(?,?,?)',
        ["images/posts/"+req.files[i].filename,result.insertId,req.files[i].originalname],(err,result)=>{
          if(err)reject(err);
        })
      }
      resolve(result);
    })
    return promise;
  }

  const respond = (result)=>{//json resposne;
    db.commit();
    res.status(200).json({});
  }

  const error=(error)=>{
    db.rollback();
    res.status(500).json({error:error});
  }
  querypost()
  .then(picturequery)
  .then(respond)
  .catch(error)
})


router.get('/posts/:postid', function (req, res, next) {
  res.status(200).json([
    {
      id: "1",
      title: "제목",
      tag: "#태그1 #태그2",
      userid: "userid",
      nickname: "nickname",
      price: "3000",
      timestamp: "2021-03-31 17:30:36"
    },
    {
      id: "2",
      title: "제목2",
      tag: "#태그1 #태그2",
      userid: "userid2",
      nickname: "nickname2",
      price: "4000",
      timestamp: "2021-03-31 17:30:37"
    }
  ]);
});

router.put('/posts/:postid', function (req, res, next) {
  res.status(200).json({});
});

router.post('/posts/:postid/req', function (req, res, next) {
  res.status(200).json({});
});



module.exports = router;
