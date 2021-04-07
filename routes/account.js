var express = require('express');
var router = express.Router();
const db = require("../model/db");
const jwt = require('jsonwebtoken');
const secret = require('../secret/primary');
const crypto = require('crypto');



router.post('/sign_up', (req, res, next) => {
  post = req.body;
  var pw = crypto.createHash('sha512').update(post.password).digest('base64');
    db.query(`INSERT INTO user (userid,name,password,nickname,email,schoolname,contact,enteryear) VALUES(?,?,?,?,?,?,?,?)`,
    [post.userid, post.name, pw, post.nickname, post.email, post.schoolname, post.contact, post.enteryear], 
    (err, result) => {
      // console.log(err);
      var user = { 
        sub: post.userid,
        name:post.nickname,
        iat:new Date().getTime()/1000
      };
      var token = jwt.sign(user, secret, {
        expiresIn: "1m"
      })
      res.status(200).json({
        logintoken:token,
      });
    })
})

router.post('/login', (req, res) => {
  let post = req.body;
  const pw = crypto.createHash('sha512').update(post.password).digest('base64'); //암호화된 리퀘스트 패스워드
  db.query(`select password from user where userid=?`,[post.userid],(err,result)=>{
    if(result[0]==undefined){
      res.status(401).json();
      return;
    }
    if(pw==result[0].password){
      var user = { 
        sub: post.userid,
        name:post.nickname,
        iat:new Date().getTime()/1000
      };
      var token = jwt.sign(user, secret, {
        expiresIn: "1m"
      })
      res.status(200).json({
        logintoken:token,
      });
    }
    else{
      res.status(401).json();
    }
  })
  
})

router.post('/sign_up/check', (req, res) => {
  post=req.body;
  db.query('SELECT userid FROM user',(err,result)=>{
    for(var i=0;i<result.length;i++){
      if(result[i].userid==post.userid){
        res.status(200).json({
          result:"fail",
        });
        return;
      }
    }
    res.status(200).json({
      result:"success",
    });
  })
})

module.exports = router;
