var express = require('express');
var router = express.Router();
const upload = require('../middleware/fileload');
const db = require('../model/db');
/* GET users listing. */

router.get('/:userid', function(req, res, next) {//조회
    //응답: school_name,name,nickname,contact,enteryear,profilepicture,email
    const userid = req.params.userid;
    db.query('select schoolname, name, nickname, contact, enteryear, profilepicture, email from user where userid = ?', [userid], (err, result) => {
        //객체
        try{
            result = result[0];
            console.log(result);
            // json_result = JSON.stringify(result[0]);
            // console.log(json_result);
            res.status(200).json(result);
        }catch(err){
            console.log(err);
            res.status()
        }
    })
});

router.put('/:userid',upload.single() ,function(req, res, next) {//수정
    res.status(200).json({
        school_name:"대구소프트웨어마이스터고등학고",
        name:"강석형",
        nickname:"귀염뽀짝석현이",
        contact:"000-0000-0000",
        enteryear:"2019",
        profilepicture:"대충URL같은거"
    });
});

module.exports = router;
