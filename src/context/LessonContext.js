"use client";
import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import { getAuthToken } from '@/utils/getAuthToken';
import formattedDate, { formattedDateWithYear } from '@/utils/FormatDate';


// Create the LessonContext
const LessonContext = createContext();

// Custom hook for consuming the context
export const useLesson = () => useContext(LessonContext);

// UserProvider component to wrap around the app
export const LessonProvider = ({ children }) => {

  const router=useRouter();

  const [loadingList,setLoadingList]=useState(false); // this state is for loading list
  const [loadingLesson,setLoadingLesson]=useState(false);   // this state is for loading lesson
  const [lessonList, setLessonList]=useState([]);   // store lesson list 
  const [isModalOpen,setIsLessonModalOpen]=useState(false);
  const [isSubModalOpen,setIsSubModalOpen]=useState(false);
  const [showPreferredSubCategory,setShowPreferredSubCategory]=useState(false);
  const [selectedSubCategory,setSelectedSubCategory]=useState([]);
  const [selectedCategory, setSelectedCategory]=useState();
  const [subCategories, setSubCategories]=useState([]);
  const [selectedTitle, setSelectedTitle] = useState('');
    const [isCategorySelection, setIsCategorySelection] = useState(false);
    const [isSubCategoryelection, setIsSubCategoryelection] = useState(false);
    const [isFinalModalOpen, setIsFinalModalOpen] = useState(false);
    const [isTitleSelection,setIsTitleSelection]=useState(true);
    const [days, setDays] = useState('');
  const [studyTime, setStudyTime] = useState('Select frequency');
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [isLessonPlanOpen, setIsLessonPlanOpen] = useState(false);
    const [selected, setSelected] = useState(false);
    const [selectedDifficulty, setSelectedDifficulty] = useState('');// state to hold difficulty selection
    const [isNewModelOpen, setIsNewModelOpen]=useState(false); // handle to show the course category and subCategory mostly in lessonPlanTitle
    const [isNewLessonOpen,setIsNewLessonOpen]=useState(false); // handle the state when you click on new lesson (lessonPlanModal)
    const [lessonPlan,setLessonPlan]=useState({
      "courseOverview": "",
      "dayByDayPlan": [
          {
              "day": 1,
              "topic": "Sample topic"
          }
      ]
  });
  const [lessonDetails,setLessonDetails]=useState({});
  const [lessonPlanView,setLessonPlanView] = useState(``); // this is for storing the lesson plan that we get from database.

  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [isFileModal,setIsFileModal]=useState(false)
    const  [isInstitutionalPlanOpen, setIsInstutionalPlanOpen]=useState(false);
    const [contentType, setIsContentType]=useState("");
    const [fileIds,setFileIds]=useState([])
    const [isInstitutionalModal, setIsInstitutionalModal]=useState();

  const [lessonRes,setLessonRes]=useState()
  
  const {handleSetError}=useAuth()
  
  const { userId } = useAuth();

  const createLesson=async()=>{
    if(contentType==="personal"|| contentType==="institutional")
    {
      return createPersonalLesson();
    }
    try{
      setLoadingLesson(true)
      const token = await getAuthToken();  // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }
      const res = await axios.post('/api/generateLessonPlan', {
        selectedTitle,
        selectedCategory,
        selectedSubCategory,
        selectedDays: days,
        selectedTime: studyTime,
        selectedDifficulty,
      },{
        headers: {
          Authorization: `Bearer ${token}`
      }
      });

      setLessonDetails({
        selectedTitle,
        selectedCategory,
        selectedSubCategory,
        selectedDays: days,
        selectedTime: studyTime,
        selectedDifficulty,
      })
  
      if (res.status === 200 && res.data.lessonPlan) {
        // Return the generated lesson plan from the response
        setLessonPlan(res.data.lessonPlan);
      } else {
        handleSetError(res.data.message)
        throw new Error('Error generating lesson plan');
      }

        
        const databaseRes=await axios.post("/api/lesson",{
          userId,
          title:selectedTitle,
          category:selectedCategory,
          subCategory:selectedSubCategory,
          days,
          studyTime,
          difficulty:selectedDifficulty,
          lessonPlan:res.data.lessonPlan,
          tokenUsage:res.data.tokenUsage
        },{
          headers: {
          Authorization: `Bearer ${token}`
      }
        })
        console.log("Lesson Created:",databaseRes)

        getLessonList();
        router.push(`/dashboard/lesson/${databaseRes.data.lessonId}`)
        
    }catch(error){
        console.log(error)
        handleSetError(error.response.data.message || "error while creating lesson")
        if(error.response.status(401)){
          window.location.reload();;
        }
    }finally{
      setLoadingLesson(false)
    }
  }

  const createPersonalLesson=async()=>{
    try{
      console.log("fileids incontext",fileIds)
      if(fileIds.length===0){
        return handleSetError("No files selected")
      }
    setLoadingLesson(true)
      const token = await getAuthToken();  // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }
      const res = await axios.post('/api/generateLessonPlanFromFile', {
        fileIds,
        selectedDays: days,
        selectedTime: studyTime,
        selectedDifficulty,
      },{
        headers: {
          Authorization: `Bearer ${token}`
      }
      });

      // setLessonDetails({
      //   selectedTitle,
      //   selectedCategory,
      //   selectedSubCategory,
      //   selectedDays: days,
      //   selectedTime: studyTime,
      //   selectedDifficulty,
      // })
  
      if (res.status === 200 && res.data) {
        // Return the generated lesson plan from the response
        getLessonList();
        router.push(`/dashboard/lesson/${res.data.lessonId}`)
      } else {
        handleSetError(res.data.message)
        throw new Error('Error generating lesson plan');
      }
    }catch(error){
        console.log(error)
        handleSetError(error.response.data.message || "error while creating lesson")
        if(error.response.status(401)){
          window.location.reload();;
        }
    }finally{
      setLoadingLesson(false)
    }
  }


  // we fetch the total no of quizes the user has created
  const getLessonList=async()=>{
    try{
        setLoadingList(true);
        const token = await getAuthToken();  // Retrieve the token using the utility function

        if (!token) {
          throw new Error("No authentication found");
        }

      const res=await axios.get("/api/lesson",{
        params:{userId:userId,
        action:"getLessonList"},
        headers: {
          Authorization: `Bearer ${token}`
      }
      })
      console.log("getLessonList:",res.data)
      if(res.data.success){
      setLessonList(res.data.lessonLists);
      }
    }catch(error){
      console.log("error in lessonContext")
      handleSetError("error while fetching lesson list")
      if(error.status===401){
        window.location.reload();
      }
    }finally{
      setLoadingList(false);
    }
  }


  const getLessonData = async (id) => {
    try {
        setLoadingLesson(true);
        const token = await getAuthToken();  // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }
        const res = await axios.get("/api/lesson", {
            params: {
                lessonId: id,
                action: "getLessonData"
            },
            headers: {
          Authorization: `Bearer ${token}`
      }
        });
console.log("lessonData:",res.data)
        if (res.data.success) {
            setLessonRes(res.data.LessonData)
            const totalDays = res.data.LessonData.lessonPlan.dayByDayPlan.length;
            const completedDays = res.data.LessonData.lessonPlan.dayByDayPlan.filter(item => item.isCompleted).length;
            // console.log(res.data.LessonData.lessonPlan)
            setLessonPlan(res.data.LessonData.lessonPlan);
            setLessonDetails({
                selectedTitle: res.data.LessonData.title,
                selectedCategory: res.data.LessonData.category,
                selectedSubCategory: res.data.LessonData.subCategory,
                selectedDays: res.data.LessonData.days,
                selectedTime: res.data.LessonData.studyTime,
                selectedDifficulty: res.data.LessonData.difficulty,
                completedDays,
                totalDays,
                lessonId:res.data.LessonData._id,
                createdAt:formattedDateWithYear(res.data.LessonData.createdAt)
            });
            setLoadingLesson(false);
        }

    } catch (error) {
        console.error(error);
        if(error.response.status==401){
          return window.location.reload();;
        }
        handleSetError("error while fetching lesson details")
        setLoadingLesson(false);
        router.push("/dashboard/lesson")

    }
};


const getPlanView = async (id, planId) => {
  try {
    setLessonPlanView(''); // Clear previous content
    const token = await getAuthToken();  // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }
    // Fetch lesson data
    const lessonDataRes = await axios.get("/api/lesson", {
      params: {
        lessonId: id,
        action: "getLessonData"
      },
      headers: {
          Authorization: `Bearer ${token}`
      }
    });
    console.log("lessonPlanView:",lessonDataRes)

    const totalDays = lessonDataRes.data.LessonData.lessonPlan.dayByDayPlan.length;
    const completedDays = lessonDataRes.data.LessonData.lessonPlan.dayByDayPlan.filter(item => item.isCompleted).length;

    // Update lesson details
    setLessonDetails({
      selectedTitle: lessonDataRes.data.LessonData.title,
      selectedCategory: lessonDataRes.data.LessonData.category,
      selectedSubCategory: lessonDataRes.data.LessonData.subCategory,
      selectedDays: lessonDataRes.data.LessonData.days,
      selectedTime: lessonDataRes.data.LessonData.studyTime,
      selectedDifficulty: lessonDataRes.data.LessonData.difficulty,
      completedDays,
      totalDays,
      lessonId: lessonDataRes.data.LessonData._id
    });
    console.log(lessonDataRes)
    setLessonRes(lessonDataRes.data.LessonData)

    const currentDayPlan = lessonDataRes.data.LessonData.lessonPlan.dayByDayPlan[planId];
    if (currentDayPlan.module) {
      // If module is already saved, set it directly
      setLessonPlanView(currentDayPlan.module);
      return;
    }

    // Start generating the lesson view using stream
    const response = await fetch('/api/generateLessonView', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ lessonPlan: currentDayPlan.keyConceptsToBeCovered }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedText = '';
    let tokenUsage = {};  // Variable to store token usage data

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const textChunk = decoder.decode(value, { stream: true });
      const lines = textChunk.split('\n');

      for (let line of lines) {
        if (line.startsWith('data: ')) {
          let jsonString = line.replace(/^data: /, '').trim();

          if (jsonString === "[DONE]") {
            break; // End of stream
          }

          try {
            const messageData = JSON.parse(jsonString);
            if (messageData.usage) {
              tokenUsage = messageData.usage;
          } else if (messageData.content) {
              const content = messageData.content;
              accumulatedText += content;
              setLessonPlanView(prevContent => prevContent + content);
            }
          } catch (error) {
            console.error('Stream parsing error:', error);
          }
        }
      }
    }
    console.log(tokenUsage);

    // Once the entire stream has been processed, save the module
    if (accumulatedText) {
      const saveResponse = await axios.patch("/api/lesson", {
        lessonId: id,
        day: planId+1,
        module: accumulatedText,
        tokenUsage
      },
      {
        params: {
          action: "saveModuleOnly"
        },
        headers: {
          Authorization: `Bearer ${token}`
      }
      }
    );
    setLessonPlan(prevPlan => {
      const updatedDayByDayPlan = prevPlan.dayByDayPlan.map((item, index) =>
        index === planId ? { ...item, module: accumulatedText } : item
      );
      return { ...prevPlan, dayByDayPlan: updatedDayByDayPlan };
    });
    }

  } catch (error) {
    console.log("Error in getPlanView:", error);
    handleSetError("Error while generating lesson content")
  }
};




