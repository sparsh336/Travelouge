const mongoose=require('mongoose');
const { campgroundSchema } = require('../schemas');
const Review=require('./review');
const Schema=mongoose.Schema;
const User=require('./users');
const opts = { toJSON: { virtuals: true } };
const campGroundschema= mongoose.Schema({
    title:String,
    image:String,
    geometry:{
        type:{
           type:String,
            enum:['Point'],
            required:true

         },
        coordinates:{
            type:[Number],
         required:true
         }

    },

    price:Number,

    location:String,
    description:String,
    author:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
},opts);


campGroundschema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
});

campGroundschema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.deleteMany({
            id:{
                $in:doc.reviews
            }
        })
    }
})

module.exports=mongoose.model('Campground',campGroundschema);
