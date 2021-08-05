const {Cineplex}=require('../models')
const {upload}=require('./addfile')
var multer  = require('multer');
const sharp = require('sharp');
const path=require('path');
const { read } = require('fs');

const addCineplex=async(req,res)=>{
    try{
        
        const {name}=req.body
        let logo=req.file?`/uploads/cineplex/${req.file.filename}`:null
        
        const isexist=await Cineplex.findOne({where:{name}})
        if(isexist){
            req.flash('danger','Cineplex is exist')
            return res.render('admin/cineplex/addCineplex',{name})
        }
        const newCineplex=await Cineplex.create({name,logo})
        req.flash('success','Cineplex is created')
        res.redirect('/api/admin/cineplex/cineplexes')
    }catch(error){console.log(error)}
    
       
}
const getAddCineplex=(req,res)=>{
    res.render('admin/cineplex/addCineplex',{name:''})
}

const uploadCineplexlogo=upload.single('cineplex_logo')
const getAllCineplexes=async()=>{
    const cineplexes=await Cineplex.findAll()
    return cineplexes

}
const getCineplex=async(req,res)=>{
    let cineplexes=await getAllCineplexes()
    
    res.render('admin/cineplex/cineplexes',{cineplexes})
}
const deleteCineplex=async(req,res)=>{
    try{
        let cineplex=await Cineplex.findByPk(req.params.id)
        if(!cineplex){
            return res.redirect('/api/admin/cineplex/cineplexes')
        }
        await Cineplex.destroy({where:{id:req.params.id}}) 
        req.flash('success', 'delete successfully')
        res.redirect('/api/admin/cineplex/cineplexes')
    }catch(error){console.log(error)}
    
}
const getEditCineplex=async(req,res)=>{
    try{
        const cineplex=await Cineplex.findByPk(req.params.id)
        if(!cineplex){
            req.flash('danger', 'cannot find')
            return res.redirect('/api/admin/cineplex/cineplexes')
        }
        let {id,name,logo:oldLogo}=cineplex
        console.log(name)
        res.render('admin/cineplex/editCineplex',{name,oldLogo,id})
    }catch(error){console.log(error)}
    
}
const editCineplex=async(req,res)=>{
    try{
        let cineplex=await Cineplex.findByPk(req.params.id)
        if(!cineplex){
            res.redirect('/api/admin/cineplex/cineplexes')
        }
        let logo=req.file?`/uploads/cineplex/${req.file.filename}`:cineplex.logo
        if(!req.body.name){
            req.flash('danger','please provide name')
            return res.render('admin/cineplex/editCineplex',{name:'',oldLogo:logo,id:req.params.id})
        }
        let {name,id}=req.body
        let isexist=await Cineplex.findOne({where:{name}})
        if(isexist && isexist.id!==cineplex.id){
            req.flash('danger','Cineplex name is exist')
            return res.render('admin/cineplex/editCineplex',{name,oldLogo:logo,id})
        }
        await Cineplex.update({name,logo},{where:{id:req.params.id}})
        req.flash('success','cineplex updated')
        res.redirect('/api/admin/cineplex/cineplexes')
    }catch(error){
        console.log(error)
    }
}

module.exports={getAddCineplex,addCineplex,uploadCineplexlogo,getCineplex,deleteCineplex,getEditCineplex,editCineplex,getAllCineplexes}