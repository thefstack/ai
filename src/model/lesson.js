import mongoose from "mongoose";

const lessonSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    title:{
        type:String,
        required:true
    },
    category:{  //tool-> category
        type:String
    },
    personalContent:{
        type:String,
        default:false
    },
    subCategory:{    // topics-> subCategory
        type:[String]
    },
    days:{
        type:String
    },
    studyTime:{
        type:String
    },
    difficulty:{
        type:String
    },
    lessonPlan:{
        courseOverview:{
            type:String
        },
        dayByDayPlan:[
        {
            day:{type:Number},
            topic:{type:String},
            keyConceptsToBeCovered:{type:String},
            module:{type:String, default:null},
            isCompleted:{type:Boolean,default:false},
            tokenUsage:{
                prompt_tokens:{type:String},
                completion_tokens:{type:String},
                total_tokens:{type:String}
            },
        }]
    },
    tokenUsage:{
        type:Object
    },
},{timestamps:true});

const Lesson= mongoose.models.lesson||mongoose.model('lesson',lessonSchema);

module.exports=Lesson;