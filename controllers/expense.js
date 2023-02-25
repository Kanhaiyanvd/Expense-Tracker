const Expense = require('../models/expense');
const User = require('../models/user');
const seqeilize = require('../util/database');
const DownloadedFile = require('../models/downlededFile');


const UserServices = require('../services/userservices');
const S3Services = require('../services/S3services');
const { query } = require('express');

exports.downloadExpense = async (req, res) =>{
    try{
   const expense = await UserServices.getExpenses(req);
   console.log(expense);
   const stringifiedExpenses = JSON.stringify(expense);

   const userId = req.user.id;
   const filename = `Expense${userId}/${new Date()}.txt`;
   const fileURL = await S3Services.uploadToS3(stringifiedExpenses, filename);
     
   DownloadedFile.create({
     url:fileURL,
     userId:req.user.id
  })
   res.status(200).json({fileURL, success:true});
 }catch(err){
    console.log(err);
    res.status(500).json({filename:'', success:false,err})
 }
}

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
    // try{
    //     console.log(req.query);
    //     const page=+req.query.page||1;
    //     const limit=+req.query.limit||5;


    //     const totalExpense=req.user.totalExpenses;


    //     console.log(">>>>>>>>>>",totalExpense);

    //   /*  const response=await Expense.findAll(); */
    //    /* const response =await Expense.findAll({where:{userId:req.user.id}}); */
    //    const total  = await req.user.getExpenses();

    //    const response =await req.user.getExpenses({
    //     offset:(page-1)*limit,
    //     limit:limit
    //    });

    //     res.status(200).json({message:response,
    //         success:true,
    //         currentpage:page,
    //         nextpage:page+1,
    //         previouspage:page-1,
    //         hasnextpage:limit*page<total.length,
    //         haspreviouspage:page>1,
    //         lastpage:Math.ceil(total.length/limit),
    //         totalExpense:totalExpense
    //     });
    // }
    // catch(err){
    //     console.log(">>>>>>>>",err)
    //     res.status(500).json({message:err,success:false});

    // }

    try{
    // const page = +req.query.page || 1;
    // let totalexpense;
        const expense = await req.user.getExpenses()
        return res.status(200).json({expense, success: true})
    
}catch(err){
    console.log(err)
}
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

// exports.deleteExpense = async (req, res)=>{
//     const t= await seqeilize.transaction();
//     const {expenseamount, description, category} = req.body;
//     const expenseid = req.params.expenseid;
//     try{
//       await Expense.destroy({where: {id: expenseid, userId : req.user.id},transaction:t});

//       const totalExpense=Number(req.user.totalExpenses)-Number(req.user.expenseamount);
//       await req.user.update({totalExpenses:totalExpense},{transaction:t});
//       await t.commit();
//       res.sendStatus(200);
//     } catch(err){
//         console.log(err);
//         await t.rollback();
//         res.status(500).json(err)
//     }
//  }      