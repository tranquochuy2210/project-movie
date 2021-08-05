const {Cinema,Cineplex,Movie}=require('../models')
const {getAllCineplexes}=require('./cineplex')
const {upload}=require('./addfile')
const {}=require('./cinema_movie')
const uploadCinemaImg=upload.single('cinema_img')


const addCinema=async (req,res)=>{
    try{
        let {name,address,cineplexId}=req.body
        if(!name){
            req.flash('danger',"cinema name must be provided")
            return res.render('admin/cinema/addcinema',{name,cineplexes,address})
        }
        let isExist=await Cinema.findOne({where:{name}})
        if(isExist){
            let cineplexes=await getAllCineplexes()
            req.flash('danger',"cinema name is exist")
            return res.render('admin/cinema/addcinema',{name,cineplexes,address})
        }
        let image=req.file?`/uploads/cinema/${req.file.filename}`:null
        const newCinema=await Cinema.create({name,address,image,cineplexId})
        req.flash('success','cinema is created')
        res.redirect('/api/admin/cinema/cinemas')

    }catch(error){console.log(error)}
}
const getAddCinema=async (req,res)=>{
    try{
        let name=''
        let address=''
        let cinema_img=''
        let cineplexId=''
        let cineplexes=await getAllCineplexes()
        res.render('admin/cinema/addcinema',{name,address,cinema_img,cineplexId,cineplexes})
    }catch(error){console.log(error)}
    
}
const getAllCinemas=async (req,res)=>{
    try{
        let cinemas=await Cinema.findAll()
        return cinemas
    }catch(error){
        console.log(error)
    }
}

const showCinemas=async (req,res)=>{
    try{
        let cinemas=await Cinema.findAll({include: Cineplex})
        res.render('admin/cinema/cinemas',{cinemas})
     
        
    }catch(error){
        console.log(error)
    }  
}

const deleteCinema=async (req,res)=>{
    let cinema=await Cinema.findByPk(req.params.id)
    if(!cinema){
        req.flash('danger','unable to find cinema')
        return res.redirect('/api/admin/cinema/cinemas')
    }
    await Cinema.destroy({where:{id:req.params.id}})
    req.flash('success','delete complete')
    res.redirect('/api/admin/cinema/cinemas')
}
const editCinema=async (req,res)=>{
    try{
        console.log(req.body)
        let id=req.params.id
        let cinema=await Cinema.findByPk(id)
        if(!cinema){
            req.flash('danger','can not find cinema')
            return res.redirect('api/admin/cinema/cinemas')
        }
        let {name,address,cineplexId}=req.body
        let cineplexes=await getAllCineplexes()
        if(!name){
            req.flash('danger',"cinema name must be provided")
            return res.render('admin/cinema/editcinema',{name,cineplexes,old_image:cinema.image,address,id})
        }
        let isExist=await Cinema.findOne({where:{name}})
        if(isExist && isExist.id!=id){

            req.flash('danger',"cinema name is exist")
            return res.render('admin/cinema/addcinema',{name,cineplexes,old_image:cinema.image,address,id})
        }
        let image=req.file?`/uploads/cinema/${req.file.filename}`:cinema.image
        await Cinema.update({name,address,image,cineplexId},{where:{id}})
        req.flash('success','cinema is updated')
        res.redirect('/api/admin/cinema/cinemas')  
    }catch(error){console.log(error)}
    
}
const getEditCinema=async(req,res)=>{
    let cinema=await Cinema.findByPk(req.params.id)
    if(!cinema){
        req.flash('danger','can not find cinema')
        return res.redirect('api/admin/cinema/cinemas')
    }
    const {id,name,address,image:old_image,cineplexId}=cinema
    let cineplexes=await getAllCineplexes()
    res.render('admin/cinema/editCinema',{id,name,address,old_image,cineplexes,cineplexId})

}


module.exports={addCinema,showCinemas,getAddCinema,uploadCinemaImg,deleteCinema,editCinema,getEditCinema,getAllCinemas}