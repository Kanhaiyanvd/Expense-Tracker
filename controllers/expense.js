const Expense = require('../models/expense');
const User = require('../models/user');

exports.addExpense = async (req, res) =>{
   //try{
    const {expenseamount, description, category} = req.body;

    if(expenseamount== undefined || expenseamount.length==0){
        return res.status(400).json({seccess: false, message:'parameter is missing'})
    }

     Expense.create({expenseamount, description, category,userId: req.user.id}).then(expense =>{
        const totalExpenses = Number(req.user.totalExpenses)+ Number(expenseamount)
        console.log(totalExpenses);
        User.update({
            totalExpenses: totalExpenses
        },{
            where : {id:req.user.id}
        }).then(async()=>{
            res.status(200).json({expense:expense})
        }).catch(async(err)=>{
            return res.status(500).json({success: false, error:err})
        }).catch(async(err)=>{
            return res.status(500).json({success:false, error:err})
        })
    })
    // res.status(201).json({expenseDeatils: data})
//    } catch(err){
//     res.status(500).json(err);
//    }
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