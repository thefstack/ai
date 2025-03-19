import conn from "@/lib/conn";
import SubscriptionDetail from "@/model/SubscriptionDetail";

export default async function handler(req,res) {
  if(req.method!=="GET"){
    return res.status(400).json({success:false, message:"Invalid Method"})
  }
  try {
    await conn();
    const subscriptions = await SubscriptionDetail.find({});

    return res.status(200).json({
      success: true,
      message: "Subscription details fetched successfully",
      subscriptions,
    });
  } catch (error) {
    return res.status(500).json(
      {
        success: false,
        message: "Failed to fetch subscriptions",
        error: error.message,
      }
    );
  }
}
