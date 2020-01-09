const express = require('express');
var app = new express();
const chalk = require('chalk');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const userAuth = require('./src/routers/userAuth');

mongoose.Promise=global.Promise;

require('./src/config/config');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, "/public")));

const signupUserRouter= require('./src/routers/signupUserRouter')();
const loginRouter= require('./src/routers/loginRouter')();
const productRouter=require('./src/routers/productRouter')();
var { noteModel } = require('./src/models/noteModel');
const auth = require('./src/routers/auth');

app.use('/signupUser',signupUserRouter);
app.use('/login',loginRouter);
app.use('/products',productRouter);

const uri="mongodb+srv://farhana:farhana@cluster0-o93hy.mongodb.net/test?retryWrites=true&w=majority"
mongoose.connect(uri);
// mongoose.connect("mongodb://localhost:27017/mobitech");
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connection.on('connected', function() {
        // Hack the database back to the right one, because when using mongodb+srv as protocol.
        if (mongoose.connection.client.s.url.startsWith('mongodb+srv')) {
            mongoose.connection.db = mongoose.connection.client.db('mobitech');
        }
        console.log('Connection to Mongo established.')
    });


        //Admin & user
        app.route('/note')
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
    app.route('/newNote')
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
    

process.on('uncaughtException', (err) => {
    console.error('There was an uncaught error', err)
    process.exit(1) //mandatory (as per the Node docs)
})

app.listen(process.env.PORT || 3000,()=>{
    console.log("Listening to port "+chalk.green('3000'))
});


