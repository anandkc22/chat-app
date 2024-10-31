import React, { useContext, useEffect, useState } from 'react'
import './Chat.css'
import LeftSidebar from '../../components/leftSidebar/LeftSidebar'
import RightSidebar from '../../components/rightSidebar/RightSidebar'
import ChatBox from '../../components/chatBox/ChatBox'
import { AppContext } from '../../context/AppContext'

const Chat = () => {

  const {userData, chatData} = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (chatData && userData) {
      setLoading(false);
    }
  }, [chatData, userData])

  return (
    <>
      {loading 
      ? <div className="loading-spinner">
          <div className="spinner"></div>
      </div>
      
      : <div className='chat-container'>
          <LeftSidebar />
          <ChatBox />
          <RightSidebar />
        </div>
      }
    </>
  )
}

export default Chat