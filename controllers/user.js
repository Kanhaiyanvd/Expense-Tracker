const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function isstringinvalid(string){
    if(string == undefined || string.length === 0){
         return true
    }
    else{
        return false
    }
}

exports.postSignup = async(req, res, next) => {
    try{
        const {name, email, password} = req.body;
        if (isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(password)){
            return res.status(400).json({err: "something is missing!!"})
        }
        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err, hash) => {
            console.log(err);
            await User.create({name, email, password:hash})
        res.status(201).json({message: "successfully created new user"})
        })
    }catch(err) {
        res.status(500).json(err);
    }
}
const generatetoAccessToken = (id, name,ispremiumuser)=>{
    return jwt.sign({ userId: id , name: name, ispremiumuser}, 'secretkey');
}

exports.postLogin = async(req, res, next) => {
    try{
        const{email, password} = req.body;
        if (isstringinvalid(email) || isstringinvalid(password)){
            return res.status(400).json({message:"Email or Password is missing!!"})
        }
        const user = await User.findAll({ where: {email}})
        if(user.length > 0){
            bcrypt.compare(password, user[0].password, (err, result) => {
                if(err){
                    throw new Error('Something went wrong')
                }
                if (result === true){
                    res.status(200).json({success: true, message: "User logged in successfully", token: generatetoAccessToken(user[0].id, user[0].name, user[0].ispremiumuser)})   
                }
                else{
                    return res.status(400).json({success: false, message: "Password is incorrect"})
                }
            })
        }else{
            return res.status(404).json({success: false, message: "User does not exist"})
        } 
    }catch(err){
        res.status(500).json({message: err, success: false})
    }
}
