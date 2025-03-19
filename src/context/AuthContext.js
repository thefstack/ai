// context/AuthContext.js
"use client";
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { verifyToken } from '@/utils/jwt';
import { usePathname, useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';  // this is to decode jwt to  get payload data
import { useSession } from "next-auth/react";
import { signOut as logout } from "next-auth/react";
import { getAuthToken } from '@/utils/getAuthToken';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [userRole, setUserRole] = useState(""); // Add user role state
  const [userId, setUserId] = useState('');

  const [chatRes,setChatRes]=useState(null); // store full chat data from response
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [chatData, setChatData] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [loadingChat, setLoadingChat] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false);
  const [subCategory, setSubCategory] = useState("");
  const [category, setCategory] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showComponent, setShowComponent] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [loadingForget,setLoadingForget]=useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [showLoading,setShowLoading]=useState(false)// for showing loading while generating 3 question
  const [isContentModal,setIsContentModal]=useState(false); // for showing content modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFileModal,setIsFileModal]=useState(false); // for showing content modal
  const [isInstitutionalModal, setIsInstitutionalModal]= useState(false)
  

  const router = useRouter()

  // useEffect(() => {
  //   if (status === "loading") {
  //     setLoading(true);
  //     return;
  //   }

  //   setLoading(false);
  // });

  const verifySession = async () => {
    console.log("verifying")
    setLoading(true)
    // Check if token exists in localStorage and verify it
    const token = localStorage.getItem('authToken');

    // console.log("status: ",status)
    if(status=='loading'){
      return;
    }
    if (token || session && session.accessToken) {

      if (token) {
        const payload = await verifyUser(token);
        console.log("payload:",payload)
        if (payload) {
          setIsAuthenticated(true);
          const decoded = jwtDecode(token);
          setUserId(decoded.id);
          setUserRole(decoded.role); // Extract and set user role from token
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('authToken');
          router.push('/signin');
        }
      }
      else {
        if (session && session.accessToken) {
          setUserId(session.user.id); // Assuming user ID is part of the session
          setUserRole(session.user.role); // Assuming role is part of the session

          // If Google login returns an access token, set as authenticated
          setIsAuthenticated(true);
        } else {
          // If no session or token is present, user is not authenticated
          setIsAuthenticated(false);
        }
      }
    } else {
      console.log("verifyToken seems to be false");
      setIsAuthenticated(false);
    }
    setLoading(false);
  }


  const verifyUser = async (token) => {
    try{
      const res=await axios.get('/api/verify-user',{
        headers: {
        Authorization: `Bearer ${token}`,
      }
      })
      if(res.status){
        return true;
      }else{
        return false;

      }
    }catch(error){
      handleSetError(error.response.data.message)
      setIsAuthenticated(false);
          localStorage.removeItem('authToken');
          
          router.push('/signin');

    }
  }

  useEffect(() => {
    verifySession();
  }, [router, session, status]);


  const signUp = async (formData) => {
    setError('');
    setMessage('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/auth/signup', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });


      if (response.data.success) {
        const decodedToken = jwtDecode(response.data.token);

        localStorage.setItem('authToken', response.data.token);
        setUserId(decodedToken.id);
        setUserRole(decodedToken.role); // Extract and set user role from token
        setMessage(response.message);
        setShowPopup(true);
        setIsAuthenticated(true);
        router.push("/signin")

        setTimeout(() => {
          setShowPopup(false);
        }, 3000);
        setLoading(false);
      } else {
        handleSetError(response.data.message);
      }
    } catch (error) {
      handleSetError(error.response.data.message);
      setLoading(false)
    } finally {
      setLoading(false);
    }
  };

  // sign in
  const signIn = async (formData) => {
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/signin', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        const decodedToken = jwtDecode(response.data.token);

        localStorage.setItem('authToken', response.data.token);
        setUserId(decodedToken.id);
        setUserRole(decodedToken.role); // Extract and set user role from token
        setMessage(response.data);
        setShowPopup(true);
        setIsAuthenticated(true);
        return response.data
      } else {
        console.log(response)
        handleSetError(response.data.message)
      }
    } catch (error) {
      console.log("CatchError",error.response.data)
      setLoading(false)
      handleSetError(error.response.data.message)
    } finally {
      setLoading(false);
    }
  }

  const handleSetError = (msg) => {
    setError(msg);
    setTimeout(() => {
      console.log("Hello!")
      setError("");
    }, 3000)
  }

  // signout 
  const signOut = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('authToken');
    logout({ redirect: false }).then(() => {
      // After sign-out, redirect the user manually to the desired page
      router.push('/signin'); // or any other route you prefer
    });
  }

  

  // froget password
  const forgetPassword = async (formData) => {
    setError('');
    setMessage('');
    setLoadingForget(true);
    try {
      const response = await axios.post('/api/auth/forget-password', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
       
        setMessage(response.data.message);
        setShowPopup(true);
        return response.data.message;
      } else {
        handleSetError(response.data.message);
        console.log(response.data)
        return response.data.message;
      }
    } catch (error) {
      handleSetError(error.response.data.message);
      return error.response.data.message;
    } finally {
      setLoadingForget(false);    }
  }

  // reset password
  const resetPassword = async (formData) => {
    setError('');
    setMessage('');
    setLoadingForget(true);
    if (formData.password !== formData.confirmPassword) {
      handleSetError('Passwords do not match');
      setLoading(false);
      return 'Password do not match';
    }

    try {
      const { password, token } = formData;
      // adding password and token in one object
      const sendData = {
        password,
        token
      }
      const response = await axios.post('/api/auth/reset-password', sendData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data)
      if (response.data.success) {
        setMessage(response.data.message);
        setShowPopup(true);
        return response.data.message;
      } else {
        console.log("Invalid")
        handleSetError(response.data.message);
        return response.data.message;
      }

    } catch (error) {
      console.log(error)
      handleSetError(error.response.data.message);
      setLoading(false)
      return error.response.data.message;
    } finally {
      setLoadingForget(false);
    }
  }


  const createNewChat = async (data) => {
    try {
      setLoadingChat(true);
      const token = await getAuthToken();  // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }
      const res = await axios.post("/api/chat", {
        name:"New Chat",
        userId: userId,
        title: data.category,
        category: data.subCategory,
        subCategory: data.subCategory,
        content: []
      },
      {
        headers: {
        Authorization: `Bearer ${token}`,
      }
    })
  //   const newChat = {
  //     chatId: res.data.chatId,
  //     name:"New Chat",
  //     title: data.subCategory,
  //     category: data.category,
  //     subCategory: data.subCategory,
  //     content: []
  // };
  getChatList();
      setShowSuggestions(true);
      router.push(`/dashboard/chat/${res.data.chatId}`);
      // await getFirstThreeQuestion(data.subcategory);
      setLoadingChat(false);
    } catch (error) {
      console.log(error)
      handleSetError(error.response.data.message);
      if(error.status===401){
        window.location.reload();;
      }
      setLoading(false)

    } finally {
      setLoadingChat(false);
    }
  }


  const getChatList = async () => {
    try {
      const token = await getAuthToken();  // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }

      const res = await axios.get("/api/chat", {
        headers: {
        Authorization: `Bearer ${token}`
      },
        params: {
          userId: userId,
          action: "getChatList"
        }
      })
      // console.log(res.data)
      if (res.data.success) {
        setChatList(res.data.chatLists);
      }
    } catch (error) {
      console.log(error)
      handleSetError(error.response.data.message);
      if(error.status===401){
        window.location.reload();;
      }
      setLoading(false)
    } finally {

    }
  }

  const getChatData = async (_id) => {
    try {
      setLoadingChat(true);
      setError('');
      setChatRes(null)

      const token = await getAuthToken();  // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }

     
      const res = await axios.get("/api/chat", {
        headers: {
          Authorization: `Bearer ${token}`
      },
        params: {
          chatId: _id,
          action: "getChatData"
        }
      })
      // console.log(res.data.chatData);
      setChatRes(res.data.chatData);
      if (res.data.chatData.contents.length > 0) {
        setChatData(res.data.chatData.contents);
        // console.log("thi is my title:", res.data.chatData.title)
        setSubCategory(res.data.chatData.title)
        setCategory(res.data.chatData.title);
        setLoadingChat(false);
      } else {
        setChatData([]);
        // If no chat data exists, call `getFirstThreeQuestion`
        const chatSubcategory = res.data.chatData.title;  // Assuming subcategory is available
        setShowSuggestions(true);
        // await getFirstThreeQuestion(res.data.chatData.title);
        setSubCategory(chatSubcategory);
        setCategory(res.data.chatData.title);
        setLoadingChat(false);
      }
    } catch (error) {
      handleSetError(error.response.data.message)
      console.log(error)
      console.log(error.response.data);
      if(error.response.status(401)){
        return window.location.reload();;
      }
      router.push("/dashboard/chat")
    } 
  }

  const saveChat = async ({ chatId, question, answer, usage }) => {
    try {
      const token = await getAuthToken();  // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }
      const res = await axios.put('/api/chat', {
        chatId, question, answer, usage
      },{
        headers: {
          Authorization: `Bearer ${token}`
      }
      })

      let updatedChatList;
      if(chatData.length==0){
        updatedChatList = chatList.map((item) =>
          item._id === chatId ? { ...item, name: question } : item
        );
        setChatList(updatedChatList);
      }
    } catch (error) {
      console.log(error)
      if(error.status===401){
        window.location.reload();;
      }
    }
  }
  

  const getFirstThreeQuestion = async (subject) => {
    try {
      setLoadingChat(true);
      console.log('Session:', session);
console.log('Status:', status);
      console.log(subject)
      const token = await getAuthToken();  // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }
      const res = await axios.post("/api/generatePrompts", {
        headers: {
          Authorization: `Bearer ${token}`
      },
      withCredentials:true
      },{
        subject: subject
      })
      console.log(res.data.questions);
      setSuggestedQuestions(res.data.questions.slice(0, 3));
    } catch (error) {
      console.log(error)
      console.log(error.response.data);
      if(error.status===401){
        window.location.reload();;
      }
    } finally {
      setLoadingChat(false);
    }
  }


  const handleDeleteChat = async (chatId,paramsId) => {
    try {
      const token = await getAuthToken();  // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }
      
      await axios.delete(`/api/chat?action=deleteChat&chatId=${chatId}`,{
        headers: {
          Authorization: `Bearer ${token}`
      }
      });

      if(paramsId==chatId){
        console.log("delete")
        router.push("/dashboard/chat");
      }
      // console.log("Chat deleted:", chatId);
       // Filter out only the specific chat with `chatId` from the `chatList`
    setChatList(prevChatList => 
      prevChatList.filter(chat => chat._id !== chatId)
    );
    
      setSelectedChatId(null);
    } catch (error) {

      console.error("Error deleting chat:", error);
      if(error.status===401){
        window.location.reload();;
      }
    }
  };

  const handleShareChat = async(chatId) => {
    try {
      const token = await getAuthToken();  // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }
      console.log("Token in chat Share",token)
      const res=await axios.patch(`/api/chat?action=shareChat&chatId=${chatId}`,{},{
        headers: {
          Authorization: `Bearer ${token}`
      }
      });
      console.log(res)
      if(res.data.shareStatus===true)
      {
        setShareUrl(`${window.location.origin}/share/chat/${chatId}`);
      }else{
        setShareUrl(`Share Status Removed`);
      }

    } catch (error) {
      console.error("Error deleting chat:", error);
      if(error.status===401){
        window.location.reload();;
      }
      setShareUrl("Error Generating Share URL")
    }
  };

  const handleRemoveShareChat = async(chatId) => {
    try {
      const token = await getAuthToken();  // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }
 
      const res=await axios.patch(`/api/chat?action=removeShare&chatId=${chatId}`,{},{
        headers: {
          Authorization: `Bearer ${token}`
      }
      });
      console.log(res)
      if(res.data.shareStatus===true)
      {
        setShareUrl(`${window.location.origin}/share/chat/${chatId}`);
      }else{
        setShareUrl(`Share Status Removed`);
      }

    } catch (error) {
      console.error("Error deleting chat:", error);
      if(error.status===401){
        window.location.reload();;
      }
      setShareUrl("Error Generating Share URL")
    }
  };

  const getShareChat=async(_id)=>{
    setLoading(true)
    try{
      const res=await axios.get(`/api/share?action=getChatData&chatId=${_id}`)
      
      if (res.data.chatData.contents.length > 0) {

        setChatData(res.data.chatData.contents);
        // console.log("thi is my title:", res.data.chatData.title)
        setSubCategory(res.data.chatData.title)
        setLoadingChat(false);
        return true;

        
      } else {
        router.push('/signin')
        return false;
        
      }
      
    }catch(error){
      if(error.response.status(401)){
        return window.location.reload();;
      }
      router.push('/signin')
      return false;
    }
  }

  //handleResponse Feedback
  const handleResponseFeedback=async(_id,responseFeedback)=>{

    try{
      const token = await getAuthToken();  // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }
      const res=await axios.patch(`/api/chat?action=responseFeedback&chatId=${_id}&feedback=${responseFeedback}`,{},{
        headers: {
          Authorization: `Bearer ${token}`
      }
      })
      
    }catch(error){
      console.error("Error sending feedback:", error);
      if(error.status===401){
        window.location.reload();;
      }
    }
  }


   //handleResponse Feedback
   const SaveResponseUnderstand=async(_id,responseFeedback)=>{

    try{
      const token = await getAuthToken();  // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }
      const res=await axios.patch(`/api/chat?action=saveResponseUnderstand&chatId=${_id}&feedback=${responseFeedback}`,{},{
        headers: {
          Authorization: `Bearer ${token}`
      }
      })
      
    }catch(error){
      console.error("Error sending feedback:", error);
      if(error.status===401){
        window.location.reload();;
      }
    }
  }

  //handleResponse Feedback
  const handleSaveQuestions=async(_id,questions)=>{

    try{

      const token = await getAuthToken();  // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }
      const res=await axios.patch(`/api/chat?action=saveQuestions&chatId=${_id}`,{
        questions
      },{
        headers: {
          Authorization: `Bearer ${token}`
      }
      })
      
    }catch(error){
      console.error("Error sending feedback:", error);
      if(error.status===401){
        window.location.reload();;
      }
    }
  }


  return (
    <AuthContext.Provider value={{ isInstitutionalModal, setIsInstitutionalModal, handleSaveQuestions, handleSetError, chatRes, setChatRes, isFileModal,setIsFileModal, isModalOpen, setIsModalOpen, isContentModal,setIsContentModal, SaveResponseUnderstand, handleResponseFeedback, getShareChat, handleRemoveShareChat, shareUrl, setShareUrl, loadingForget, handleDeleteChat, handleShareChat, signUp, signIn, signOut, verifyUser, forgetPassword, resetPassword, error, message, loading, showPopup, isAuthenticated, setLoading, createNewChat, getChatList, getChatData, chatList, chatData, loadingChat, getFirstThreeQuestion, questions, saveChat, showMenu, setShowMenu, showComponent, setShowComponent, setSuggestedQuestions, subCategory ,userId, setChatList,selectedChatId, setChatData, showLoading, setShowLoading, category, userRole,}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
