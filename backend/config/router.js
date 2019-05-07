const express = require("express");
const multer = require("multer");

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if (isValid) {
            error = null;
        }
        cb(error, "static/images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('_');
        cb(null, Date.now() + '_' + name);
    }
});


const checkAuth = require('../config/security');

const userController = require('../controller/userCtrl');

//public calls
router.post('/login', userController.loginUser);
router.post('/signup', userController.signupUser);
router.post('/reset', userController.resetPassword);
router.post('/update-password', userController.updatePasswordByToken);
router.post('/user/token', userController.getUserByToken);


//Authenticated calls
router.get('/users', checkAuth, userController.getUsers);
router.get('/user/:id', checkAuth, userController.getUserById);
router.post('/user-profile', checkAuth, userController.updateUserProfile);
router.post('/user-profile-photo', multer({storage: storage}).single('profilePhoto'), checkAuth, userController.updateUserProfilePhoto);
router.get('/user-profile/:userId', checkAuth, userController.getUserProfileByUserId);


module.exports = router;
