const express=require('express');
const router=express.Router();
const Campground=require('../models/campgrounds');
const wrap=require('../utils/wraper')
const error=require('../utils/error');
const { campgroundSchema,reviewSchema }=require('../schemas');
const {isLoggedIn ,isAuthor,campValidate}=require('../middleware');
const campgrounds=require('../controllers/campground')


//const{storage,cloudinary}=require('../cloudinary');
//const upload=multer({ storage });

router.route('/')
    .get(wrap(campgrounds.index))
    .post( wrap(campgrounds.createCampground))
    //.post(upload.single('image'),async (req,res)=>{
        //console.log(req.body);
        
    
    
router.get('/new',isLoggedIn,(campgrounds.renderNewForm))


router.route('/:id')
    .get(wrap(campgrounds.showCampground))
    .put(campValidate,isLoggedIn, isAuthor, wrap(campgrounds.updateCampground))
    .delete(isLoggedIn,isAuthor, wrap(campgrounds.deleteCampground))
    
router.get('/:id/edit',isLoggedIn,isAuthor, wrap(campgrounds.renderEditForm))





module.exports=router;