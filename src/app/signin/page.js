"use client";
import React from 'react'
import Protected from '@/utils/Protected';
import SignIn from '@/components/SignIn';
import { useAuth } from '@/context/AuthContext';
import Loading from '@/components/Loading';
import { useRouter } from 'next/navigation';


const SignInPage = () => {

  const router=useRouter();
  const {loading, isAuthenticated}=useAuth();

  if(isAuthenticated){
    return router.push("/dashboard/chat");
  }
  
  if(loading){
    return <Loading text='signing in'/>
  }
  
  return (
    <Protected loadingText="Signing In"><SignIn/></Protected>
  )
}

export default SignInPage
