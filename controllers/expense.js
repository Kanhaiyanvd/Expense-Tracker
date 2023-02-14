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

exports.getExpense = async (req, res, next)=>{
    Expense.findAll().then(expenses =>{
        return res.status(200).json({expenses, success: true})
    })
    .catch(err=>{
       return res.status(500).json({error: err, success: false})
    })
}

exports.deleteExpense = async (req, res)=>{
    const eid = req.params.id;
    try{
        if(req.params.id=='undefined'){
            console.log('ID is missing');
            return res.status(400).json({err: 'ID is missing'})
        }
      await Expense.destroy({where: {id: eid}});
      res.sendStatus(200);
    } catch(err){
        console.log(err);
        res.status(500).json(err)
    }
}