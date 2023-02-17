const Expense = require('../models/expense');

exports.addExpense = async (req, res, next) =>{
   try{
    const {expenseamount, description, category} = req.body;

    const data = await Expense.create({expenseamount, description, category,userId: req.user.id})
     res.status(201).json({expenseDeatils: data})
   } catch(err){
    res.status(500).json(err);
   }
}

exports.getExpense = async (req, res)=>{
    req.user.getExpenses().then(expenses =>{
        return res.status(200).json({expenses, success: true})
    })
    .catch(err=>{
       return res.status(500).json({error: err, success: false})
    })
}

exports.deleteExpense = async (req, res)=>{
    const expenseid = req.params.expenseid;
    try{
      await Expense.destroy({where: {id: expenseid, userId : req.user.id}});
      res.sendStatus(200);
    } catch(err){
        console.log(err);
        res.status(500).json(err)
    }
}