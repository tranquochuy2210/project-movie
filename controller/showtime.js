const {Showtime,Cinema_movie,Seat,Cinema,Movie}=require('../models')
const {getAllCinemaMovie}=require('./cinema_movie')
const moment = require('moment'); 
const {addSeats}=require('./seat')

const addShowtime=async(req,res)=>{
    try{
        let {startTime,cinema_movieId:cmId,price,type}=req.body
        let showtime=await Showtime.create({startTime,cmId})
        await addSeats({showtimeId:showtime.id,price,type})     
        res.redirect('/api/admin/showtime/showtimes')
    }catch(error){
        console.log(error)
    }
}
const getShowtimeByCmId=async (req,res)=>{
    try{
        let cmId=req.params.cmId
       let data=[]
        let showtimes=await Showtime.findAll({where:{cmId},attributes:["id","startTime"]})

        showtimes.forEach((showtime)=>{
            data.push({id:showtime.id,startTime:showtime.startTime})
            
        })

        res.status(200).json({showtimes:data})
    }catch(error){
        console.log(error)
    }
}
const deleteshowtime=async (req,res)=>{
    try{
        let id=req.params.id
        let showtime=await Showtime.findOne({where:{id},attributes:["id","startTime"]})
        if(!showtime){
            req.flash('danger','showtime does not exist')
            res.redirect('/api/admin/cinemamovie/cinemamovies')
        }
        await showtime.destroy()
        req.flash('success','showtime deleted')
        res.redirect('/api/admin/showtime/showtimes')
    }catch(error){
        console.log(error)
    }
}
const showShowtime=async(req,res)=>{
    try{
        let cinemasMovies=await getAllCinemaMovie()
        let showtimes=await Showtime.findAll({
            attributes:["id","startTime"],
            subQuery:false,
            include:[
                {
                    model:Cinema_movie,
                    include:[
                        {
                            model:Cinema                           
                        },{
                            model:Movie
                        }
                    ]
            }
        ]
        })
        for (let showtime of showtimes){
            showtime.seats=[]
            let seats= await Seat.findAll({where:{showtimeId:showtime.id}})
            seats.forEach((seat)=>showtime.seats.push(seat))
        }
        

        res.render('admin/showtime/showtime',{showtimes,cinemasMovies})
    }catch(error){
        console.log(error)
    }
}



module.exports={addShowtime,getShowtimeByCmId,deleteshowtime,showShowtime}