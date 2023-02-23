const Expense = require('../models/expense');
const User = require('../models/user');
const seqeilize = require('../util/database');
const DownloadedFile = require('../models/downlededFile');
// const { BlobServiceClient } = require('@azure/storage-blob');
// const { v1: uuidv1} = require('uuid');

const UserServices = require('../services/userservices');
const S3Services = require('../services/S3services');

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
    try{
    req.user.getExpenses().then(expense =>{
        return res.status(200).json({expense, success: true})
    })
    .catch(err=>{
       return res.status(500).json({error: err, success: false})
    })
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
//     try{
//         const result = seqeilize.transaction(async(t) => {
//             const id = req.params.expenseid;
//             const expense = Expense.amount;
//             const expenseAmount = await Expense.findByPk(id);
//             const totalExpense= Number(req.user.totalExpense)- Number(expenseAmount);

//            //const response = await Promise.all({
//            await Expense.destroy({where: {transaction: t}}),
//            await  req.user.update({totalExpense:totalExpense}, {transaction: t})
//            //})
//            res.status(200).json(response[0]);
//            console.log('deleted')
//         })
//     } catch(err){
//         console.log(err);
//         res.status(500).json(err)
//     }
// // }
// exports.deleteExpense = async (req, res)=>{
//         const {expenseamount} = req.body
    
//         const t = await seqeilize.transaction();
//         const expenseid = req.params.expenseid;
//         try{
//           await Expense.destroy({where: {id: expenseid, userId : req.user.id}, transaction: t });
//           const totalExpense = Number(req.user.totalExpenses)- Number(expenseamount) 
//         await User.update({
//              totalExpenses: totalExpense
//           }, {
//             where : {id:req.user.id},
//             transaction: t
//         })
//          await t.commit();
//          console.log(totalExpense)
//         // res.status(200).json({expense:expense})
//           res.sendStatus(200);
//         } catch(err){
//             // console.log(err);
//             // res.status(500).json(err)
//             await t.rollback();
//             return res.status(500).json({success:false, error:err})
//         }
//     }
// exports.downloadExpenses =  async (req, res) => {

//     try {
//         if(!req.user.ispremiumuser){
//             return res.status(401).json({ success: false, message: 'User is not a premium User'})
//         }
//         const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING; // check this in the task. I have put mine. Never push it to github.
//         // Create the BlobServiceClient object which will be used to create a container client
//         const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

//         // V.V.V.Imp - Guys Create a unique name for the container
//         // Name them your "mailidexpensetracker" as there are other people also using the same storage

//         const containerName = 'prasadyash549yahooexpensetracker'; //this needs to be unique name

//         console.log('\nCreating container...');
//         console.log('\t', containerName);

//         // Get a reference to a container
//         const containerClient = await blobServiceClient.getContainerClient(containerName);

//         //check whether the container already exists or not
//         if(!containerClient.exists()){
//             // Create the container if the container doesnt exist
//             const createContainerResponse = await containerClient.create({ access: 'container'});
//             console.log("Container was created successfully. requestId: ", createContainerResponse.requestId);
//         }
//         // Create a unique name for the blob
//         const blobName = 'expenses' + uuidv1() + '.txt';

//         // Get a block blob client
//         const blockBlobClient = containerClient.getBlockBlobClient(blobName);

//         console.log('\nUploading to Azure storage as blob:\n\t', blobName);

//         // Upload data to the blob as a string
//         const data =  JSON.stringify(await req.user.getExpenses());

//         const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
//         console.log("Blob was uploaded successfully. requestId: ", JSON.stringify(uploadBlobResponse));

//         //We send the fileUrl so that the in the frontend we can do a click on this url and download the file
//         const fileUrl = `https://demostoragesharpener.blob.core.windows.net/${containerName}/${blobName}`;
//         res.status(201).json({ fileUrl, success: true}); // Set disposition and send it.
//     } catch(err) {
//         res.status(500).json({ error: err, success: false, message: 'Something went wrong'})
//     }

// };