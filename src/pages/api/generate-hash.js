import crypto from "crypto";

const MERCHANT_KEY = "JP***g";
const MERCHANT_SALT = "your_merchant_salt";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
        console.log("payment initiated...", req.body)
      const { txnid, amount, productinfo, firstname, email } = req.body

      // Validate required fields
      if (!txnid || !amount || !productinfo || !firstname || !email) {
        return res.status(400).json({
          success: false,
          message: "Missing required parameters",
        });
      }

      // Create the hash string
      const hashString = `${MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${MERCHANT_SALT}`;
      const hash = crypto.createHash("sha512").update(hashString).digest("hex");
      console.log("Your hash String:",hashString)

      res.status(200).json({
        success: true,
        hash:"6650d39cce5c3b1fa56333a2f72cd538139e98c27c981503290ca7496b88dbf6d8a63f5c55f48b61df6195196c1a5631610765453b864554cfb1f2f44af6cbb0",
        key: MERCHANT_KEY, // Return the merchant key to the frontend
      });
    } catch (error) {
      console.error("Error generating hash:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  } else {
    res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }
}
