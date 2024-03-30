



const express = require('express')

const router = express.Router();
const userRole = require('../utils/userRoles')

const userController = require('../controller/user.controller');
const verfiyToken = require('../middelware/verfiyToken');

const allowedTo = require('../middelware/allowedTo');
const multer  = require('multer');
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function(req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const fileName = `user-${Date.now()}.${ext}`;
        cb(null, fileName);
    }
})

const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split('/')[0];
    
    if(imageType === 'image') {
        return cb(null, true)
    } else {
        return cb(appError.create('file must be an image', 400), false)
    }
}
const upload = multer({ 
    storage: diskStorage,
    fileFilter
})


router.get('/',verfiyToken,allowedTo(userRole.MANGER,userRole.ADMIN) ,userController.getUsers)




router.post('/register',upload.single('avatar'),userController.register)




router.post('/login',userController.login)


module.exports = router