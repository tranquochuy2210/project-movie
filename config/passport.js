const localStrategy=require('passport-local').Strategy
const bcrypt=require('bcrypt')
const {User}=require('../models')
const passport=require('passport')


const verifyCallback=async(email,password,done)=>{
    try{    
        const user = await User.findOne({where:{email}})      
        if(!user){
            
            return done(null,false,{message:'sai email'})
        }
        const isvalid=await bcrypt.compare(password,user.password)
        if(!isvalid){
            return done(null,false,{message:'sai mật khẩu'})}
        return done(null,user)
    }catch(error){console.log(error)}

   }


passport.serializeUser(function(user, done) {
        done(null, user);
      });   
passport.deserializeUser(function(user, done) {       
        return(done(null,user))
      });


const strategy=new localStrategy({usernameField:'email',passwordField:'password'},verifyCallback)

passport.use(strategy)


