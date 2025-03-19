import React, { useEffect, useState } from 'react';
import "@/css/list.css";
import whiteadd from '@/assets/whiteadd.png';
import Image from 'next/image';
import Modal from '@/components/Modal';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { X,Copy, ArrowUp } from 'lucide-react';
import ActionMenu from "./ActionMenu";
import { useParams } from 'next/navigation';
import CopyButton from './CopyButton';
import FileModal from './FileModal';
import ContentModal from './ContentModal';
import categoryData from '@/lib/categoryData';
import Tooltip from './ToolTips';
import { useUser } from '@/context/UserContext';
import FullScreenPopup from './FullScreenPopup';
import InstititionalFileModal from './InstitutionalFileModal';

const simplifiedCategoryData = Object.keys(categoryData).reduce((result, category) => {
  const topics = Object.keys(categoryData[category]?.topics || {});
  result[category] = topics.length > 0 ? topics : ['Miscellaneous'];
  return result;
}, {});
// // Add 'Other' category with 'Miscellaneous' if not already included
// if (!simplifiedCategoryData.Other) {
//   simplifiedCategoryData.Other = ['Miscellaneous'];
// }

const List = ({ btnName }) => {
  const { chatList = [], getChatList, createNewChat, setShowComponent, setShowMenu, showComponent, handleDeleteChat, handleShareChat, shareUrl, setShareUrl, handleRemoveShareChat, isContentModal,setIsContentModal, isModalOpen, setIsModalOpen, isFileModal,setIsFileModal, setChatRes, isInstitutionalModal, setIsInstitutionalModal } = useAuth();

  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isShareComponentVisible, setIsShareComponentVisible] = useState(false);
  const [isUpgradeModal, setIsUpgradeModal] = useState(false);
  const [shareChatId,setShareChatId]=useState();
  const {userData, fetchUserData}=useUser();

  const { id: currentChatId } = useParams();

  useEffect(() => {
    getChatList();
    fetchUserData();
  }, []);
 
  // Group chatList by category
  const groupedChatList = chatList.reduce((acc, chat) => {
    if (!acc[chat.title]) {
      acc[chat.title] = [];
    }
    acc[chat.title].push(chat);
    return acc;
  }, {});

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsSubModalOpen(false);
  };

  const handleContinue = (category) => {
    setSelectedCategory(category);
    setSubCategories(simplifiedCategoryData[category] || []);
    setIsModalOpen(false);
    setIsSubModalOpen(true);
  };

  const handleSubContinue = (subCategory) => {
    createNewChat({ category: selectedCategory, subCategory });
    setIsSubModalOpen(false);
  };

  const handleShare = async(_id ) => {
    setIsShareComponentVisible(true);
    setShareChatId(_id);
    setShareUrl(`..loading`);
    await handleShareChat(_id)
    
  };

  // Delete share link and hide the share component
  const deleteShare = async() => {
    setIsShareComponentVisible(false);
    setShareUrl('');
    await handleRemoveShareChat(shareChatId);
    
  };

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
        {Object.keys(groupedChatList).length > 0 ? (
          Object.entries(groupedChatList).map(([category, chats]) => (
            <div key={category} className="categoryGroup">

              <Tooltip text={category} right={true} bg='white'><h4 className="categoryTitle">{category.length >= 16 ? `${category.slice(0, 18)}...` : category}</h4></Tooltip>

              {chats.map((item) => (
                <div className="listItem" key={item._id} style={{ backgroundColor: currentChatId === item._id ? 'rgb(220 220 220)' : 'transparent' }}>
                  <Link href={`/dashboard/chat/${item._id}`} onClick={()=>setChatRes(null)} className="listTitle" >
                    {item.name.length > 14 ? `${item.name.slice(0, 18)}...` : item.name}
                  </Link>
                  
                  <ActionMenu
                    isShare="1"
                    isDelete="1"
                    onShare={() => handleShare(item._id)}
                    onDelete={() => handleDeleteChat(item._id, currentChatId)}
                  />
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>No chats available.</p>
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
        {userData && userData.role!=='student' && <div className='plan'>
          <p>role </p>
          <div className='upgrade'>
          <p>{userData.role}</p>
        </div>
        </div>}
        { userData && userData.subscriptionPlan=='free' && userData.role=='student' && <Link href="#" onClick={()=>setIsUpgradeModal(true)}><div className='plan'>
          <ArrowUp className='icon'/>
          <p>Plan: Free</p>
          <div className='upgrade'>
          <p>Upgrade</p>
        </div>
        </div></Link>}
        {userData && userData.subscriptionPlan=='premium' && userData.role=='student' &&  <div className='plan'>
          <ArrowUp className='icon'/>
          <p>Plan: Premium</p>
          {/* <div className='upgrade'>
          <p>Upgrade</p>
        </div> */}
        </div>}
        
      </div>

      {isContentModal && (
        <ContentModal
          type="chat"
        />
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
        <Modal
          onClose={handleModalClose}
          onContinue={handleContinue}
          categories={Object.keys(simplifiedCategoryData)}
          isSubCategory={false}
        />
      )}

      {isSubModalOpen && (
        <Modal
          onClose={handleModalClose}
          onContinue={handleSubContinue}
          categories={subCategories}
          isSubCategory={true}
        />
      )}
      {isUpgradeModal && (
        <FullScreenPopup activeSection="subscription" onClose={()=>setIsUpgradeModal(false)} />
        )}

      {/* Share Component */}
      {isShareComponentVisible && (
        <div className="shareComponent">
          <div className="shareContent">
          <X className="closeIcon" onClick={() => setIsShareComponentVisible(false)} />
          <p>Shareable Link:</p>
          <input type="text" value={shareUrl} readOnly className="shareUrlInput" />
          <div style={{display:"flex", gap:"20px", justifyContent:"center", alignItems:"center", padding:"10px"}}>
          <button onClick={deleteShare}className="deleteShareButton">Cancel</button>
          <CopyButton content={shareUrl} ToolTipColor="white"><Copy  color='white' className="copyShareButton"/></CopyButton>
          
          </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
