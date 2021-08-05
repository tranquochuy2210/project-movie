const express=require('express')
const app=express()
const path=require('path')
const adminRouter=require('./router/admin')
const clientRouter=require('./router/client')
const MongoStore=require('connect-mongo')
const session=require('express-session')
const flash=require('express-flash')
const passport=require('passport')


app.use(flash())

require('./config/passport')
const port=process.env.PORT || 3000
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.set("view engine","ejs")
app.set('views',path.join(__dirname,'./views'))

app.use(express.static(path.join('./public')))

const sessionStore=MongoStore.create({mongoUrl:'mongodb://localhost:27017/movie',ttl:60*60,collectionName:'session'})
app.use(session({
    secret:'hahaha',
    resave:false,
    saveUninitialized:true,
    store:sessionStore,
    cookie:{
        maxAge:24*60*60*1000
    }
}))




app.use(passport.initialize());
app.use(passport.session());

app.use('/api/admin',adminRouter)
app.use(clientRouter)


app.listen(port,()=>{
    console.log(`server is runing on ${port}`)
})