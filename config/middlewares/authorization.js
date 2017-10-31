const passport = require('passport');
var jwt=require('jsonwebtoken');

var User=require('../../app/models/user');
var config=require('../main');

exports.authorizeUser = function (req, res, next) {
    // passport.authenticate('jwt',{ session: false}, function (error, user, info) {
    //     if (error) return res.json({ message: error,code:400 });
    //     if (!user)
    //         return res.json({ message: 'Authentication failed',code:400});
    //         console.log('user333333333333333',user)

    //     next();
    // })(req, res);


    var token = req.headers.authorization;
    jwt.verify(token,config.secret, function(err, decoded) {
        if (err){
            return res.json({ message: err,code:400 });
        }

        if(decoded){
            User.findOne({
                email:decoded.email
            },function(err,user){
                if(err) throw err;
                if(!user){
                    res.send({success:false,message:'User not found'});
                }
                console.log("User from DB:  ",user)
                req.user=user;
                 next();
            });
        }else{
            return res.json({ message: 'session expired',code:400 }); 
        }
        
    });
}