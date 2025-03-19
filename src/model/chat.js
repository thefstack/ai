import mongoose from "mongoose";

const chatSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    name:{
        type:String,
    },
    title:{
        type:String,
        required:true
    },
    category:{
        type:String
    },
    subCategory:{
        type:String
    },
    personalContent:{
        type:Boolean,
        default:false
    },
    questions:{
        type:Object,
        default:null
    },
    assistantId:{
        type:String
    },
    fileId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"assistant"
    }],
    questionTokenUsage:{
        type:Object,
        default:null,
    },
    threadId:{
        type:String
    },
    contents:[
        {
            question:{
                type:String,
            },
            answer:{
                type:String,
            },
            tokenUsage:{
                prompt_tokens:{type:String},
                completion_tokens:{type:String},
                total_tokens:{type:String},
                prompt_token_details:{
                    cached_tokens:{type:String}
                }
            },
            responseFeedback:{type:String},    // this is for storing user feedback they like the response or not.
            responseUnderstand:{type:Boolean}   //this is for storing that the user understand the response or not it doesnt mean that response is bad
        }
    ],
    share:{
        type:Boolean,
        default: false
    }
},{timestamps:true});

const Chat= mongoose.models.chat||mongoose.model('chat',chatSchema);

module.exports=Chat;