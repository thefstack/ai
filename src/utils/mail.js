import nodemailer from "nodemailer";

const transporter=nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth:{
        user:process.env.EMAIL_ID,
        pass:process.env.EMAIL_PASS
    }
})

const sendMail=async(email,subject,html)=>{
    const mailOption={
        from:process.env.EMAIL_ID,
        to:email,
        subject,
        html // Changed from text to html
    };

    try{
        await transporter.sendMail(mailOption);
        return true;
    }catch(error){
        console.log(error);
        return false;
    }
}

module.exports=sendMail