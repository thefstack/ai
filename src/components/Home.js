
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import Loading from './Loading';

const Home = () => {
  const [isLoading,setIsLoading]=useState(false);
  const router=useRouter()

  const handleClick=(e)=>{
    e.preventDefault();
    setIsLoading(true);
    setTimeout(()=>{
      router.push('/dashboard');
    },500)

  }
  if(isLoading){
    return <Loading text='AI Tutor Loading...'/>
  }

  return (
    <div style={{display:"flex", width:"100%", minHeight:"100vh",justifyContent:"center",alignItems:"center"}}>
      <Link href="/dashboard"style={{background:"#4B5D67", color:"#fff", fontSize:"1.4rem", padding:"5px 18px", borderRadius:"8px"}} onClick={handleClick}>AI Tutor</Link>
    </div>
  )
}

export default Home;
