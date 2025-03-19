"use client";
import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import { getAuthToken } from '@/utils/getAuthToken';

// Create the SkillupContext
const SkillupContext = createContext();

// Custom hook for consuming the context
export const useSkillup = () => useContext(SkillupContext);

// UserProvider component to wrap around the app
export const SkillupProvider = ({ children }) => {

  const router=useRouter();

  const [loadingList,setLoadingList]=useState(false); // this state is for loading list
  const [skillupList, setSkillupList]=useState([])
  
  
  const {handleSetError}=useAuth()
  
  const { userId } = useAuth();



  // we fetch the total no of quizes the user has created
  const getSkillupList=async()=>{
    try{
        setLoadingList(true);
        const token = await getAuthToken();  // Retrieve the token using the utility function

        if (!token) {
          throw new Error("No authentication found");
        }

      const res=await axios.get("/api/skillup",{
        params:{userId:userId,
        action:"getSkillupList"},
        headers: {
          Authorization: `Bearer ${token}`
      }
      })
    //   console.log("getSkillupList:",res.data)
      if(res.data.success){
      setSkillupList(res.data.skillupList);
      }
    }catch(error){
      console.log("error in skillupContext")
      handleSetError("error while fetching skillup list")
      if(error.status===401){
        window.location.reload();;
      }
    }finally{
      setLoadingList(false);
    }
  }

  const handleStartLesson=async(skillupId)=>{
    try {
        setLoadingList(true);
        const token = await getAuthToken();  // Retrieve the token using the utility function
        console.log(token)
        if (!token) {
          throw new Error("No authentication found");
        }
        const res=await axios.post("/api/skillup",
            {
            userId:userId,
            action:"createLesson",
            skillupId
            },
            {
            headers: {
              Authorization: `Bearer ${token}`
          }
          })
        if(res.data.success){
            router.push(`/dashboard/lesson/${res.data.lessonId}`)
        }
        
    } catch (error) {
      console.log("error in skillupContext",error)
      handleSetError("Error creating lesson")
    }
  }

  return (
    <SkillupContext.Provider value={{ 
        skillupList, getSkillupList, loadingList, handleStartLesson
     }}>
      {children}
    </SkillupContext.Provider>
  );
};
