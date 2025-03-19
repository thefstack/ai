"use client";
import Home from '@/components/Home';
import Protected from '@/utils/Protected';
import { useRouter } from 'next/navigation';
import React from 'react'

export default function App() {

  const router=useRouter();

  router.push("/dashboard/chat");

  return (<>
    <Protected text="Loading ..."><Home/></Protected>
  </>);
}
