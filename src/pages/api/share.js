import conn from "@/lib/conn";
import Chat from "@/model/chat";


export default async function handler(req, res) {
  await conn();
  const { method } = req;
  // console.log(req.body)

  if(method!='GET'){
    return res.status(403).json({success:false, message:"wrong method"})
  }

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

          if(getChatData.share==false){
            return res
              .status(402)
              .json({ success: false, message: "UnAuthorised" });
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
      } 
      else {
        return res
          .status(400)
          .json({ success: false, message: "Wrong query performed" });
      }
    }
