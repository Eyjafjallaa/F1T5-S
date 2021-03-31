var express = require('express');
var router = express.Router();
const db = require("../model/db");
const jwt = require('jsonwebtoken');
const secret = require('../secret/primary');
const crypto = require('crypto');


router.post('/sign_up', (req, res, next) => {
  post = req.body;
  //multer 이용해서 이미지 처리
  var pw = crypto.createHash('sha512').update(post.password).digest('base64');
  db.query(`INSERT INTO user (userid,name,password,nickname,email,schoolname,contact,enteryear,profilepicture) VALUES(?,?,?,?,?,?,?,?,?)`,
    [post.userid, post.name, pw, post.nickname, post.email, post.schoolname, post.contact, post.enteryear, post.profilepicture], 
    (err, result) => {
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

})

module.exports = router;
