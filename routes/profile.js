var express = require('express');
var router = express.Router();
const upload = require('../middleware/fileload');
const db = require('../model/db');
const jwt = require('jsonwebtoken');
const secret = require('../secret/primary');
const crypto = require('crypto');
const { resolve } = require('path');
/* GET users listing. */

router.get('/', function (req, res, next) {//조회
    //응답: school_name,name,nickname,contact,enteryear,profilepicture,email
    const token = req.get('authorization');

    const tokendecode=()=>{
        const promise = new Promise((resolve,reject)=>{
            jwt.verify(token, secret, (err, data) => {
                if(err)reject(err);
                else resolve(data);
            })
        })
        return promise;
    }
    
    const dbsearch=(data)=>{
        const promise = new Promise((resolve,reject)=>{
            var userid=data.sub;
            db.query('select schoolname, name, nickname, contact, enteryear, profilepicture, email from user where userid = ?',
            [userid], (err, result) => {
                //객체
                if (result[0] == undefined) {
                    reject(null);
                }
                else if(err)reject(err);
                else{
                    var c={
                        schoolname:result[0].schoolname,
                        name:result[0].name,
                        nickname:result[0].nickname,
                        contact:result[0].contact,
                        enteryear:result[0].enteryear,
                        profilepicture:result[0].profilepicture,
                        email:result[0].email,
                        userid:userid
                    }
                    resolve(c);
                }   
            })
        })
        return promise;
    }

    const likes=(t)=>{
        const promise=new Promise((resolve,reject)=>{
            db.query(`SELECT post.postid,post.title,post.price,
            group_concat(attachment.url ORDER by attachment.attachmentid) AS attachment
            FROM post 
            LEFT JOIN f1t6.like ON post.userid=f1t6.like.postid
            LEFT JOIN attachment ON attachment.postid=post.postid 
            WHERE post.userid =?
            GROUP BY post.postid
            ORDER BY timestamp DESC
            LIMIT 0,5;
            `,[t.id],(err,result)=>{
                console.log(t);
                if(err)reject(err);
                console.log(result);
                t.like=result
                resolve(t);
            })
        })
        return promise
    }

    const substr_URL = (result) => {
        const promise = new Promise((resolve, reject) => {
            for (var i = 0; i < result.like.length; i++) {
                if (result.like[i].attachment == undefined) continue;
                const a = result.like[i].attachment.split(',');
                result.like[i].attachment = a;
            }
            resolve(result);
        })
        return promise;
    }
    const respond = (result) => {
        res.status(200).json(result);
    }
    const error = (error) => {
        res.status(500).json({ error: error });
    }

    tokendecode()
    .then(dbsearch)
    .then(likes)
    .then(substr_URL)
    .then(respond)
    .catch(error);
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