const generateLessonPlanFromReview=async(quizId)=>{
  try{
    setLoadingLesson(true)

    const token = await getAuthToken();  // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }
      console.log(quizId)
    const res = await axios.post('/api/generateLessonPlanOnReview', {
      quizId
    },{
      headers: {
          Authorization: `Bearer ${token}`
      }
    });
 

    if (res.status === 200 && res.data.lessonId) {
      getLessonList();
      router.push(`/dashboard/lesson/${res.data.lessonId}`)
    } else {
      throw new Error('Error generating lesson plan');
    }
      
  }catch(error){
      console.log("error int the lessonContext :",error)
      handleSetError(error.response.data.message || "error while creating lesson Plan")
      if(error.status===401){
        window.location.reload();;
      }
  }finally{
      setLoadingLesson(false)
  }
}

const markAsComplete=async(lessonId,dayPlanId)=>{
  try {
    console.log(lessonId)
    console.log(dayPlanId)
    const token = await getAuthToken();  // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }
    const response = await axios.patch('/api/lesson', { lessonId, dayPlanId 
    },{
      params: {
          action: "markAsCompleteOnly"
        },
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
   if (response.data.success===true && response.status==200) {
      console.log('Marked as complete:');
      // Update the local lessonPlan state
      setLessonPlan((prevPlan) => {
        const updatedDayByDayPlan = prevPlan.dayByDayPlan.map((item) =>
          item._id === dayPlanId ? { ...item, isCompleted: true } : item
        );
        return { ...prevPlan, dayByDayPlan: updatedDayByDayPlan };
      });

      setLessonRes(response.data.lesson);
    } else {
      console.error("Failed to mark as complete:", response.data.message);
      handleSetError(response.data.message)
    } 
  } catch (error) {
    console.error('Failed to mark as complete:', error);
    
    handleSetError("error")
    if(error.response.status(401)){
      window.location.reload();;
    }
  }
}


const handleDeleteLesson = async (lessonId,currentLessonId) => {
  try {
    const token = await getAuthToken();  // Retrieve the token using the utility function

    if (!token) {
      throw new Error("No authentication found");
    }
    await axios.delete(`/api/lesson?action=deleteLesson&lessonId=${lessonId}`,{
      headers: {
        Authorization: `Bearer ${token}`
    }
    });

    if(currentLessonId==lessonId){
      router.push("/dashboard/lesson");
    }
    // console.log("Chat deleted:", lessonId);
    setLessonList(prevState => prevState.filter(chat => chat._id !== lessonId));
    setSelectedLessonId(null);
  } catch (error) {
    console.error("Error deleting chat:", error);
    handleSetError("error while deleting")
    if(error.response.status(401)){
      window.location.reload();;
    }
  }
};


const handleShareLesson=(quizId)=>{
  console.log("share QuizId :",quizId)
}


  return (
    <LessonContext.Provider value={{ isInstitutionalModal, setIsInstitutionalModal, fileIds, setFileIds, contentType, setIsContentType, isInstitutionalPlanOpen, setIsInstutionalPlanOpen, isFileModal,setIsFileModal, lessonRes, setLessonList, setSelectedLessonId, selectedLessonId, handleShareLesson, handleDeleteLesson, markAsComplete, generateLessonPlanFromReview, getLessonList, lessonList, isModalOpen,setIsLessonModalOpen, isSubModalOpen,setIsSubModalOpen, showPreferredSubCategory,setShowPreferredSubCategory, selectedSubCategory,setSelectedSubCategory, selectedCategory, setSelectedCategory, subCategories, setSubCategories, isFinalModalOpen, setIsFinalModalOpen, isSubCategoryelection, setIsSubCategoryelection, isCategorySelection, setIsCategorySelection, selectedTitle, setSelectedTitle, days, setDays, studyTime, setStudyTime, showDifficultyModal, setShowDifficultyModal, createLesson, loadingLesson, isLessonPlanOpen, setIsLessonPlanOpen, selected, setSelected, isTitleSelection,setIsTitleSelection, selectedDifficulty, setSelectedDifficulty, isNewModelOpen, setIsNewModelOpen, isNewLessonOpen,setIsNewLessonOpen,lessonPlan, getLessonData, lessonDetails, getPlanView, lessonPlanView, setLessonPlanView  }}>
      {children}
    </LessonContext.Provider>
  );
};
