
const {isAuth}=require('../middleware/auth')
const passport=require('passport')
const express=require('express')
const router=express.Router()
const {getHomePage,getMovie,getShowtime,bookTicket,getLogin,getRegister,uploadAvatar,register,getPersonalPage,logout,pay,deleteTicket,showCineplex,showMovieByCinema,payAll,getPage,getAllPage,editUser,getMe,getAllCineplexes,showMovie}=require('../controller/client')

//homepage
router.get('/',getHomePage)

//page
router.get('/page/:slug',getPage) 
router.get('/page',getAllPage) //get data for header

//cineplex
router.get('/cineplex',showCineplex)
router.get('/getall-cineplex',getAllCineplexes) //get data for footer

//movie
router.get('/movies',showMovie) //show page with all movie
router.get('/movie/:id',getMovie) ///show single movie
//show time

router.post('/showtime',getShowtime) //get showtime for single movie

//ticket
router.post('/bookticket',isAuth,bookTicket)

//login & register
router.get('/register',getRegister)
router.post('/register',uploadAvatar,register)
router.get('/login',getLogin)
router.post('/login',passport.authenticate('local',{successRedirect: 'personal',failureRedirect:'login',failureFlash:true}
))
router.get('/logout',logout)

//personal
router.get('/personal',isAuth,getPersonalPage)
router.post('/personal/edit-user',isAuth,uploadAvatar,editUser)
router.get('/get-user',getMe) //get data for header

//ticket
router.get('/deleteticket/:ticketId',isAuth,deleteTicket)

//payment 
router.get('/payment/:ticketId',isAuth,pay)
router.post('/payment/payall',isAuth,payAll)



//cinema
router.get('/cinema/:id',showMovieByCinema)





module.exports=router
