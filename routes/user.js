const express = require('express');

const userController = require('../controllers/user');
const userauthentication= require('../middleware/auth');
const expenseController = require('../controllers/expense');

const router = express.Router();

router.post('/user/signup', userController.postSignup);

router.post('/user/login',userController.postLogin);

router.get('/user/download',userauthentication.authenticate, expenseController.downloadExpense )

module.exports = router;