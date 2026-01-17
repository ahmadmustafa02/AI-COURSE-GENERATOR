"use client";

import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { UserDetailContext } from '@/context/UserDetailContext';
import Header from './_components/Header';
import Footer from './_components/Footer';
import ParticleBackground from './_components/ParticleBackground';

function  Provider({children}:{children: React.ReactNode}) {

    const [userDetail,setUserDetail] = useState(null)

    useEffect(()=>{
        CreateNewUser()

    },[])


  const CreateNewUser=async () =>{
    
    //user api endpoint call to create a user

   const result =await axios.post('/api/user',{});
   console.log(result.data)
   setUserDetail(result?.data)

  } 

  return (
    <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
    <div className="relative min-h-screen flex flex-col">
      <ParticleBackground />
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
     </UserDetailContext.Provider>
  )
}

export default Provider