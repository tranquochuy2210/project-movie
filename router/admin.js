const bcrypt=require('bcrypt')
const {isAdmin}=require('../middleware/auth')

const passport=require('passport')

const express=require('express')
const router=express.Router()
const {createAdmin,getAllUser,deleteUser,updateUser,getUser,uploadAvatar,getHomePage}=require('../controller/user')
const{getAddMovie,editMovie,addMovie,getEditMovie,deleteMovie,uploadMoviePoster,showMovie}=require('../controller/movie')
const{getAddCineplex,addCineplex,uploadCineplexlogo,getCineplex,deleteCineplex,getEditCineplex, editCineplex}=require('../controller/cineplex')
const {showCinemas,getAddCinema,addCinema,uploadCinemaImg,deleteCinema,editCinema,getEditCinema}=require('../controller/cinema')
const {addCinemaMovie,getCinemaByMovie,deleteCinemaMovie,getCinemaMovie}=require('../controller/cinema_movie')
const {addShowtime,getShowtimeByCmId,deleteshowtime,showShowtime}=require('../controller/showtime')
const {getAllSeat}=require('../controller/seat')
const {getPages,getAddPage,addPage,editPage,getEditPage,deletePage,}=require('../controller/page')
const {getOffer,getAddOffer,addOffer,getEditOffer,editOffer,getOfferImage,deleteOffer}=require('../controller/offer')
//user
router.post('/users/adduser',createAdmin)
router.get('/users/getalluser',getAllUser)

router.delete('/users/deleteuser',deleteUser)
router.put('/users/updateuser',updateUser)
router.get('/register',(req,res)=>{
    res.render('admin/register/register')
})
router.get('/login',(req,res)=>{ 
    res.render('admin/login/login')
})
router.get('/homepage',isAdmin,getHomePage)
router.get('/log-out',isAdmin,(req,res)=>{
    req.logOut()
    res.redirect('/api/admin/login')
})
router.get('/',isAdmin,(req,res)=>{
    res.redirect('admin/homepage')
})
router.post('/register',createAdmin)
router.post('/login',passport.authenticate('local',{successRedirect: 'homepage',failureRedirect:'login',failureFlash:true}
))
//admin user
router.get('/user/users',isAdmin,getAllUser)
router.get('/user/user/:id',isAdmin,getUser)

//movie
router.get('/movie/movies',isAdmin,showMovie)
router.get('/movie/addmovie',isAdmin,getAddMovie)
router.post('/movie/addmovie',isAdmin,uploadMoviePoster,addMovie)
router.post('/movie/editmovie/:id',isAdmin,uploadMoviePoster,editMovie)
router.get('/movie/editmovie/:id',isAdmin,getEditMovie)
router.get('/movie/deletemovie/:id',isAdmin,deleteMovie)

//cineplex

router.get('/cineplex/addcineplex',isAdmin,getAddCineplex)
router.post('/cineplex/addcineplex',isAdmin,uploadCineplexlogo,addCineplex)
router.get('/cineplex/cineplexes',isAdmin,getCineplex)
router.get('/cineplex/deletecineplex/:id',isAdmin,deleteCineplex)
router.get('/cineplex/editcineplex/:id',isAdmin,getEditCineplex)
router.post('/cineplex/editcineplex/:id',isAdmin,uploadCineplexlogo,editCineplex)


//cinema
router.get('/cinema/cinemas',isAdmin,showCinemas)
router.get('/cinema/addcinema',isAdmin,getAddCinema)
router.post('/cinema/addcinema',isAdmin,uploadCinemaImg,addCinema)
router.get('/cinema/deletecinema/:id',isAdmin,deleteCinema)
router.get('/cinema/editcinema/:id',isAdmin,getEditCinema)
router.post('/cinema/editcinema/:id',isAdmin,uploadCinemaImg,editCinema)
router.get('/cinema/getcinema/:movieId',isAdmin,getCinemaByMovie)

//cinema_movie
router.post('/cinemamovie/addcinemamovie',isAdmin,addCinemaMovie)
router.get('/cinemamovie/deletecinemamovie/:id',isAdmin,deleteCinemaMovie)
router.get('/cinemamovie/cinemamovies',isAdmin,getCinemaMovie)

//show time 
router.post('/showtime/addshowtime',isAdmin,addShowtime)
router.get('/showtime/getshowtime/:cmId',isAdmin,getShowtimeByCmId)
router.get('/showtime/deleteshowtime/:id',isAdmin,deleteshowtime)
router.get('/showtime/showtimes',isAdmin,showShowtime)

//seat
router.get('/seat/getallseat/:showtimeId',isAdmin,getAllSeat)

//page
router.get('/page/pages',isAdmin,getPages)
router.get('/page/addpage',isAdmin,getAddPage)
router.post('/page/addpage',isAdmin,addPage)
router.get('/page/editpage/:id',isAdmin,getEditPage)
router.post('/page/editpage/:id',isAdmin,editPage)
router.get('/page/deletepage/:id',isAdmin,deletePage)

//offers
router.get('/offer/offers',isAdmin,getOffer)
router.get('/offer/add-offer',isAdmin,getAddOffer)
router.post('/offer/add-offer',isAdmin,getOfferImage,addOffer)
router.get('/offer/edit-offer/:id',isAdmin,getEditOffer)
router.post('/offer/edit-offer/:id',isAdmin,getOfferImage,editOffer)
router.get('/offer/delete-offer/:id',isAdmin,deleteOffer)

module.exports=router