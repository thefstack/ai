"use client";

import Forgetpassword from "@/components/ForgetPassword";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";


const ForgetPassword = () => {

  const router=useRouter();
  const {loading, isAuthenticated}=useAuth();

  if(isAuthenticated){
    return router.push("/");
  }
  
  if(loading){
    return <Loading text='Never Forget Your Password !!'/>
  }

  return (
    <Forgetpassword/>
  )
}

export default ForgetPassword
