var express = require('express');
var router = express.Router();
const upload = require('../middleware/fileload');
const db = require('../model/db');
const jwt = require('jsonwebtoken');
const secret = require('../secret/primary');
const crypto = require('crypto');
const token = require('../middleware/token');

/* GET users listing. */

router.get('/',token, function (req, res, next) {//조회
    //응답: school_name,name,nickname,contact,enteryear,profilepicture,email
    const token = req.token 
    
    const dbsearch=()=>{
        const promise = new Promise((resolve,reject)=>{
            var userid=token.sub;
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
            `,[t.userid],(err,result)=>{
                if(err)reject(err);
                t.like=result
                resolve(t);
            })
        })
        return promise
    }

    const selling=(t)=>{
        const promise = new Promise((resolve,reject)=>{
            db.query(`SELECT post.postid,post.title,post.price,
            group_concat(attachment.url ORDER by attachment.attachmentid) AS attachment
            FROM post LEFT JOIN attachment ON attachment.postid=post.postid 
            WHERE post.userid =? AND post.step=0
            GROUP BY post.postid
            ORDER BY timestamp DESC
            LIMIT 0,5`,[t.userid],(err,result)=>{
                if(err)reject(err);
                t.selling=result;
                resolve(t);
            })
        })
        return promise;
    }

    const sold=(t)=>{
        const promise = new Promise((resolve,reject)=>{
            db.query(`SELECT post.postid,post.title,post.price,
            group_concat(attachment.url ORDER by attachment.attachmentid) AS attachment
            FROM post LEFT JOIN attachment ON attachment.postid=post.postid 
            WHERE post.userid =? AND post.step=1
            GROUP BY post.postid
            ORDER BY timestamp DESC
            LIMIT 0,5`,[t.userid],(err,result)=>{
                if(err)reject(err);
                t.sold=result;
                resolve(t);
            })
        })
        return promise;
    }

    const substr_URL = (result) => {
        const promise = new Promise((resolve, reject) => {
            for (var i = 0; i < result.like.length; i++) {
                if (result.like[i].attachment == undefined) continue;
                const a = result.like[i].attachment.split(',');
                result.like[i].attachment = a;
            }
            for (var i = 0; i < result.selling.length; i++) {
                if (result.selling[i].attachment == undefined) continue;
                const a = result.selling[i].attachment.split(',');
                result.selling[i].attachment = a;
            }
            for (var i = 0; i < result.sold.length; i++) {
                if (result.sold[i].attachment == undefined) continue;
                const a = result.sold[i].attachment.split(',');
                result.sold[i].attachment = a;
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


    dbsearch()
    .then(likes)
    .then(selling)
    .then(sold)
    .then(substr_URL)
    .then(respond)
    .catch(error);
});

router.put('/', token,upload.single('attachment'), function (req, res, next) {//수정
    const URL = "images/profile/" + req.file.filename;

    const token = req.token;
    const updatePhoto = () => {
        const promise = new Promise((resolve, reject) => {
            db.query('UPDATE user SET profilepicture =? WHERE userid = ?', [URL, token.sub], (err, result) => {
                if (err) reject(err)
                resolve(token);
            });
        })
        return promise
    }

    const udpateData=()=>{
        const promise = new Promise((resolve,reject)=>{
            const pw = crypto.createHash('sha512').update(req.body.password).digest('base64');
            db.query('UPDATE user SET nickname = ?, email = ?, schoolname =?, password = ? WHERE userid =?',
            [req.body.nickname,req.body.email,req.body.schoolname,pw,token.sub],(err,result)=>{
                if(err)reject(err);
                resolve(token);
            })
        })
        return promise;
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
    updatePhoto()
    .then(udpateData)
    .then(queryUser)
    .then(respond)
    .catch(error)
});

router.get('/like', token, function(req,res,next){
    const likes=()=>{
        const promise=new Promise((resolve,reject)=>{
            db.query(`SELECT post.postid,post.title,post.price,
            group_concat(attachment.url ORDER by attachment.attachmentid) AS attachment
            FROM post 
            LEFT JOIN f1t6.like ON post.userid=f1t6.like.postid
            LEFT JOIN attachment ON attachment.postid=post.postid 
            WHERE post.userid =?
            GROUP BY post.postid
            ORDER BY timestamp DESC
            `,[req.token.sub],(err,result)=>{
                if(err)reject(err);
                resolve(result);
            })
        })
        return promise;
    }
    
    const substr_URL = (result) => {
        const promise = new Promise((resolve, reject) => {
            for (var i = 0; i < result.length; i++) {
                if (result[i].attachment == undefined) continue;
                const a = result[i].attachment.split(',');
                result[i].attachment = a;
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

    likes()
    .then(substr_URL)
    .then(respond)
    .catch(error);
})
module.exports = router;
