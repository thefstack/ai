import mongoose from "mongoose";


const portfolioSchema=new mongoose.Schema({
    userId:{
        type:String
    },
    fileId:{
        type:String
    },
    name:{
        type:String,
    },
    size:{
        type:Number
    }
},{timestamps:true});

const Assistant= mongoose.models.portfolio||mongoose.model('portfolio',portfolioSchema);

module.exports=Assistant;