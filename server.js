var express=require('express');
var app=express();
var mongoose=require('mongoose');
mongoose.Promise = require('bluebird');
var bodyParser=require('body-parser');
var morgan=require('morgan');
var passport=require('passport');

var config=require('./config/main');
var apiRoutes=require('./routes/users');

var port=3000;

//Use body-parser to get POST requests for API use
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//log requests to console
app.use(morgan('dev'));

//Initialize passport for use
app.use(passport.initialize());

//connect to db
mongoose.connect(config.database, {useMongoClient:true});

//Bring in passport stategy
require('./config/passport')(passport);

//Connect to db
mongoose.connect(config.database, {useMongoClient:true});

//Set url for API group routes
app.use('/api',apiRoutes);

//Home route
app.get('/',function(req,res){
  res.send('Relax. We will put the home page here later.');
});

app.listen(port);
console.log('Your server is running on port '+port+ '. ');
