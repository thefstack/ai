"use client";
import React from 'react'
import SignUp from '@/components/SignUp';
import { useAuth } from '@/context/AuthContext';
import Loading from '@/components/Loading';
import { useRouter } from 'next/navigation';


const SignUpPage = () => {

  const router=useRouter();
  const {loading, isAuthenticated}=useAuth();

  if(isAuthenticated){
    return router.push("/dashboard/chat");
  }
  
  if(loading){
    return <Loading text='checking signup'/>
  }
  
  return (
    <SignUp/>
  )
}

export default SignUpPage
