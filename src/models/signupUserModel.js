const mongoose= require('mongoose');
const crypto=require('crypto');
const jwt = require('jsonwebtoken');

const signupUserSchema= new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    email:{
        index:true,
        type:String
    },
    hash:String,
    salt:String,
    userType:String
});

signupUserSchema.methods.setPassword=function(password){
    this.salt=crypto.randomBytes(16).toString('hex');
    this.hash=crypto.pbkdf2Sync(password,this.salt,10000,512,'sha512').toString('hex');
}
signupUserSchema.methods.validatePassword=function(password){
    const hash=crypto.pbkdf2Sync(password,this.salt,10000,512,'sha512').toString('hex');
    return this.hash===hash;
}

signupUserSchema.methods.generateJWT=function(){
    const today=new Date();
    const expirationDate=new Date(today);
    expirationDate.setDate(today.getDate()+1);
    return jwt.sign({
        email:this.email,
        id:this._id,
        exp:parseInt(expirationDate.getTime()/1000,10)
    },'secret');
}


var signupUserModel= mongoose.model('signupusers',signupUserSchema);
module.exports={signupUserModel};