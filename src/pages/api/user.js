import { authMiddleware } from "@/lib/authMiddleware";
import conn from "@/lib/conn";
import User from "@/model/user";


export default authMiddleware(async function handler(req, res) {
    await conn();
    const { method } = req;

    switch (method) {

        case "GET":{

            try {
                const userId = req.user.id || req.user.userId; // Extract user ID from token
                const user = await User.findById(userId);
            
                if (!user) {
                  return res.status(404).json({ error: "User not found" });
                }
            
                return res.status(200).json({
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email:user.email,
                  role: user.role,
                  subscriptionPlan: user.subscriptionPlan,
                  usageLimits: user.usageLimits,
                });
              } catch (error) {
                return res.status(500).json({ error: "Failed to fetch user data" });
              }
        }


            default: return res.status(400).json({ success: true, message: "Invalid Method"});

    }
}
)