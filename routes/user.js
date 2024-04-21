const express = require('express');
const router = express.Router();

const {login, signup} = require('../controllers/Auth');
const {auth, isStudent, isAdmin} = require('../middlewares/auth');
router.post('/login', login);
router.post('/signup', signup);


//For single Middle ware
router.get('/test', auth, (req, res) =>{
    res.json({
        success: true,
        message: "It is the Protected Routes for Test",
    })
})
//Protected Routes
router.get('/Student', auth, isStudent, (req, res) =>{
    res.json({
        success: true,
        message: "It is the Protected Routes for Students",
    })
});

router.get('/Admin', auth, isAdmin, (req, res) =>{
    res.json({
        success: true,
        message: "It is the Protected Routes for Admin",
    })
});
module.exports = router;

