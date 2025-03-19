"use client";

import React, { useState } from "react";
import axios from "axios";

const Payment = () => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      console.log("payment initiated...")

      // Dummy Payment Data (You can replace this with dynamic data)
      const paymentData = {
        txnid: "Txn" + new Date().getTime()+"abagg", // Unique transaction ID
        amount: "10.00", // Transaction amount
        productinfo: "Legal Service", // Product description
        firstname: "John", // Customer first name
        email: "john.doe@example.com", // Customer email
      };

      // Call the backend API to generate the hash
      const response = await axios.post("/api/generate-hash", paymentData);
      console.log("generate-hash response :",response)

      if (response.data.success) {
        const { hash, key } = response.data;
        console.log("payment success for block 2")

        // Prepare form data for PayU
        const payUData = {
          key: key,
          txnid: paymentData.txnid,
          amount: paymentData.amount,
          productinfo: paymentData.productinfo,
          firstname: paymentData.firstname,
          email: paymentData.email,
          phone: "9123456789", // Optional: Customer phone number
          surl: "https://ivyaitutor.azurewebsites.net/dashboard/chat", // Success URL
          furl: "https://ivyaitutor.azurewebsites.net/dashboard/quiz", // Failure URL
          hash: hash, // Generated hash
        };
console.log("payment success for block 2")
        // Create a form dynamically and submit it to PayU
        const form = document.createElement("form");
        form.action = "https://sandboxsecure.payu.in/_payment"; // Use "https://secure.payu.in/_payment" for production
        form.method = "POST";

        // Append form fields
        Object.entries(payUData).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit(); // Submit the form to PayU
      } else {
        alert("Failed to generate hash. Please try again.");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Payment initiation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>PayU Integration</h1>
      <button
        onClick={handlePayment}
        style={{
          padding: "10px 20px",
          backgroundColor: "#32CD32",
          color: "white",
          fontSize: "16px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default Payment;