const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const path = 'images/'+req.originalUrl.split('/')[1];
        try {
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path);
            }
        } catch (err) {
            console.error(err)
        }
        cb(null, path);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
    }
});

const upload = multer({ storage: storage });
module.exports = upload;