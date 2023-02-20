const Expense = require('../models/expense');
const User = require('../models/user');
const seqeilize = require('../util/database');

exports.addExpense = async (req, res) =>{
   const t = await seqeilize.transaction();
   try{
    const {expenseamount, description, category} = req.body;

    if(expenseamount== undefined || expenseamount.length==0){
        return res.status(400).json({seccess: false, message:'parameter is missing'})
    }
    const expense = await Expense.create({expenseamount, description, category,userId: req.user.id }, {transaction: t })
    const totalExpense = Number(req.user.totalExpenses)+ Number(expenseamount) 
    await User.update({
         totalExpenses: totalExpense
      },{
            where : {id:req.user.id},
            transaction: t
        })
         await t.commit();
         res.status(200).json({expense:expense})
        
    } catch(err){
        await t.rollback();
        return res.status(500).json({success:false, error:err})
     }
}

exports.getExpense = async (req, res)=>{
    req.user.getExpenses().then(expense =>{
        return res.status(200).json({expense, success: true})
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