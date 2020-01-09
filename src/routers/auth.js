// const jwt = require('express-jwt');

// const getTokenFromHeaders = (req) => {
//     const { headers: { authorization } } = req;

//     //header b header:{authorization:Token 1234fdsfefsfs}
//     if (authorization && authorization.split(' ')[0] === 'Token') {
//         return authorization.split(' ')[1];
//     }
//     // console.log("no")
//     return null;
// }


// const auth = {
//     required: jwt({
//         secret: 'secret',
//         userProperty: 'payload',
//         getToken: getTokenFromHeaders
//     }),
//     optional: jwt({
//         secret: 'secret',
//         userProperty: 'payload',
//         getToken: getTokenFromHeaders,
//         credentialsRequired: false
//     })
// }

// module.exports = auth;


const jwt = require('express-jwt');

const getTokenFromHeaders = (req) => {
    const { headers: { authorization } } = req;

    //header b header:{authorization:Token 1234fdsfefsfs}
    if (authorization && authorization.split(' ')[0] === 'Token') {
        return authorization.split(' ')[1];
    }
    // console.log("no")
    return null;
}


const auth = {
    required: jwt({
        secret: 'secret',
        userProperty: 'payload',
        getToken: getTokenFromHeaders
    }),
    optional: jwt({
        secret: 'secret',
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
        credentialsRequired: false
    })
}

module.exports = auth;


