var express = require('express');
const passport = require('passport');
// var { registerUserModel } = require('../models/registerUserModel');
var { signupUserModel } = require('../models/signupUserModel');
const auth = require('./auth');
var loginRouter = express.Router();

function route() {

    loginRouter.route('/')
        .post(auth.optional, (req, res,next) => {
            console.log("Inside login");
            if (req.body.userType == "user" || req.body.userType == "admin") {

                
                return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
                    if (err) {
                        return next(err);
                    }
                    if (passportUser && passportUser.userType!="restaurant") {
                        //const user=passportUser;
                        //user.token=passportUser.generateToken();
                        
                        var user=new signupUserModel(passportUser);
                        console.log("user"+user);

                        return res.json({
                            Status:"Success",
                            Token: user.generateJWT(),
                            userId: user._id,
                            name: user.userName,
                            userType:user.userType
                        });
                    }
                    return res.json({ Status: "Invalid" });
                })(req,res,next);
            }
            else {

               return res.json({ Status: "Error" });
            }

        });
    return loginRouter;

}
module.exports = route;


