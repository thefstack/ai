import mongoose from "mongoose";

const skillupSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    category:{
        type:String,
        default:""
    },
    subCategory:{
        type:[String],
        default:[]
    },
    summary:{
        type:String,
        required:true
    },
    dayByDayPlan:[
        {
            day:{type:Number},
            topic:{type:String},
            keyConceptsToBeCovered:{type:String},
            module:{type:String, default:null},
            // isCompleted:{type:Boolean,default:false},
            // tokenUsage:{
            //     prompt_tokens:{type:String},
            //     completion_tokens:{type:String},
            //     total_tokens:{type:String}
            // },
        }],
    days:{
        type:String
    },
    studyTime:{
        type:String
    },
    difficulty:{
        type:String
    },
},{timestamps:true});

const Skillup= mongoose.models.skillup||mongoose.model('skillup',skillupSchema);

module.exports=Skillup;