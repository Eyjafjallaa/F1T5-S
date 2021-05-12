var express = require('express');
var router = express.Router();
const db = require('../model/db');

router.get('/:userid', function (req, res, next) {
  db.query(`SELECT * FROM user WHERE userid = ?`, [req.params.userid], (err, result) => {
    if (err) {
      res.status(400).json({ error: err });
      return;
    }
    res.status(200).json({
      nickname: result[0].nickname,
      schoolname: result[0].schoolname,
      prifilepicture: result[0].profilepicture,
    });
  })
});

router.get('/:userid', function (req, res, next) {
  
  res.status(200).json([
    {
      id: "1",
      title: "post 제목",
      tag: "#태그",
      nickname: "nickname",
      price: "3000",
      timestamp: "2021-03-31 17:30:36"
    },
    {
      id: "2",
      title: "post 제목2",
      tag: "#태그2",
      nickname: "nickname2",
      price: "4000",
      timestamp: "2021-03-31 17:30:37"
    }
  ])
});


module.exports = router;
