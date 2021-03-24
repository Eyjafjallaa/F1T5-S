var express = require('express');
var router = express.Router();
const db = require("../model/db");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/sign_up',(req,res)=>{
  post=req.body;
  db.query('INSERT INTO (userid,name,password,nickname,email,schoolname,contact,enteryear,profilepicture) VALUES(?,?,?,?,?,?,?,?,?)',
  [post.userid,post.name,post.password,post.nickname,post.email,post.schoolname,post.contact,post.enteryear,post.profilepicture],(err,result)=>{
    res.status(200).json({});
  })
})
module.exports = router;
