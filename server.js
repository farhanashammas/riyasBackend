const express= require('express');
var app= new express();
const bodyParser=require('body-parser');
const cors=require('cors');
const path=require('path');
const mongoose=require('mongoose');

mongoose.Promise=global.Promise;

require('./src/config/config');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(express.static(path.join(__dirname,"/public")));

const signupUserRouter=require('./src/routers/signupUserRouter')()
const loginRouter=require('./src/routers/loginRouter')()
const productRouter=require('./src/routers/productRouter')()

app.use('/signupUser',signupUserRouter);
app.use('/login',loginRouter);
app.use('/products',productRouter)

const uri="mongodb+srv://farhana:farhana@cluster0-o93hy.mongodb.net/test?retryWrites=true&w=majority"


mongoose.connect("mongodb://localhost:27017/mobitech");
// mongoose.connect(uri)
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
// var db=mongoose.connection;
// db.on('error',(error)=>{
//     console.log(error);
// });
// db.once('open',()=>{
//     console.log("Success");
// })
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

app.set('view engine', 'ejs');

// set the home page route
app.get('/', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    // ejs render automatically looks in the views folder
    res.render('index');
});


app.listen(3000, () => {
    console.log(__dirname)
  console.log('listening on port 3000!')
});

