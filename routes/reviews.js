const express=require('express');
const router=express.Router({ mergeParams:true});
const Review=require('../models/review');
const wrap=require('../utils/wraper')
const error=require('../utils/error');
const { campgroundSchema,reviewSchema }=require('../schemas');
const Campground=require('../models/campgrounds');

const ExpressError = require('../utils/error');
const {isLoggedIn ,isAuthor,campValidate,reviewValidate,isReviewAuthor}=require('../middleware');
const review=require('../controllers/review.js')




router.post('/', wrap(review.createReview))
    
    router.delete('/:reviewId',isLoggedIn,isReviewAuthor, wrap(review.deleteReview))
    module.exports=router