const User=require('../models/users')


module.exports.renderRegister =(req,res)=>{
    res.render('users/register')
}



module.exports.register =async (req,res,next)=>{
    try{
     const{username,email,password}=req.body
   const user=new User({username,email});
   const registeredUser=await User.register(user,password)
   req.login(registeredUser,err=>{
       if(err)return(err);
       req.flash('success','welcome to travellouge')
       res.redirect('/campgrounds')
    
   })
} 
catch (e){
    req.flash('error',e.message );
    res.redirect('/register');

}

}


module.exports.renderLogin =(req,res)=>{
    res.render('users/login'); 
}




module.exports.login =(req,res)=>{
    req.flash('success','Welcome back')
    const redirectUrl=req.session.returnTo ||'/campgrounds'
    res.redirect(redirectUrl);
    
    }




module.exports.logout =(req,res)=>{
    req.logOut();
    req.flash('success','GoodBye')
    res.redirect('/campgrounds')
}