
const isAuth=(req,res,next)=>{
    if(req.isAuthenticated()){
        next()
    }else{
        res.status(401).redirect('/login')
    }
}
const isAdmin=(req,res,next)=>{

    if(req.isAuthenticated() && req.user.role==='Admin'){
        next()
    }
    else{
        res.redirect('/api/admin/login')}

}
module.exports={isAuth,isAdmin}