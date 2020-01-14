var express = require('express');
var noteRouter = express.Router();
var { noteModel } = require('../models/noteModel');
const userAuth = require('./userAuth');
const auth = require('./auth');


function route() {
        //Admin & user
        noteRouter.route('/')
        .post(auth.required, (req, res) => {
            res.header("Access-Control-Allow-Origin", "*")
            res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
            userAuth(req.body.userId).then((user) => {
                if (user == "admin" || user== "user") {
                    // console.log("noteeeeeeeeeeeeeeeeeee")
                    noteModel.find((err, result) => {
                        // var data=(result[0].note)
                        // console.log(result)
                        if (err) 
                            return res.json({ Status: "Error" });
                        else
                            return res.json( result[0].note);
                    });
                }
                else 
                    return res.json({ Status: "Error" });
            }).catch((err) => {
                res.json({ Status: "Error" });
            });
        });

        //Admin
    noteRouter.route('/newNote')
    .post(auth.required, (req, res) => {
        console.log("aut")
        res.header("Access-Control-Allow-Origin", "*")
        res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
        userAuth(req.body.userId).then((user) => {
            console.log(user)
            if (user == "admin") {
                console.log("admin aan")
                var note = req.body
                var note = new noteModel(note);
                console.log("note to add"+note)
                // '5e17272232f80d11741cff58',{ $set : {note:note.note } },
                noteModel.findByIdAndUpdate('5e17272232f80d11741cff58',{ $set : {note:note.note } }, (err, result) => {
                    if (err) 
                        return res.json({ Status: "save Error" });
                    else
                        return res.json({ Status: "Success" });
                });
            }
            else 
                return res.json({ Status: "admin Error" });
        }).catch((err) => {
            res.json({ Status: "catch Error" });
        });
    });

    
    return noteRouter;

}
module.exports = route;


