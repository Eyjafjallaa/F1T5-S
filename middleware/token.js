const secret = require('../secret/primary');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const tokendecode = (req,res,next) => {
    //console.log(req.get('authorization'))
    let token = req.get('authorization');
    jwt.verify(token, secret, (err, data) => {
        if(err){
            res.status(401).json({err:err});
            return;
        }    
        req.token = data;
    })
    next()
}


module.exports = tokendecode;