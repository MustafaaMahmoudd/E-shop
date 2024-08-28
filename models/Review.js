const mongoose=require('mongoose');

const reviewSchema=new mongoose.Schema({
    message:{
        type:String,
        required:[true,'please add review']
    },
    product:{
        type:mongoose.Schema.ObjectId,
        ref:'Product',
        required:[true,'review must belong to specific product']
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'review must belong to specific user']
    },
    rating:{
        type:Number,
        required:[true,'please add rating between 1 and 5'],
        min:1,
        max:5
    }
},{
    timestamps:true
})

const Review=mongoose.model('Review',reviewSchema)

module.exports=Review