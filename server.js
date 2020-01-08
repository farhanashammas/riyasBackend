const express = require('express');
var app = new express();
const chalk = require('chalk');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

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

process.on('uncaughtException', (err) => {
    console.error('There was an uncaught error', err)
    process.exit(1) //mandatory (as per the Node docs)
})

app.listen(process.env.PORT || 3000,()=>{
    console.log("Listening to port "+chalk.green('3000'))
});


