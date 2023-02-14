const express = require('express');

const expenseController = require('../controllers/expense');

const router = express.Router();

router.post('/expense/addexpense', expenseController.addExpense);

router.get('/expense/getexpenses', expenseController.getExpense);

router.delete('/expense/delete-expense/:expenseid', expenseController.deleteExpense);

// router.post('/user/login',userController.postLogin);

module.exports = router;