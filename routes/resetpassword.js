const express = require('express');

const passwordControllers = require('../controllers/resetpassword');


const router = express.Router();
router.post('/forgotpassword',passwordControllers.forgotPassword);

router.get('/resetpassword/:id',passwordControllers.resetPassword);

router.get('/updatepassword/:id',passwordControllers.updatePassword);

module.exports = router;