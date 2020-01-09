const { signupUserModel } = require('../models/signupUserModel');

function userAuth(id) {
    console.log("called me :" + id)
    return new Promise(function (resolve, reject) {


        signupUserModel.findById(id, (err, result) => {
            if (!err && result) {
                resolve(result.userType);
                // console.log("resolve")
            }
            // else if (!result) {
            //     registerUserModel.findById(id, (err, result) => {
            //         if (!err && result) {
            //             console.log("usertype"+result.userType);
            //             resolve(result.userType);

            //         }
            //         else{
            //             reject();
            //         }
            //     });
            // }
            else{
                // console.log("reject")
            reject();}
        });



    });

}


module.exports = userAuth;