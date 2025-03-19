import React, { useEffect, useState } from 'react';
import "@/css/list.css";
import whiteadd from '@/assets/whiteadd.png';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { ArrowUp, X } from 'lucide-react';
import categoryData from '@/lib/categoryData';
import LessonPlanModal from './LessonPlanModal';
import { useLesson } from '@/context/LessonContext';
import ActionMenu from './ActionMenu';
import { useParams } from 'next/navigation';
import Tooltip from './ToolTips';
import { useUser } from '@/context/UserContext';
import FullScreenPopup from './FullScreenPopup';

const LessonList = ({ btnName }) => {
  const { setShowMenu, showComponent, setShowComponent } = useAuth();
  const {id:currentLessonId}=useParams();
  const {userData}=useUser();
  const {
    lessonList,
    getLessonList,
    setIsLessonModalOpen,
    setIsSubModalOpen,
    setShowPreferredSubCategory,
    setSelectedSubCategory,
    setSelectedCategory,
    setSubCategories,
    isModalOpen,
    loadingList,
    setSelectedTitle,
    setSelectedcategory,
    setSelected,
    handleDeleteLesson
  } = useLesson();
  const [isUpgradeModal, setIsUpgradeModal] = useState(false);


  const handleModalClose = () => {
    setIsLessonModalOpen(false);
    setIsSubModalOpen(false);
    setShowPreferredSubCategory(false);
    setSelectedSubCategory([]);
  };

  const handleContinue = (category) => {
    setSelectedCategory(category);
    setSubCategories(categoryData[category]?.categorys || []);
    setIsLessonModalOpen(false);
    setIsSubModalOpen(true);
  };

  const handleNewLesson = () => {
    setIsLessonModalOpen(true);
    setSelected(false);
    setSelectedTitle('');
    setSelectedCategory('');
    setSelectedSubCategory([]);
  };

  useEffect(() => {
    getLessonList();
  }, []);

  // Group lessonList by category (e.g., course)
  const groupedLessonList = lessonList.reduce((acc, lesson) => {
    const category = lesson.title || 'Other'; // Adjust the field name to match your lesson data
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(lesson);
    return acc;
  }, {});

  return (
    <div className='listContainer'>
      <div className="head">
        <h3 className="title">Ivy AI Tutor</h3>
        {setShowMenu && showComponent && (
          <X className='closeMenu' alt='close menu' onClick={() => setShowComponent(false)} />
        )}
        <button className="newChatButton" onClick={handleNewLesson}>
          <Image src={whiteadd} width={12} height={12} alt="" />&nbsp;&nbsp;New {btnName}
        </button>
      </div>

      <div className="contentdiv" id="contentdiv">
        {Object.keys(groupedLessonList).length > 0 ? (
          Object.entries(groupedLessonList).map(([category, lessons]) => (
            <div key={category} className="categoryGroup">
            <Tooltip text={category} right={true} bg='white'><h4 className="categoryTitle">{category.length >= 16 ? `${category.slice(0, 18)}...` : category}</h4></Tooltip>
              {lessons.map((item) => (
                <div className="listItem" key={item._id} style={{ backgroundColor: currentLessonId === item._id ? 'rgb(220 220 220)' : 'transparent'}}>
                  <Link
                    href={`/dashboard/lesson/${item._id}`}
                    className="listTitle"
                  >
                    {item.category && item.category.length > 14 ? `${item.category.slice(0, 18)}...` : item.category}
                  </Link>
                  <ActionMenu
                    isShare="0"
                    isDelete="1"
                    onDelete={() => handleDeleteLesson(item._id,currentLessonId)}
                  />
                </div>
              ))}
            </div>
          ))
        ) : (
          loadingList ? <p>..loading</p> : <p>No lesson history available.</p>
        )}
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

      {isModalOpen && (
        <LessonPlanModal
          onClose={handleModalClose}
          onContinue={handleContinue}
          categories={Object.keys(categoryData)}
          isSubCategory={false}
          type="lesson"
        />
      )}
      {isUpgradeModal && (
        <FullScreenPopup activeSection="subscription" onClose={()=>setIsUpgradeModal(false)} />
        )}
    </div>
  );
};

export default LessonList;
