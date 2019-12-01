const express = require("express")
const mongoose = require('mongoose')
const passport = require('passport')
const cookieParser = require("cookie-parser"); 
const session = require("express-session")
const exphbs = require("express-handlebars")
const bodyParser = require("body-parser")

//users models
require('./models/users')
require("./models/profile")


const main = require('./routes/main')

//load routes
const auth = require('./routes/auth')

const profile = require('./routes/profile')

//load keys
const keys = require('./keys')

//map global promises
mongoose.Promise = global.Promise; 

//Mongoose
mongoose.connect(keys.mongoURI, {
    useMongoClient:true
})
.then(()=> console.log("MongoDB Connected"))

.catch(err=>console.log(err))

//passport config
require('./passport')(passport)

const app = express(); 


//bodyParser
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())



//handlebars
app.engine('handlebars', exphbs({
    defaultLayout:'main'
})); 
app.set('view engine', 'handlebars')


//Defines port
const port = process.env.PORT || 5000; 


//cookie parser middleware
app.use(cookieParser()); 

//session middleware
app.use(session({
    secret: 'secret', 
    resave: false, 
    saveUninitialized: false
}))


//Passport Middleware
app.use(passport.initialize()); 
app.use(passport.session()); 

//Set Global veriables
app.use((req,res, next)=>{
    res.locals.user = req.user || null; 
    next()
})

//use Routes
app.use('/', main)
app.use('/auth', auth)
app.use('/profile', profile)
app.use(express.static('public'));

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`)
})


app.listen(); 