const mongoose=require('mongoose');
const cities=require('./cities');
const{descriptors,places}=require('./seedHelper')

const Campground=require('../models/campgrounds');
mongoose.connect('mongodb://localhost:27017/travelouge', {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log('connection open');
})
.catch(err=>{
    console.log('error');
    console.log(err);
})

const random = aray=>aray[Math.floor(Math.random()*aray.length)];
const seedDb=async()=>{
   await Campground.deleteMany({})
   for(let i=0;i<300;i++){
       const random1000=Math.floor(Math.random()*1000)
       const camp=new Campground({
        author:'5fc0e26e9453f919fc5535bc' ,
           location:`${cities[random1000].city}, ${cities[random1000].state}`,
           geometry: {
            type: "Point",
            coordinates: [
                cities[random1000].longitude,
                cities[random1000].latitude,
            ]
        },
           
           title:`${random(descriptors)},${random(places)}`,
       
           image:"https://images.unsplash.com/photo-1518602164578-cd0074062767?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
           description:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Atque error nulla ipsam qui aperiam necessitatibus voluptates veritatis tenetur voluptatibus explicabo et nobis, ex debitis cumque voluptatem dolorem dolorum eius quis.",
           price:7


       })
       await camp.save();
   }
 

}
seedDb().then(()=>{
    mongoose.connection.close()
})