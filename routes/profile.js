var express = require('express');
var router = express.Router();
const upload = require('../middleware/fileload');
/* GET users listing. */

router.get('/:postid', function(req, res, next) {//조회
    res.status(200).json({
        school_name:"대구소프트웨어마이스터고등학고",
        name:"강석형",
        nickname:"귀염뽀짝석현이",
        contact:"000-0000-0000",
        enteryear:"2019",
        profilepicture:"대충URL같은거"
    });
});

router.put('/:postid',upload.single() ,function(req, res, next) {//수정
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
