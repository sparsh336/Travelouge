const Campground=require('../models/campgrounds');
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken=process.env.MAPBOX_TOKEN;



  const geocoder= mbxGeocoding({accessToken:mapBoxToken })


 module.exports.index= async (req,res)=>{
    const c=await Campground.find({});
    res.render('campgrounds/index',{c})
}

module.exports.renderNewForm =(req,res)=>{
    res.render('campgrounds/new')
}
module.exports.createCampground=async (req,res)=>{
  const geoData= await geocoder.forwardGeocode({
       query:req.body.campground.location,
       limit:1
   }).send()
   console.log(geoData);
    const n=new Campground(req.body.campground)
    n.geometry=geoData.body.features[0].geometry;
    n.author=req.user._id;
    await n.save()
    
    req.flash('success', 'Successfully Created New Campground ');
    res.redirect( `/campgrounds/${n._id}`)
   }




module.exports.showCampground=async (req,res)=>{
    const {id}=req.params
   const getcamp=await Campground.findById(id).populate({
      path: 'reviews',
      populate:{
        path :'author'
      }
    }).populate('author')
   if(!getcamp){
       req.flash('error','Cannot find campground')
       return res.redirect('/campgrounds')
   }
   res.render('campgrounds/show',{getcamp})
}



module.exports.renderEditForm = async(req,res)=>{
    const {id}=req.params
    const editcamp=await Campground.findById(id)
    if(!editcamp){
        req.flash('error','Cannot find campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit',{editcamp})
}



module.exports.updateCampground =async(req,res)=>{
    const {id}=req.params
   const Ucampground =await Campground.findByIdAndUpdate(id,{...req.body.campground})

   req.flash('success', 'Successfully Updated Campground ');
   res.redirect(`/campgrounds/${Ucampground._id}`)
}




module.exports.deleteCampground=async(req,res)=>{
    const{id}=req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Campground ');
    res.redirect('/campgrounds');
}