"use client";
import axios from 'axios';
import { createContext, useContext } from 'react';
import { useState } from 'react'
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import formattedDate from '@/utils/FormatDate';
import { getAuthToken } from '@/utils/getAuthToken';


// Create the QuizContext
const QuizContext = createContext();

// Custom hook for consuming the context
export const useQuiz = () => useContext(QuizContext);

// UserProvider component to wrap around the app
export const QuizProvider = ({ children }) => {

  const router = useRouter();
  const {handleSetError}=useAuth();

  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [showPreferredTopics, setShowPreferredTopics] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [quizData, setQuizData] = useState([]);
  const [quizList, setQuizList] = useState([]);
  const [showQuiz, setShowQuiz] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [showReview, setShowReview] = useState(false);  // to show review
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]); // store user selected answer and the answer stored in database
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [showSuggestions, setShowSuggestions] = useState("");
  const [score, setScore] = useState(null);  // userd to store the calculated score of user and the score that is stored in database
  const [quizId, setQuizId] = useState(null); // used to store quizId
  const [quizTopic, setQuizTopic] = useState([]);   // this state is used for storing all the subtopics and this stores the third component topic list when new quiz is clicked
  const [questionAndOption, setQuestionAndOption] = useState([])  // this state is for storing question and option that will be send to ai for review
  const [selectedTool, setSelectedTool] = useState(""); // this tste is for selecting the second category
  const [loadingReview, setLoadingReview] = useState(false) // this state is for loading Quiz review when generating review or to render loading while the review is generating

  const [dynamicContent, setDynamicContent] = useState('');// this is for storing the review that we get from ai also to store the review that we get from database.

  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [rankResponse, setRankResponse] = useState({});
  const [rankChecked, setRankChecked] = useState(false); // Added state

  const [selectedDifficulty, setSelectedDifficulty] = useState("");// selected Difficulty of Quiz
  const [isFileModal, setIsFileModal] = useState(false); // for showing content modal
  const [isContentModal, setIsContentModal] = useState(false); // for showing content modal
  const [isInstitutionalModal, setIsInstitutionalModal]=useState(false)

  const [quizRes, setQuizRes] = useState(null);

  const { userId } = useAuth();


  // this is for OnSubmit in Quiz
  const onSubmit = async (updatedAnswers) => {
    setScore(calculateScore(updatedAnswers));
    setUserAnswers(updatedAnswers)
    saveUserAnswer(updatedAnswers)
    setShowQuiz(false);
    setLoadingReview(true)
    setShowReview(true);
  };


  // Function to fetch dynamic content based on selected topics
  const fetchDynamicContent = async () => {
    try {
      setLoadingReview(true);
      const token = await getAuthToken();  // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }
      console.log(quizRes)
      if (quizRes.personalContent == false) {
        const response = await fetch('/api/generateQuizSummary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            selectedTopics: quizTopic,
            question: questionAndOption,
            userAnswers: userAnswers
          }),
        });
        const data = await response.json();
        if (response.ok) {
          // console.log(data)
          setDynamicContent(data.generatedText);
          return data;
        } else {
          handleSetError("error")
          console.error(data.error);
        }

      } else {
        const response = await fetch(`/api/quizAssistant?action=getQuizSummary&quizId=${quizId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            selectedTopics: quizTopic,
            question: questionAndOption,
            userAnswers: userAnswers
          })
        });
        const data = await response.json();
        if (response.ok) {
          // console.log(data)
          setDynamicContent(data.generatedText);
          return data;
        } else {
          console.error(data.error);
          handleSetError("error")
        }
      }
      setLoadingReview(false);
    } catch (error) {
      handleSetError("error")
      console.error('Error fetching dynamic content:', error);
      if(error.status===401){
        window.location.reload();;
      }
    }
  };


  // calculate Quiz score of the quiz
  const calculateScore = (userAnswers) => {
    if (questions.length === 0) return 50;
    let correctAnswer = 0;
    for (let i = 0; i < questions.length; i++) {
      // console.log(questions[i].answer)

      if (questions[i].answer == userAnswers[i]) {
        correctAnswer += 1;
      }
    }

    if (correctAnswer == 0)
      return 0;

    const score = (correctAnswer / questions.length) * 100;
    return parseFloat(score.toFixed(2));
  };

  const createNewQuiz = async (data) => {
    try {

      // const token = localStorage.getItem('authToken');
      // const userId = await jwtDecode(token).id;

      // this is to eextract the data and format that data to store in database
      console.log("create new quiz function:", data)
      const transformedQuizData = data.questions.map(question => {
        // Filter options to only include text and label
        // console.log(question)
        const filteredOptions = question.options.map(option => ({
          text: option.text || '',
          label: option.label
        }));

        // Find the correct answer (text of the option where isCorrect is true)
        // console.log(question)
        const correctAnswer = question.options.find(option => option.isCorrect);
        // console.log(correctAnswer)

        return {
          question: question.text || "no Question text",
          options: filteredOptions,
          answer: correctAnswer.text || ""
        };
      });

      setQuestionAndOption(transformedQuizData)

      const token = await getAuthToken();  // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }
      const res = await axios.post("/api/quiz", {
        userId: userId,
        title: selectedCategory,
        category: selectedTool,
        contents: transformedQuizData,
        subCategory: selectedTopics,
        tokenUsageInGeneratingQuestions: data.tokenUsage,
        selectedDifficulty
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      getQuizList();
      router.push(`/dashboard/quiz/${res.data.quizId}`)
      setShowSuggestions(true);
    } catch (error) {
      handleSetError("error while creating quiz");
      console.log(error)
      setLoading(false)
      if(error.status===401){
        window.location.reload();;
      }
    }
  }

  // we fetch the total no of quizes the user has created
  const getQuizList = async () => {
    try {
      // const token=localStorage.getItem('authToken');
      // const userId= await jwtDecode(token).id

      const token = await getAuthToken();  // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }
      const res = await axios.get("/api/quiz", {
        params: { userId: userId, action: "getQuizList" },
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setQuizList(res.data.quizLists);
      }
    } catch (error) {
      console.log(error)
      handleSetError("error while fetching quiz list")
      setError(error.response.data.message);
      setLoading(false)
      if(error.status===401){
        window.location.reload();;
      }
    } finally {
      setLoading(false);
    }
  }

  const getQuizData = async (_id) => {
    try {

      setShowQuiz(true);
      setLoading(true);
      setQuestions([]);
      const token = await getAuthToken();  // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }
      const res = await axios.get("/api/quiz", {
        params: {
          quizId: _id,
          action: "getQuizData"
        }, headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setQuizRes(res.data.quizData)

      // is quiz is already attempted then no need to show QuizInterface component show QuizReview Component
      // console.log("quiz api response in getQuizData function:", res.data.quizData)
      setQuizId(res.data.quizData._id)
      if (res.data.quizData.isAttempted == true) {
        console.log("this quiz is already attempted");
        setShowQuiz(false);

        setQuizTopic(res.data.quizData.subCategory);
        console.log("this is your recorded score:", res.data.quizData.score)
        setScore(res.data.quizData.score);
        const filterQuestions = res.data.quizData.contents.filter((item) => {
          return item.question, item.options
        })
        // console.log("this is filtered Questio:", filterQuestions)

        setQuestions(filterQuestions)
        setUserAnswers(res.data.quizData.userAnswer)
        setQuizTitle(res.data.quizData.title)
        setSelectedTool(res.data.quizData.category)
        setDynamicContent(res.data.quizData.review)
        setLoading(false)
        setShowReview(true);
        return;
      }

      // if quiz is not attempted
      if (res.data.quizData.contents.length > 0) {
        setQuestions(res.data.quizData.contents);
        setQuestionAndOption(res.data.quizData.contents) // setting question and options to send for review after submitting
        setSelectedTool(res.data.quizData.category)
        setQuizTopic(res.data.quizData.subCategory)
        setQuizTitle(res.data.quizData.title)
        setLoading(false);
      } else {
        setQuestions([])
        console.log(res);
        // If no chat data exists, call `getFirstThreeQuestion`
        const quizSubcategory = res.data.quizData.title;  // Assuming subcategory is available
        setShowSuggestions(true);
        // await getFirstThreeQuestion(res.data.chatData.title);
        console.log("response title  :", quizSubcategory)
        setQuizTitle(quizSubcategory)
        setLoading(false)
      }
    } catch (error) {
      console.log(error);
      if(error.status===401){
        window.location.reload();;
      }
      handleSetError("error while fetching data")
      router.push("/dashboard/quiz")
      setLoadingQuiz(false)
      
    } finally {
      setLoadingQuiz(false)
    }
  }

  const saveUserAnswer = async (userAnswers) => {
    try {
      setLoadingReview(true);

      const token = await getAuthToken();  // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }
      const userScore = calculateScore(userAnswers);
      const generatedReview = await fetchDynamicContent();

      const res = await axios.put('/api/quiz', {
        quizId, userAnswer: userAnswers, score: userScore, review: generatedReview.generatedText, tokenUsageInGeneratingReview: generatedReview.tokenUsage
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setLoadingReview(false)
      console.log(res);
    } catch (error) {
      handleSetError("error")
      console.log(error);
      if(error.status===401){
        window.location.reload();;
      }
    }
  }


  const createNewQuizBasedOnLessonPlan = async (selectedTopics, numberOfQuestions, lessonDetails, module,lessonRes) => {
    try {
      setLoadingQuiz(true);
      const token = await getAuthToken();  // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }
      const response = await fetch('/api/generateQuestionsFromLesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ topics: selectedTopics, numberOfQuestions, selectedDifficulty: lessonDetails.selectedDifficulty, module,lessonRes }),
      });

      if (!response.ok) {
        // Read the response body as JSON
    const errorData = await response.json();
    // Display the error message
    console.error("Error:", errorData.message || "Unknown error occurred");
      handleSetError(errorData.message || "error while fetching")
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data.questions)) {
        setQuestions(data.questions);
        setShowQuiz(true);


        // this is to extract the data and format that data to store in database
        const transformedQuizData = data.questions.map(question => {
          // Filter options to only include text and label
          // console.log(question)
          const filteredOptions = question.options.map(option => ({
            text: option.text || '',
            label: option.label
          }));

          // Find the correct answer (text of the option where isCorrect is true)
          // console.log(question)
          const correctAnswer = question.options.find(option => option.isCorrect);
          // console.log(correctAnswer)

          return {
            question: question.text || "no Question text",
            options: filteredOptions,
            answer: correctAnswer.text || ""
          };
        });

        setQuestionAndOption(transformedQuizData)
        // console.log("this is filtered data before storing:", transformedQuizData);

        const token = await getAuthToken();  // Retrieve the token using the utility function

        if (!token) {
          throw new Error("No authentication found");
        }
        // console.log(lessonRes)
        const res = await axios.post("/api/quiz", {
          userId: userId,
          title: lessonDetails.selectedTitle,
          category: lessonDetails.selectedCategory,
          contents: transformedQuizData,
          subCategory: lessonDetails.selectedSubCategory,
          selectedDifficulty: lessonDetails.selectedDifficulty,
          tokenUsageInGeneratingQuestions:data.tokenUsage,
          personalContent:lessonRes.personalContent
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        getQuizList();
        router.push(`/dashboard/quiz/${res.data.quizId}`)
        setShowSuggestions(true);
      } else {
        setQuestions([]);
        setShowQuiz(false);
        handleSetError("error")
      }
    } catch (error) {
      console.log(error);
      handleSetError("error while creating lesson plan")
      if(error.status===401){
        window.location.reload();;
      }
    }
  }





  const handleDeleteQuiz = async (quizId, currentQuizId) => {
    try {
      const token = await getAuthToken();  // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }
      await axios.delete(`/api/quiz?action=deleteQuiz&quizId=${quizId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (currentQuizId == quizId) {
        router.push("/dashboard/quiz");
      }

      setQuizList(prevState => prevState.filter(quiz => quiz._id !== quizId));
      setSelectedQuizId(null);
    } catch (error) {
      console.error("Error deleting chat:", error);
      handleSetError("error deleting quiz")
      if(error.status===401){
        window.location.reload();;
      }
    }
  };

  const checkRank = async (quizId, quizTitle, selectedTool) => {
    try {
      const token = await getAuthToken();  // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }
      const res = await axios.get(`/api/quiz`, {
        params: { chatId: quizId, title: quizTitle, category: selectedTool, action: "getQuizRank" },
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(res.data)
      // console.log("getQuizList:", res)
      if (res.data.success) {
        const totalStudents = res.data.totalStudents;

        let percentile;
        if(totalStudents==1){
          percentile=100;
        }else{
        percentile = ((res.data.lowerScoreCount / totalStudents) * 100).toFixed(2);
        }
        
        console.log("percentile:",percentile)
        setRankResponse({ ...res.data, percentile:parseFloat(percentile) });
      }
    } catch (error) {
      console.log(error)
      setError(error.response.data.message);
      handleSetError("error checking rank")
      if(error.status===401){
        window.location.reload();;
      }

    } finally {
      setRankChecked(true);
    }
  }




  const handleShareQuiz = (quizId) => {
    console.log("share QuizId :", quizId)
  }



  return (
    <QuizContext.Provider value={{ isInstitutionalModal, setIsInstitutionalModal, quizRes, setQuizRes, isContentModal, setIsContentModal, isFileModal, setIsFileModal, isModalOpen, setIsModalOpen, selectedDifficulty, setSelectedDifficulty, rankChecked, setRankChecked, handleDeleteQuiz, handleShareQuiz, createNewQuizBasedOnLessonPlan, createNewQuiz, getQuizData, getQuizList, selectedTopics, setSelectedTopics, quizList, isModalOpen, setIsModalOpen, selectedCategory, setSelectedCategory, subCategories, setSubCategories, setIsSubModalOpen, isSubModalOpen, showPreferredTopics, setShowPreferredTopics, showLoading, setShowLoading, showQuiz, setShowQuiz, questions, setQuestions, showReview, setShowReview, currentQuestionIndex, setCurrentQuestionIndex, selectedOption, setSelectedOption, quizData, userAnswers, setUserAnswers, onSubmit, quizTitle, calculateScore, loadingQuiz, setLoadingQuiz, loading, score, setLoading, quizTopic, setQuizTopic, questionAndOption, dynamicContent, selectedTool, setSelectedTool, loadingReview, selectedQuizId, setSelectedQuizId, quizId, checkRank, rankResponse }}>
      {children}
    </QuizContext.Provider>
  );
};
