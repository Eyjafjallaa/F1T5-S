var express = require('express');
var router = express.Router();
const db = require("../model/db");


/*
router.get('/sign_up',(req,res,next)=>{
  post=req.body;
  db.query('INSERT INTO (userid,name,password,nickname,email,schoolname,contact,enteryear,profilepicture) VALUES(?,?,?,?,?,?,?,?,?)',
  [post.userid,post.name,post.password,post.nickname,post.email,post.schoolname,post.contact,post.enteryear,post.profilepicture],(err,result)=>{
    //multer 사용해서 잘 처리
    res.status(200).json({
      //로그인 토큰 준다.
    });
  })
})
*/
router.get('/sign_up',(res,req,next)=>{
  //대충 로그인 처리하고
  req.status(200).json({
    logintoken:"대충로그인토큰",
  })
})

router.get('/login',(req,res)=>{
  if(true==true){
    req.status(200).json({logintoken:"대충로그인토큰"})
  }
  else{
    req.status(401).json({});
  }
})

router.get('/sign_up/check',(req,res)=>{
  if(true==true){//db연결한뒤 처리
    req.status.json({
      result:"success"
    });
  }
  else{
    req.status.json({
      result:"fail"
    });
  }
})

module.exports = router;
