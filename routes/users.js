const express=require('express');
const router=express.Router();
const User=require('../models/users')
const passport=require('passport');
const wrap=require('../utils/wraper')
const user=require('../controllers/users')

router.route('/register')
             .get(user.renderRegister)
              .post(wrap(user.register))

router.route('/login') 
            .get(user.renderLogin)
            .post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}), user.login)



router.get('/logout',(user.logout ))


module.exports=router;
