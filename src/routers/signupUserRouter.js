var express = require('express');
var { signupUserModel } = require('../models/signupUserModel');
var signupUserRouter = express.Router();
const auth = require('./auth');
const userAuth = require('./userAuth');

function route() {

    signupUserRouter.route('/')
        .post(auth.optional, (req, res) => {
            console.log(req.body)
            res.header("Access-Control-Allow-Origin", "*")
            res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
            signupUserModel.findOne({ email: req.body.email }).then((result)=>{
                console.log("sign")
                if(!result){
                    console.log("signup")
                            const finalUser = new signupUserModel(req.body);
                            // finalUser.userType="admin";
                             finalUser.setPassword(req.body.password);
                             finalUser.save((err, result) => {
                                 if (err) {
                                     res.json({ Status: "Error" });
                                 }
                                 else {
         
                                     console.log(result);
                                     res.json({ Status: "Success" });
                                 }
                             });
                        }
                        else{
                            res.json({ Status: "User Already Exist" });
                        }
                
            }).catch((err)=>{
                console.log("err")
                res.json({Status:"Error"})
            });
               
        });

         
    signupUserRouter.route('/users')
    .post(auth.required, (req, res) => {
        res.header("Access-Control-Allow-Origin", "*")
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
        signupUserModel.find({}, null, { sort: { _id: -1 }},(err, result) => {
            if (err || !result) 
                res.json({ Status: "Error" })
            else {
                console.log("rs :" + result)
                var data = new signupUserModel(result);
                let i = [];
                for (user of result) {
                    let itemModel = {
                            userName: user.userName,
                            email:user.email,
                            userType:user.userType,
                            phone:user.phone,
                            _id: user._id,
                    }
                    console.log(itemModel)
                    i.push(itemModel);
                }
                data = i;
                res.json({  data });
            }
        });
    });

    signupUserRouter.route('/deleteItem')
    .post(auth.required, (req, res) => {
        res.header("Access-Control-Allow-Origin", "*")
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
        userAuth(req.body.userId).then((user) => {
            if (user == "admin") {
                var itemId = req.body.itemId;
                signupUserModel.findByIdAndDelete( itemId, (err, result) => {
                    if (err) 
                        return res.json({ Status: "Error" });
                    else
                        return res.json({ Status: "Success" });
                });
            }
            else 
                return res.json({ Status: "Error" });
        }).catch((err) => {
            res.json({ Status: "Error" });
        });
    });


    
    



    return signupUserRouter;
}
module.exports = route;
