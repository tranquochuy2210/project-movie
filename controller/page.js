const {Page}=require('../models')
const getPages=async(req,res)=>{
    try{
        let pages=await Page.findAll()
        res.render('admin/page/page',{pages})
    }catch(error){
        console.log(error)
    }
    
}
const getEditPage=async(req,res)=>{
    try{
        let id =req.params.id
        let page=await Page.findByPk(id)
        if(!page){
            req.flash('danger','không tìm thấy trang')
            return res.redirect('/api/admin/page/pages')
        }
        let {title,slug,content}=page
        res.render('admin/page/editpage',{id,title,slug,content})
    }catch(error){
        console.log(error)
    }
}
const editPage=async(req,res)=>{
    try{
        let id =req.params.id
        let page=await Page.findByPk(id)
        let title=req.body.title
        let slug=req.body.slug?req.body.slug:title
        slug=slug.replace(/\s+/g,'-')
        let content=req.body.content
        if(!page){
            req.flash('danger','không tìm thấy trang')
            return res.redirect('/api/admin/page/pages')
        }
        const isExist=await Page.findOne({where:{slug}})
        if(isExist && id != isExist.id){
            req.flash('danger','slug đã tồn tại')
            return res.render('admin/page/addpage',{title,slug,content})
        }
        await page.update({content,title,slug})
        req.flash('success','chỉnh sửa trang thành công')
        res.redirect('/api/admin/page/pages')
    }catch(error){
        console.log(error)
    }
    
}
const getAddPage=(req,res)=>{
    let title=''
    let content=''
    let slug=''
    res.render('admin/page/addPage',{title,content,slug})
}
const addPage=async(req,res)=>{
    let title=req.body.title
    let slug=req.body.slug?req.body.slug:title
    slug=slug.replace(/\s+/g,'-')
    let content=req.body.content

    try{
        let isExist=await Page.findOne({where:{slug}})
      
        if(isExist){
            req.flash('danger','Page đã tồn tại')
            return res.render('admin/page/addpage',{title,slug,content})
        }
        await Page.create({title,slug,content})
        req.flash('success','Page đã được tạo')
        res.redirect('/api/admin/page/pages')
    }catch(error){console.log(error)}
}
const deletePage=async(req,res)=>{
    try{
        let id =req.params.id
        let page=await Page.findByPk(id)
        if(!page){
            req.flash('danger','không tìm thấy trang')
            return res.redirect('/api/admin/page/pages')
        }
        await page.destroy()
        req.flash('success','xóa trang thành công')
    }catch(error){
        console.log(error)
    }
}


module.exports={getPages,getAddPage,addPage,editPage,getEditPage,deletePage}