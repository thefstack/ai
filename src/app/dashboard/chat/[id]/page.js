"use client";
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import ChatInterface from '@/components/ChatInterface';
import { useAuth } from '@/context/AuthContext';
// import List from '@/components/List'; // Chat list component
import Loading from '@/components/Loading';

const ChatDetailPage = () => {
  const { id } = useParams(); // Get the dynamic route param 'id'
  const { getChatData, chatData, loadingChat } = useAuth();


  useEffect(() => {
    if (id) {
      getChatData(id); // Fetch chat data by ID when the component mounts
    }
  }, [id]);



  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Chat list on the left
      <div style={{ width: '180px', borderRight: '1px solid #ddd' }}>

      </div> */}
      {/* Chat interface on the right */}
      <div style={{ width: '100%'}}>
        {loadingChat ? (
          <Loading text='Loading your chat data'/>
        ) : (
          <ChatInterface/>
        )}
      </div>
    </div>
  );
};

export default ChatDetailPage;
