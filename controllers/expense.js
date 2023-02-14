const Expense = require('../models/expense');

exports.addExpense = async (req, res, next) =>{
   try{
    const {expenseamount, description, category} = req.body;
    const data = await Expense.create({expenseamount: expenseamount, description: description, category: category})
     res.status(201).json({expenseDeatils: data})
   } catch{
    res.status(500).json(err);
   }
}

exports.getExpense = async (req, res)=>{
    Expense.findAll().then(expenses =>{
        return res.status(200).json({expenses, success: true})
    })
    .catch(err=>{
       return res.status(500).json({error: err, success: false})
    })
}

exports.deleteExpense = async (req, res)=>{
    const expenseid = req.params.expenseid;
    try{
        // if(expenseid== undefined || expenseid.length == 0){
        //   return  res.status(400).json({success: false})
            // console.log('ID is missing');
            // return res.status(400).json({err: 'ID is missing'})
       // }
      await Expense.destroy({where: {id: expenseid}});
      res.sendStatus(200);
    } catch(err){
        console.log(err);
        res.status(500).json(err)
    }
}