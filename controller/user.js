const {op, where} = require('sequelize')
const {User,Movie}=require('../models')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const moment=require('moment')
// const authenticate=require('../middleware/auth/verifytoken')
const createAdmin=async (req,res)=>{
    try{
        
    const isexist=await User.findOne({where:{email:req.body.email}})
    
    if(isexist!==null){
        return res.send('email exist')}
        const {email,name,password,phone,age}=req.body
        const salt=await bcrypt.genSalt(10)
        const hashpassword=await bcrypt.hash(password,salt)
        const newuser=await User.create({email,name,password:hashpassword,phone,age,role:"Admin"})
    res.redirect('homepage')}catch(error){console.log(error)}
   
}
const getAllUser=async(req,res)=>{
    try{
        const users=await User.findAll()
        res.render('admin/user/users',{users})
    }catch(error){console.log(error)}
}

const getUser=async(req,res)=>{
    try{
        const user=await User.findByPk(
            req.params.id)
            
        if(!user){
            req.flash('danger','nguoi dung khong ton tai')
            return res.redirect('/api/admin/user/users')}
        const {name,age,email,role,phone,avatar}=user
        let createdAt=moment(user.createdAt).format('MMM Do YY')
        res.render('admin/user/userProfile',{name,age,email,role,phone,avatar,createdAt})
    }catch(error){console.log(error)}
}
const deleteUser=async(req,res)=>{
    try{const {id}=req.params
        
        await User.destroy({where:{id}})
        res.send('xoa thanh cong')
    }catch(error){console.log(error)}
}

const updateUser=async(req,res)=>{
    try{
        const user=await User.findOne(
            {where:{id:req.params.id}}
        )
        const update={name,age,email,role,phone,password}=req.body
        for (key in Object.key(update)){
            user[key]=update[key]
        }
        user.save()
        res.send(user)
      
       
    }catch(error){console.log(error)}
}

const getHomePage=async (req,res)=>{
    const movies=await Movie.findAll()
    res.render('admin/homepage',{movies,user:req.user})
}

const uploadAvatar=(req,res,next)=>{
    
}
const createClient=async (req,res)=>{
    try{
        
    const isexist=await User.findOne({where:{email:req.body.email}})
    
    if(isexist!==null){
        return res.send('email exist')}
        const {email,name,password,phone,age}=req.body
        const salt=await bcrypt.genSalt(10)
        const hashpassword=await bcrypt.hash(password,salt)
        const newuser=await User.create({email,name,password:hashpassword,phone,age,role:"Client"})
        
 
    res.redirect('homepage')}catch(error){console.log(error)}
   
}





module.exports={createClient,createAdmin,getAllUser,deleteUser,updateUser,getUser,uploadAvatar,getHomePage}