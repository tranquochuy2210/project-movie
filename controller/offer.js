const {Offer}=require('../models')
const {upload}=require('./addfile')
const getOffer=async(req,res)=>{
    let offers=await Offer.findAll()
res.render('admin/offer/offers',{offers})
}
const getAddOffer=async(req,res)=>{
    let image=''
    let name=''
    let description=''
    let public=true
    res.render('admin/offer/addoffer',{image,name,description,public})
}
const addOffer=async (req,res)=>{
    try{
        let {name,description,public}=req.body
        public=public?true:false
        let image=req.file?`/uploads/offer/${req.file.filename}`:null
        await Offer.create({name,image,description,public})
        req.flash('success','đã thêm Khuyến mãi thành công')
        res.redirect('/api/admin/offer/offers')
    }catch(error){console.log(error)}
    
}
const getEditOffer=async(req,res)=>{
    try{
        let id=req.params.id
        let offer=await Offer.findByPk(id)
        if(!offer){
            req.flash('danger','khong the tim thay offer')
            res.redirect('/api/admin/offer/offers')
        }
        
        let {image,description,name,public}=offer
        console.log(public)
        res.render('admin/offer/editoffer',{image,description,name,public,id})
        
    }catch(error){
        console.log(error)
    }
}
const editOffer=async(req,res)=>{
try{
    let id=req.params.id
    let offer=await Offer.findByPk(id)
    if(!offer){
        req.flash('danger','khong the tim thay offer')
        res.redirect('/api/admin/offer/offers')
    }
    let {image,description,name}=req.body
    let public=req.body.public?true:false
    await offer.update({image,description,name,public})
    req.flash('success','update thanh cong')
    res.redirect('/api/admin/offer/offers')

}catch(error){
    console.log(error)
}
}
const getOfferImage=upload.single('offer_image')
const deleteOffer=async(req,res)=>{
    try{
        let id=req.params.id
    let offer=await Offer.findByPk(id)
    if(!offer){
        req.flash('danger','khong the tim thay offer')
        res.redirect('/api/admin/offer/offers')
    }
    await offer.destroy()
    req.flash('success','xóa thanh cong')
    res.redirect('/api/admin/offer/offers')
    }catch(error){
        console.log(error)
    }
}
module.exports={getOffer,getAddOffer,addOffer,getEditOffer,editOffer,getOfferImage,deleteOffer}