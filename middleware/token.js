const secret = require('../secret/primary');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const tokendecode = (req,res,next) => {
    let token = req.get('authorization');
    jwt.verify(token, secret, (err, data) => {
        req.token = data;
    })
    next()
}


module.exports = tokendecode;