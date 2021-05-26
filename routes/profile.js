var express = require('express');
var router = express.Router();
const upload = require('../middleware/fileload');
const db = require('../model/db');
const jwt = require('jsonwebtoken');
const secret = require('../secret/primary');
const crypto = require('crypto');
/* GET users listing. */

router.get('/', function (req, res, next) {//조회
    //응답: school_name,name,nickname,contact,enteryear,profilepicture,email
    const token = req.get('authorization');
    jwt.verify(token, secret, (err, data) => {
        const userid = data.sub;
        db.query('select schoolname, name, nickname, contact, enteryear, profilepicture, email from user where userid = ?', [userid], (err, result) => {
            //객체
            if (result[0] == undefined) {
                res.status(401).json();
                return;
            }
            try {
                result = result[0];
                res.status(200).json(result);
            } catch (err) {
                console.log(err);
                res.status(400).json();
            }
        })
    })
});

router.put('/:userid', upload.single('attachment'), function (req, res, next) {//수정
    const URL = "images/profile/" + req.file.filename;

    const token = req.body.token;
    const tokendecode = () => {
        const promise = new Promise((resolve, reject) => {
            jwt.verify(token, secret, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
        })
        return promise;
    }

    const updatePhoto = (data) => {
        const promise = new Promise((resolve, reject) => {
            db.query('UPDATE user SET profilepicture =? WHERE userid = ?', [URL, data.sub], (err, result) => {
                if (err) reject(err)
                resolve(data);
            });
        })
        return promise
    }

    const queryUser = (data) => {
        const promise = new Promise((resolve, reject) => {
            db.query('SELECT schoolname,name,nickname,contact,enteryear,profilepicture,email FROM user WHERE userid=?', [data.sub], (err, result) => {
                if (err) reject(err)
                else resolve(result)
            })
        })
        return promise;
    }

    const respond = (result) => {
        res.status(200).json({
            schoolname: result[0].schoolname,
            name: result[0].name,
            nickname: result[0].nickname,
            contact: result[0].contact,
            enteryear: result[0].enteryear,
            profilepicture: result[0].profilepicture,
            email: result[0].email
        })
    }

    const error = (error) => {
        res.status(500).json({ error: error })
    }
    tokendecode()
        .then(updatePhoto)
        .then(queryUser)
        .then(respond)
        .catch(error)
});

module.exports = router;
