import mongoose from "mongoose";


const assistantSchema=new mongoose.Schema({
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

const Assistant= mongoose.models.assistant||mongoose.model('assistant',assistantSchema);

module.exports=Assistant;