
const {Offer,Cineplex,Movie,Cinema,Showtime,sequelize,Seat,Ticket,User,Cinema_movie,Page}=require('../models')
const {upload}=require('./addfile')
const bcrypt=require('bcrypt')
const{payEmail}=require('./email')
const uploadAvatar=upload.single('avatar_user')
const getHomePage=async(req,res)=>{
    try{
        let offers=await Offer.findAll({where:{public:1}})
        let movies=await Movie.findAll()
        res.render('client/homepage',{movies,offers})
    }catch(error){
        console.log(error)
    } 
}

const getMovie=async(req,res)=>{
    let id=req.params.id

    let movie=await Movie.findByPk(id)

    res.render('client/movie/movie',{movie})
}

const getShowtime=async(req,res)=>{
    try{
        let movieId=req.body.movie
        let searchDate=req.body.date.slice(0,10)
        let [result]=await sequelize.query(`SELECT startTime, cinemas.name as cinema,cinemas.address as address, showtimes.id as showtime FROM database_movie.showtimes inner join database_movie.cinema_movies on database_movie.showtimes.cmId=cinema_movies.id inner join database_movie.cinemas on database_movie.cinema_movies.cinemaId=database_movie.cinemas.id inner join database_movie.movies on database_movie.cinema_movies.movieId=database_movie.movies.id where database_movie.movies.id=${movieId} and date(startTime)='${searchDate}';`)
        for(let i of result){
            try{
                i.seats=await Seat.findAll({where:{showtimeId:i.showtime},attributes:['name','status','id']})   
            }catch(error){console.log(error)}   
        }
        console.log(searchDate,result)
        res.json({result})
    }catch(error){console.log(error)}
}
const getLogin=async(req,res)=>{
    res.render('client/login/login')
}
const getRegister=async(req,res)=>{
    let name=''
    let email=''
    let password=''
    let phone=''
    res.render('client/register/register',{name,email,password,phone})
}
const register=async(req,res)=>{
    let {name,email,password,phone}=req.body
    if(!password || !email){
        req.flash('danger','Email và password phải được cung cấp')
        return res.render('client/register/register',{name,email,password,phone})
    }
    const isexist=await User.findOne({where:{email}})
    if(isexist){
        req.flash('danger','email exist')
        return res.render('client/register/register',{name,email,password,phone})
    }
    const salt=await bcrypt.genSalt(10)
    const hashpassword=await bcrypt.hash(password,salt)
    let avatar=req.file ?`/uploads/avatar/${req.file.filename}`:'/uploads/avatar/meme.jpg'
    await User.create({name,email,password:hashpassword,phone,avatar,role:'Client'})
    res.status(200).redirect('/personal')
}
const bookTicket=async(req,res)=>{
    let seatIds=req.body.seatIds.map((seatId)=>seatId.slice(4))
    try{
        for(let x=0;x<seatIds.length;x++){           
            let isExist=await Ticket.findOne({where:{seatId:seatIds[x],userId:req.user.id}})      
            if(!isExist){
                await Ticket.create({seatId:seatIds[x],userId:req.user.id,status:'pending'})
            }
        }
        res.status(200).redirect('/personal')
    }catch(error){
        console.log(error)
    }
}
const getPersonalPage=async(req,res)=>{
    try{
        let user=await User.findByPk(req.user.id)
        let pendingTickets=await Ticket.findAll({
            where:{userId:user.id,status:'pending'},
            include:[{
                model:Seat,
                include:[{
                    model:Showtime,attributes:['id','startTime'],include:[{
                        model:Cinema_movie,include:[{
                            model:Cinema
                        },{
                            model:Movie
                        }]
                    }]
                }]
            }   
            ]})
        let completeTickets= await Ticket.findAll({
            where:{userId:user.id,status:'complete'},
            include:[{
                model:Seat,
                include:[{
                    model:Showtime,attributes:['id','startTime'],include:[{
                        model:Cinema_movie,include:[{
                            model:Cinema
                        },{
                            model:Movie
                        }]
                    }]
                }]
            }   
            ]})
        res.render('client/personal/personal',{user,title:'personal',pendingTickets,completeTickets})
    }catch(error){console.log(error)}
   
}
const logout=(req,res)=>{
    req.logout()
    res.redirect('/login')
}
const pay=async (req,res)=>{
    try{
        let ticketId=req.params.ticketId
        let ticket=await Ticket.findByPk(ticketId)
        if(!ticket){
            return res.redirect('/personal')
        }
        await Ticket.update({status:'complete'},{where:{id:ticketId}})
        await Seat.update({status:true},{where:{id:ticket.seatId}})
        req.flash('success','thanh toán thành công')
        res.redirect('/personal')
    }catch(error){
        console.log(error)
    }
}
const deleteTicket=async(req,res)=>{
    try{
        let ticketId=req.params.ticketId
        let isExist=await Ticket.findByPk(ticketId)
        if(!isExist){
            res.redirect('/personal')
        }
        await isExist.destroy()
        req.flash('success','trả vé thành công')
        res.redirect('/personal')
    }catch(error){console.log(error)}
}
const showCineplex=async(req,res)=>{
    const cineplexes=await Cineplex.findAll({include:[{model:Cinema}]})
    for(let x of cineplexes){
        x.cinema=await Cinema.findAll({where:{cineplexId:x.id}})
    }
    res.render('client/showtime/cineplex',{cineplexes})
}
const showMovieByCinema=async(req,res)=>{
    try{
        const cinemaId=req.params.id
        let cinema=await Cinema.findByPk(cinemaId)
        const cinema_movies=await Cinema_movie.findAll({where:{cinemaId},include:[{model:Movie}]})
        for(let x of cinema_movies){
            x.showtimes=await Showtime.findAll({
                where:{cmId:x.id},attributes:['startTime']
            })
        }
        res.render('client/showtime/cinema',{cinema_movies,cinema})
    }catch(error){console.log(error)}
    
}
const payAll=async(req,res)=>{
    try{
        let ticketIds=req.body.ticketIds
        for (let x=0;x<ticketIds.length;x++){
            let ticket=await Ticket.findByPk(ticketIds[x])
            await ticket.update({status:'complete'})
            await Seat.update({status:true},{where:{id:ticket.seatId}})
        }
        payEmail(req.user.email,req.user.name,ticketIds)
        req.flash('success','thanh toán thành công')
        res.status(200).json({message:'success'})
    }catch(error){console.log(error)}
}
const getPage=async (req,res)=>{
    try{
        let slug=req.params.slug
        let page=await Page.findOne({where:{slug}})
        if(!page){
            req.flash('danger','cannot find page')
            res.redirect('/')
        }
        res.render('client/page/page',{page})
    }catch(error){console.log(error)}
}
const getAllPage=async(req,res)=>{
    let pages=await Page.findAll()
    res.status(200).json({pages})
}
const editUser=async(req,res)=>{
    try{
        let user=req.user
        console.log(user)
        let {name,phone}=req.body
        let avatar=req.file ?`/uploads/avatar/${req.file.filename}`:'/uploads/avatar/meme.jpg'
        await User.update({avatar,name,phone},{where:{id:user.id}})
        req.flash('success','cập nhật thông tin thành công')
        res.redirect('/personal')
    }catch(error){
        console.log(error)
    }
   
}
const getMe=async (req,res)=>{
    if(req.isAuthenticated()){
        let user=await User.findByPk(req.user.id)
        res.status(200).json({user})
    }else{
        res.json({user:undefined})
    }
}
const getAllCineplexes=async (req,res)=>{
    let cineplexes=await Cineplex.findAll()
    res.status(200).json({cineplexes})
}
const showMovie=async(req,res)=>{
    let movies=await Movie.findAll()
    res.render('client/movie/movies',{movies})
}

module.exports={getHomePage,getMovie,getShowtime,bookTicket,getLogin,getRegister,uploadAvatar,register,getPersonalPage,logout,pay,deleteTicket,showCineplex,showMovieByCinema,payAll,getPage,getAllPage,editUser,getMe,getAllCineplexes,showMovie}