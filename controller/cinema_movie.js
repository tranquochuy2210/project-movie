const {Cinema_movie,Cinema,Movie}=require('../models')

const addCinemaMovie=async(req,res)=>{
    const {cinemaId,movieId}=req.body
    let isExist=await Cinema_movie.findOne({where:{cinemaId,movieId}})
  
    if(isExist){
        req.flash('danger','movie is showed in this cinema')
        return res.redirect('cinemamovies')
    }
    await Cinema_movie.create({cinemaId,movieId})
    req.flash('success','now cinema can show this movie ')
    res.redirect('cinemamovies')
}

const getCinemaMovie=async(req,res)=>{
    let cinemas_movies=await Cinema_movie.findAll({include:[{model:Cinema},{model:Movie}]})
    cinemas_movies.sort((a,b)=>a.Movie.name-b.Movie.name)
    console.log(cinemas_movies)
    let cinemas=await Cinema.findAll()
    let movies=await Movie.findAll()
    res.render('admin/cinema_movie/cinema_movie',{cinemas_movies,cinemas,movies})
    
}


const getCinemaByMovie=async(req,res)=>{
    try{
        let movieId=req.params.movieId
        let cinemas=[]
        let cinemas_movie=await Cinema_movie.findAll({where:{movieId},  include:Cinema})
        cinemas_movie.forEach((cinema_movie)=>{cinemas.push({name:cinema_movie.Cinema.name,id:cinema_movie.Cinema.id})})
        res.status(200).json({cinemas})
        
    }catch(error){console.log(error)}
}


const getMovieByCinema=async(cinemaId)=>{
    try{
        let cinema_movies=await Cinema_movie.findAll({where:{cinemaId},include:Movie})
        let movies=cinema_movies.map((cinema_movie)=>cinema_movie.Movie.name)
        return movies
    }catch(error){console.log(error)}
}

const deleteCinemaMovie=async(req,res)=>{
    try{
        let movieId=req.params.id.split('-')[0]
        let cinemaId=req.params.id.split('-')[1]
        let cinema_movie=await Cinema_movie.findOne({where:{movieId,cinemaId}})
        if(!cinema_movie){
            req.flash('danger','this movie hasn\'t showed')
            res.redirect('/api/admin/cinemamovie/cinemamovies')
        }
        await cinema_movie.destroy()
        res.redirect('/api/admin/cinemamovie/cinemamovies')
    }catch(error){console.log(error)}
   
}
const getAllCinemaMovie=async()=>{
    try{
        let cinemasMovies=Cinema_movie.findAll({include:[{model:Cinema},{model:Movie}]})
      
        return cinemasMovies
    }catch(error){
        console.log(error)
    }
}

module.exports={addCinemaMovie,getCinemaByMovie,getMovieByCinema,deleteCinemaMovie,getCinemaMovie,getAllCinemaMovie}