"use client";
import { useRouter } from 'next/navigation';
import React from 'react'


const Error = () => {
    const router = useRouter();
    
  return (
    <>
      <div style={{textAlign:"center"}}>
        <h1>Error</h1>
        <button style={{cursor:"pointer"}} onClick={()=>router.push("/")}>Back To Home</button>
      </div>
    </>
  )
}

export default Error