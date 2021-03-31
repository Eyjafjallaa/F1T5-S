var express = require('express');
var router = express.Router();
const db = require("../model/db");



router.get('/sign_up',(req,res,next)=>{
  post=req.body;
  db.query('INSERT INTO (userid,name,password,nickname,email,schoolname,contact,enteryear,profilepicture) VALUES(?,?,?,?,?,?,?,?,?)',
  [post.userid,post.name,post.password,post.nickname,post.email,post.schoolname,post.contact,post.enteryear,post.profilepicture],(err,result)=>{
    //multer 사용해서 잘 처리

    res.status(200).json({
      "token":test,
    });
  })
})

router.get('/login',(req,res)=>{

})

router.get('/sign_up/check',(req,res)=>{

})

module.exports = router;
