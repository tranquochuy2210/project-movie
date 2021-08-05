const {Movie,Cinema,Cinema_movie,Showtime}=require('../models')
const{upload}=require('./addfile')
const {getAllCinemas}=require('./cinema')
const {getCinemaByMovie}=require('./cinema_movie')



const getAddMovie=(req,res)=>{
    let name=''
    let startDate=''
    let time=''
    let evaluate=''
    let trailer=''
    let description
    res.render('admin/movie/addmovie',{name,startDate,time,evaluate,trailer,description})
}

const showMovie=async (req,res)=>{
    try{
        let movies=await Movie.findAll()
        for (let movie of movies){
            movie.cinemas=[]
            let cinemas_movie=await Cinema_movie.findAll({where:{movieId:movie.id},include:[{model:Cinema}]})
            cinemas_movie.forEach((cinema)=>{
                movie.cinemas.push(cinema.Cinema.name)
            })
        }
        let cinemas=await getAllCinemas()
        res.render('admin/movie/movies',{movies,cinemas,getCinemaByMovie})
    }catch(error){
        console.log(error)
    }
    
}
const addMovie=async(req,res)=>{
    let {name,time,startDate,evaluate,trailer,description}=req.body
    try{
      
        const isexist=await Movie.findOne({where:{name}})
        if(isexist!==null){
            return res.send('name exist')}
        let poster=req.file?`/uploads/movie/${req.file.filename}`:null
        const newMovie=await Movie.create({name,time,startDate,evaluate,poster,trailer,description}) 
        res.redirect('movies')
    }catch(error){console.log(error)}
}
// const getMovie=async(req,res)=>{
//     const movies=Movie.findAll()
//     res.send(movies)
// }
const getEditMovie=async (req,res)=>{
    try{
       
        const movie=await Movie.findByPk(req.params.id)
        
        let {name,time,evaluate,poster:old_poster,trailer,description}=movie
        let startDate=movie.startDate.split('/').reverse().join('-')
        return res.render('admin/movie/editmovie',{id:req.params.id,name,startDate,time,evaluate,old_poster,trailer,description})
    }catch(error){console.log(error)}
    
}
const editMovie=async(req,res)=>{
    try{
        let id =req.params.id
        const {name,startDate,time,evaluate,trailer,description}=req.body
        const isNameExist=await Movie.findByPk(id)
        let poster=req.file?`/uploads/movie/${req.file.filename}`:isNameExist.poster
   
        if(isNameExist && isNameExist.id!=id)
        {
            req.flash('error','Name is Exist')
            return res.redirect(`/api/adminmovie/edit/${id}`)
        }
        await Movie.update({name,startDate,time,evaluate,poster,trailer,description},{where:{id}})
        res.redirect('/api/admin/movie/movies')
    }catch(error){console.log(error)}
}
const deleteMovie=async (req,res)=>{
    try{let id=req.params.id
        let isExist=await Movie.findByPk(id)
        
        if(!isExist){
            req.flash('danger','movie isn\'t exist')
            res.redirect('/api/admin/movie/movies')
        }
        let name=isExist.name
        await isExist.destroy()
        await
        req.flash('success',`movie ${name} is deleted`)
        res.redirect('/api/admin/movie/movies')
    }catch(error){
        console.log(error)
    }
    

}

const uploadMoviePoster=upload.single('movie_poster')

module.exports={getAddMovie,addMovie,getEditMovie,editMovie,uploadMoviePoster,showMovie,deleteMovie}