var express=require('express');
var apiRoutes=express.Router();

var passport=require('passport');
var jwt=require('jsonwebtoken');

var User=require('../app/models/user');
var config=require('../config/main');

const auth = require('../config/middlewares/authorization');

//Register new users
apiRoutes.post('/register',function(req,res){
  console.log('req==',req.body)
  if(!req.body.email || !req.body.password){
    res.json({success:false,message:'Please enter email and password to register'});
  }
  else{
    var newUser=new User({
      email:req.body.email,
      password:req.body.password
    });

    //Attempt to save new user
    newUser.save(function(err){
      if(err){
        return res.json({success:false,message:'That email address already exists'});
      }
      res.json({success:true,message:'Successfully created new user'});
    });
  }
});

//Authenticate the user and get a JWT
apiRoutes.post('/authenticate',function(req,res){
  User.findOne({
    email:req.body.email
  },function(err,user){
      if(err) throw err;
      if(!user){
        res.send({success:false,message:'Authenticate failed, user not found'});
      }
      else {
        //check if password matches
        user.comparePassword(req.body.password,function(err,isMatch){
          if(isMatch && !err){
            //Create token
            var token = jwt.sign({email:user.email}, config.secret,{
              expiresIn:10080
            });
            res.json({success:true,token:token}); //Note: It’s important the Auth header starts with JWT and a whitespace followed by the token, else passport-jwt will not extract it.
          }
          else {
            res.send({success:false,message:'Authenticate failed, password did not found'});        }
        })
      }
  })
});


apiRoutes.get('/logout',function(req,res){
  req.logout();
  res.send('You are succesfully logged out.');
})

//Protect dashboard route with JWT
// apiRoutes.get('/dashboard', passport.authenticate('jwt',{ session: false}),function(req,res){
//   res.send('It worked! user id is: '+ req.user._id + '.');
// });

apiRoutes.get('/dashboard',auth.authorizeUser, function(req, res) {
   res.json({ id:req.user._id,message:'success',code:200});
});

apiRoutes.get('/home',auth.authorizeUser, function(req, res) {
   res.json({ message: 'Welcome to home page',code:200});
});


module.exports=apiRoutes;
