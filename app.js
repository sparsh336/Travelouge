if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const express =require('express');
const mongoose=require('mongoose');
const app=express();
const path=require('path');
const ejsMate=require('ejs-mate')
const Joi=require('joi');
const session=require('express-session');
const methodOveride=require('method-override');
const { reduce, join } = require('./seeds/cities');
const flash =require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/users')



const{storage,cloudinary}=require('./cloudinary');
const mongoDBStore=require('connect-mongodb-session')(session);


const { campgroundSchema,reviewSchema }=require('./schemas');
const campgroundRoutes=require('./routes/campground');
const reviewsRoutes= require('./routes/reviews');
const userRoutes=require('./routes/users');
const dbUrl=process.env.DB_URL||'mongodb://localhost:27017/travelouge';
//'mongodb://localhost:27017/travelouge'
mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log('connection open');
}).catch(err=>{
    console.log('error');
    console.log(err);
})
const secret=process.env.SECRET||'secret'
const store= new mongoDBStore({

    url:dbUrl,
    secret,
    collection:'sessions',
    touchAfter:24*60*60

});
store.on("error",function(e){
console.log(e);
});
const sessionConfig={
    store,
    secret,
    resave:false,
    saveUninitialized:true,
    cookies :{
        httpOnly:true,
       expires:Date.now()+1000*60*60*24*7,
       maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.s =req.flash('success');
    res.locals.error =req.flash('error');
    next();

})


app.use(express.urlencoded({extended : true}))
app.use(methodOveride('_method'))
app.use(express.static( path.join(__dirname,'public')));
app.engine('ejs',ejsMate);
app.set('view engine','ejs');

app.use('/campgrounds',campgroundRoutes)
app.use('/campgrounds/:id/reviews',reviewsRoutes)
app.use('/',userRoutes)

app.get('/',(req,res)=>{
    res.render('home')
})








app.all('*',(req,res,next)=>{
    next(new error('page not found',404))
})


app.use((err,req,res,next)=>{
    const{message,statusCode=404}=err;
    res.status(statusCode).render('error',{err})
})


app.listen(3000,()=>{
    console.log('listeing on port 3000');
})