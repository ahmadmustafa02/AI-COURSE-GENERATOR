"use client";

import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { UserDetailContext } from '@/context/UserDetailContext';

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
    <div>{children}</div>
     </UserDetailContext.Provider>
  )
}

export default Provider