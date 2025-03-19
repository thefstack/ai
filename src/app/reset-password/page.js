"use client";

import Resetpassword from "@/components/ResetPassword"
import "@/css/signup.css"
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const ResetPassword =() => {
      
  const router=useRouter();
  const {loading, isAuthenticated}=useAuth();

  if(isAuthenticated){
    return router.push("/");
  }
  
  if(loading){
    return <Loading text='Never share your password to anyone'/>
  }

  return (
    <Resetpassword/>
  )
}

export default ResetPassword
