const { signupUserModel } = require('../models/signupUserModel');
// const { registerUserModel } = require('../models/registerUserModel');


function userAuth(id) {
    console.log("called me :" + id)
    return new Promise(function (resolve, reject) {

        signupUserModel.findById(id, (err, result) => {
            if (!err && result) {
                console.log("resolve")
                resolve(result.userType);
            }
            // else if (!result) {
            //     registerUserModel.findById(id, (err, result) => {
            //         if (!err && result) {
            //             console.log(result.userType);
            //             resolve(result.userType);

            //         }
            //         else{
            //             reject();
            //         }
            //     });
            // }
            else{
                console.log("reject")
            reject();}
        });



    });

}


module.exports = userAuth;