import { authMiddleware } from "@/lib/authMiddleware";
import conn from "@/lib/conn";
import Chat from "@/model/chat";
import Assistant from "@/model/assistant";
import OpenAI from "openai";


const openai = new OpenAI({
  apiKey:process.env.NEXT_PUBLIC_GEMINI_API
});

export default authMiddleware(async function handler(req, res) {
  await conn();
  const { method } = req;
  // console.log(req.body)

  switch (method) {
    // when clicked on new chat then this should be called.
    case "POST": {
      try {
        const { name, userId, title, contents, category, subcategory } =req.body;

        const createChat = new Chat({
          name,
          userId,
          title,
          contents,
          category,
          subcategory,
        });

        await createChat.save();

        // send the response with new chat id
        return res.status(200).json({
          success: true,
          message: "Chat Successfully Created",
          chatId: createChat.id,
        });
      } catch (error) {
        return res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    }

    // when click on any chat component then this should be called to get chat Data
    case "GET": {
      // if we want to each chatData in details
      const { action } = req.query;
      if (action === "getChatData") {
        try {
          const _id = req.query.chatId;

          const getChatData = await Chat.findOne({ _id });

          if (!getChatData) {
            return res
              .status(404)
              .json({ success: false, message: "Chat NOT Found" });
          }

          return res.status(200).json({ success: true, chatData: getChatData });
        } catch (error) {
          if(error.kind=='ObjectId') return res
          .status(404)
          .json({ success: false, message: "Chat NOT Found" });
          return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
        }
        
      } else if (action === "getChatList") {
        // if we want to get list of chat data such as title and chat id only
        try {
          const userId = req.query.userId;
          const getChatList = await Chat.find({ userId: userId }).select(
            "title _id name personalContent"
          ).sort({updatedAt:-1}).exec();

          if (getChatList.length <= 0) {
            return res
              .status(200)
              .json({ success: false, message: "No chat list found" });
          }

          return res
            .status(200)
            .json({ success: true, chatLists: getChatList });
        } catch (error) {
          console.log(error);
          return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
        }
        
      } 
      else {
        return res
          .status(400)
          .json({ success: false, message: "Wrong query performed" });
      }
      
    }

    case "PUT": {
      try {
        const { chatId, question, answer, usage } = req.body;

        const newName = question;

        // First, retrieve the chat document by ID
        const chat = await Chat.findById(chatId);

        // Check if contents is empty or null and set the name if necessary
        if (!chat.contents || chat.contents.length === 0) {
          chat.name = newName;
        }

        // Add the new question and answer to contents
        chat.contents.push({ question, answer, tokenUsage:usage });

        // Save the updated chat document
        const updatedChat = await chat.save();

        return res
          .status(200)
          .json({
            success: true,
            message: "Content added successfully",
            name: updatedChat.name,
          });
      } catch (error) {
        console.log(error);
        return res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
      
    }

    case "PATCH":{
      const {action}=req.query;
      if (action === "shareChat") {
        // if we want to get list of chat data such as title and chat id only
        try {
          const chatId = req.query.chatId;

          const userId=req.user.id || req.user.userId;

          const chat=await Chat.findById(chatId);
          if(!chat){
            return res.status(404).json({success:false, message:"Chat is not found"});
          }

          if(chat.userId!=userId){
            return res.status(403).json({success:false, message:"Unauthorized"});
          }

          if(chat.share==true){
            return res.status(200).json({
              success: true,
              message: "Chat shared",
              shareStatus: chat.share,
          });
          }

          chat.share = true;
            await chat.save();
            
          return res.status(200).json({
              success: true,
              message: "Chat shared",
              shareStatus: chat.share,
          });
        } catch (error) {
          console.log(error);
          return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
        }
      }else if(action=="removeShare"){
        try {
          const chatId = req.query.chatId;

          const userId=req.user.id || req.user.userId;

          const chat=await Chat.findById(chatId);
          if(!chat){
            return res.status(404).json({success:false, message:"Chat is not found"});
          }

          if(chat.userId!=userId){
            return res.status(403).json({success:false, message:"Unauthorized"});
          }
          if(chat.share==false){
            return res.status(200).json({
              success: true,
              message: "Chat shared",
              shareStatus: chat.share,
          });
        }

          chat.share = false;
            await chat.save();
            
          return res.status(200).json({
              success: true,
              message: "Chat sharing removed",
              shareStatus: chat.share,
          });
        } catch (error) {
          console.log(error);
          return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
        }
      }else if(action=="responseFeedback"){
        try {
          const {chatId,feedback} = req.query;

          const userId=req.user.id || req.user.userId;

          const chat=await Chat.findById(chatId);
          if(!chat){
            return res.status(404).json({success:false, message:"Chat is not found"});
          }

          if(chat.userId!=userId){
            return res.status(403).json({success:false, message:"Unauthorized"});
          }

          // Get the index of the last content
          const lastIndex = chat.contents.length - 1;

          // Ensure the chat has at least one content
          if (lastIndex < 0) {
            return res.status(400).json({ success: false, message: "No content available to update feedback" });
          }

          chat.contents[lastIndex].responseFeedback = feedback;
            await chat.save();
            
          return res.status(200).json({
              success: true,
              message: "Chat Feedback Updated",
          });
        } catch (error) {
          console.log(error);
          return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
        }
      }else if(action=="saveResponseUnderstand"){
        try {
          const {chatId,feedback} = req.query;

          const userId=req.user.id || req.user.userId;

          const chat=await Chat.findById(chatId);
          if(!chat){
            return res.status(404).json({success:false, message:"Chat is not found"});
          }

          if(chat.userId!=userId){
            return res.status(403).json({success:false, message:"Unauthorized"});
          }

          // Get the last index of the contents array
          const lastIndex = chat.contents.length - 1;

          // Check if the contents array is empty
          if (lastIndex < 0) {
            return res.status(400).json({ success: false, message: "No contents available to update" });
          }
          if(chat.contents[lastIndex].responseUnderstand==true || chat.contents[lastIndex].responseUnderstand==false){
            return res.status(200).json({success:false,message:`You cannot change now`});
          }

          if(chat.contents[lastIndex].responseUnderstand==!feedback){
           return res.status(200).json({success:true,message:`already ${feedback}`})
          }

          chat.contents[lastIndex].responseUnderstand = feedback;
            await chat.save();
            
          return res.status(200).json({
              success: true,
              message: "Chat understand Updated",
          });
        } catch (error) {
          console.log(error);
          return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
        }
      }else if(action=="saveQuestions"){
        try {
          const {chatId} = req.query;
          const {questions}=req.body

          const userId=req.user.id || req.user.userId;

          const chat=await Chat.findById(chatId);
          if(!chat){
            return res.status(404).json({success:false, message:"Chat is not found"});
          }

          if(chat.userId!=userId){
            return res.status(403).json({success:false, message:"Unauthorized"});
          }

          chat.questions = questions;
            await chat.save();
            
          return res.status(200).json({
              success: true,
              message: "Questions saved",
          });
        } catch (error) {
          console.log(error);
          return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
        }
      }
      else{
        return res.status(405).json({ success: false, message: "Action not allowed" });
    }
    
    }

    // Delete chat
    case "DELETE": {
      try {
        const { chatId } = req.query;

        // Find the chat to verify ownership
        const chat = await Chat.findById(chatId);
        
        const userId=req.user.id || req.user.userId;

        if (!chat) {
          return res
            .status(404)
            .json({ success: false, message: "Chat not found" });
        }

        // Check if the authenticated user is the chat owner
        if (chat.userId.toString() !== userId) {
          return res.status(403).json({
            success: false,
            message: "Unauthorized to delete this chat",
          });
        }
        if(chat.personalContent){          
          const deleteThread = await openai.beta.threads.del(chat.threadId);
          if(!deleteThread.deleted){
            return res.status(500).json({ success: false, message: "Failed to delete threadId"})
          }

          // Delete the chat
        await chat.deleteOne();

          
          return res
          .status(200)
          .json({ success: true, message: "Chat deleted successfully" });
        }else{
          await chat.deleteOne();
          return res
          .status(200)
          .json({ success: true, message: "Chat deleted successfully" });
        }

      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
      
    }

    default:
      return res
        .status(405)
        .json({ success: false, message: "Method not allowed" });
  }
});
