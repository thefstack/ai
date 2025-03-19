import React, { useEffect, useState } from 'react';
import "@/css/list.css";
import whiteadd from '@/assets/whiteadd.png';
import Image from 'next/image';
import { X, ChevronUp, ArrowUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useQuiz } from '@/context/QuizContext';
import QuizModal from './QuizModal';
import PreferredTopics from './PreferedTopics';
import categoryData from '@/lib/categoryData';
import Link from 'next/link';
import { getAuthToken } from '@/utils/getAuthToken';
import ActionMenu from './ActionMenu';
import { useParams } from 'next/navigation';
import { formattedDate } from '@/utils/FormatDate';
import QuizContentModal from './QuizContentModal';
import FileModal from './FileModal';
import Tooltip from './ToolTips';
import { useUser } from '@/context/UserContext';
import FullScreenPopup from './FullScreenPopup';
import InstititionalFileModal from './InstitutionalFileModal';

const QuizList = ({ btnName }) => {

  const {id:currentQuizId}=useParams();
  const {handleSetError}=useAuth()
  const [expandedTitle, setExpandedTitle] = useState({}); // Track expanded titles
  const {userData}=useUser()
    const [isUpgradeModal, setIsUpgradeModal] = useState(false);
  

  const toggleTitle = (title) => {
    setExpandedTitle((prevExpandedTitle) => ({
      ...prevExpandedTitle,
      [title]: !prevExpandedTitle[title], // Toggle the expanded state
    }));
  };

  useEffect(() => {
    getQuizList();
  }, []);


  const {setShowMenu, showComponent, setShowComponent}=useAuth()

  const {isModalOpen, setIsModalOpen, isSubModalOpen, setIsSubModalOpen, showPreferredTopics, setShowPreferredTopics, showQuiz,setShowQuiz, showLoading, setShowLoading, showReview, setShowReview, subCategories, setSubCategories, selectedCategory, setSelectedCategory, selectedTool, setSelectedTool, questions, setQuestions, userAnswers,seUserAnswers, quizData, quizList, getQuizList, createNewQuiz,setLoadingQuiz,setSelectedTopics, setLoading, handleShareQuiz, handleDeleteQuiz, selectedDifficulty, isContentModal,setIsContentModal, isFileModal,setIsFileModal, isInstitutionalModal, setIsInstitutionalModal }=useQuiz();



  const handleModalClose = () => {
      setIsModalOpen(false);
      setIsSubModalOpen(false);
      setShowPreferredTopics(false);
      setShowQuiz(false);
      setShowReview(false);
      setSelectedTopics([]);
  };

  // Handles category selection and opens subcategory modal
  const handleContinue = (category) => {
      setSelectedCategory(category);
      setSubCategories(categoryData[category]?.tools || []); // Get tools from category data
      setIsModalOpen(false);
      setIsSubModalOpen(true);
  };

  // Handles subcategory selection (tool) and opens topics selection modal
  const handleSubContinue = (tool) => {
      setSelectedTool(tool); // Set selected tool (subcategory)
      setShowPreferredTopics(true); // Show topics selection modal
      setIsSubModalOpen(false);
  };

  const handlePreferredTopicsContinue = async (selectedTopics) => {

    console.log("handle Prefered topics")
      setShowPreferredTopics(false);
      setShowLoading(true);
      setLoadingQuiz(true);
      // console.log("true hai bhai ")
      if(selectedTopics.length === 0){
          setLoading(false);
          return;
      }

      setSelectedTopics(selectedTopics);
      // const numberOfQuestions = selectedTopics.length<=1 ? 10 : 20;
      const numberOfQuestions = 10;
      try {
        const token = await getAuthToken();  // Retrieve the token using the utility function
        if (!token) {
          throw new Error("No authentication found");
        }
          const response = await fetch('/api/generateQuestions', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ topics: selectedTopics, numberOfQuestions, selectedDifficulty, selectedCategory, selectedTool  }),
          });

          if (!response.ok) {
            const errorData = await response.json();
    // Display the error message
    console.error("Error:", errorData.message || "Unknown error occurred");
      handleSetError(errorData.message || "error while fetching")
        throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("data: ",data)

          if (Array.isArray(data.questions)) {
              setQuestions(data.questions);
              setShowQuiz(true);
              createNewQuiz(data);
          } else {
              setQuestions([]);
              setShowQuiz(false);
          }
      } catch (error) {
          setQuestions([]);
          setShowQuiz(false);
          
      } finally {
          setShowLoading(false);
          setLoading(false);
          setLoadingQuiz(false)
      }
  };


  // Group quiz lists by title (course name)
  const groupedQuizzes = quizList.reduce((acc, quiz) => {
    const { title, category, _id, score, isAttempted, createdAt } = quiz;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({ _id, score, isAttempted, createdAt });
    return acc;
  }, {});

  const handleContentModal=()=>{
    setIsContentModal(true)
  }


  return (
    <div className='listContainer'>
      <div className="head">
        <h3 className="title">Ivy AI Tutor</h3>
        {setShowMenu && showComponent && (
          <X className='closeMenu' alt='close menu' onClick={() => setShowComponent(false)} />
        )}
        <button className="newChatButton" onClick={handleContentModal}>
          <Image src={whiteadd} width={12} height={12} alt="" />&nbsp;&nbsp;New {btnName}
        </button>
      </div>
      
      <div className="contentdiv" id="contentdiv">
      {quizList.length==0 && <p style={{textAlign:"center"}}>No recent quiz available</p>}
        {Object.keys(groupedQuizzes).map((title) => (
          <div key={title} style={{ marginTop: '15px', textAlign: "left"  }}>
            <Tooltip text={title} right={true} bg='white'>
            <p
              onClick={() => toggleTitle(title)}
              style={{ cursor: 'pointer', color: 'black', display: "flex", alignItems: 'center', width:"100%", textAlign:"left" }}
            >
{title.length > 16 ? `${title.slice(0, 18)}...` : title}
            </p>
            </Tooltip>
            
              <div className="quizListLink" style={{display: "flex", flexDirection: "column"}}>
                {groupedQuizzes[title].map(({ _id, score, isAttempted, createdAt }) => (
                  <div key={_id} className="quizLinkContainer" style={{ backgroundColor: currentQuizId === _id ? 'rgb(220 220 220)' : 'transparent'}}>
                  <Link href={`/dashboard/quiz/${_id}`} key={_id} className='links' >
                    <p>{formattedDate(createdAt)}</p>
                    {isAttempted==true && <p style={{ color: '#fff', fontSize:"0.8rem", backgroundColor:"#00496B", borderRadius:"5px", padding:"2px 5px", fontSize:"0.8rem"}}> {Math.round(score)}%</p>}
                    
                  </Link>
                  <ActionMenu
                      isShare="0"
                      isDelete="1"
                      onDelete={() => handleDeleteQuiz(_id,currentQuizId)}
                    />
                  </div>
                ))}
              </div>
            
          </div>
        ))}
      </div>
      <div className='planTypeContainer'>
      {!userData && <Link href="#" onClick={()=>setIsUpgradeModal(true)}><div className='plan'>
          <ArrowUp className='icon'/>
          <p>Plan: Free</p>
          <div className='upgrade'>
          <p>Upgrade</p>
        </div>
        </div></Link>}
        {userData && userData.subscriptionPlan=='free' && <Link href="#" onClick={()=>setIsUpgradeModal(true)}><div className='plan'>
                  <ArrowUp className='icon'/>
                  <p>Plan: Free</p>
                  <div className='upgrade'>
                  <p>Upgrade</p>
                </div>
                </div></Link>}
                {userData && userData.subscriptionPlan=='premium' &&  <div className='plan'>
                  <ArrowUp className='icon'/>
                  <p>Plan: Premium</p>
                  {/* <div className='upgrade'>
                  <p>Upgrade</p>
                </div> */}
                </div>}
        
      </div>

      {isContentModal && (
        <QuizContentModal type="quiz"/>
      )}
      {isInstitutionalModal && (
        <InstititionalFileModal
          onClose={()=>setIsInstitutionalModal(false)}
        />
      )}

      {isFileModal && (
        <FileModal 
          onClose={()=>setIsFileModal(false)}
        />
      )}

      {isModalOpen && (
        <QuizModal
          onClose={handleModalClose}
          onContinue={handleContinue}
          categories={Object.keys(categoryData)} // Pass main categories
          isSubCategory={false}
        />
      )}

      {isSubModalOpen && (
        <QuizModal
          onClose={handleModalClose}
          onContinue={handleSubContinue}
          categories={subCategories}  // Pass tools (subcategories)
          isSubCategory={true}
        />
      )}
      {isUpgradeModal && (
              <FullScreenPopup activeSection="subscription" onClose={()=>setIsUpgradeModal(false)} />
              )}
      
      {showPreferredTopics && (
        <PreferredTopics
          onClose={handleModalClose}
          selectedCategory={selectedCategory}
          onContinue={handlePreferredTopicsContinue}
          selectedTool={selectedTool}
          onLoading={setShowLoading}
        />
      )}
    </div>
  );
};

export default QuizList;
