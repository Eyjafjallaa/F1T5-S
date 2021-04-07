var express = require('express');
var router = express.Router();
const db = require("../model/db");
const jwt = require('jsonwebtoken');
const secret = require('../secret/primary');
const crypto = require('crypto');
const { post } = require('../app');


router.post('/sign_up', (req, res, next) => {
  post = req.body;
  var pw = crypto.createHash('sha512').update(post.password).digest('base64');
    db.query(`INSERT INTO user (userid,name,password,nickname,email,schoolname,contact,enteryear) VALUES(?,?,?,?,?,?,?,?)`,
    [post.userid, post.name, pw, post.nickname, post.email, post.schoolname, post.contact, post.enteryear], 
    (err, result) => {
      console.log(err);
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

})

router.post('/sign_up/check', (req, res) => {
  post=req.body;
  console.log(post);
  db.query('SELECT userid FROM user',(err,result)=>{
    for(var i=0;i<result.length;i++){
      if(result[i].userid==post.userid){
        res.status(200).json({
          result:"fail",
        });
        console.log(a);
      }
    }
    console.log(b)
    res.status(200).json({
      result:"success",
    });
  })
})

module.exports = router;
