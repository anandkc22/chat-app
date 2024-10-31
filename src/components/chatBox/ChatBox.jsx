import React, { useContext, useEffect, useState } from 'react'
import './ChatBox.css'
import assets from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { toast } from 'react-toastify'
import upload from '../../lib/upload'
import { IoMdArrowBack } from "react-icons/io";

const ChatBox = () => {

  const { userData, messagesId, chatUser, messages, setMessages, chatVisible, setChatVisible, profileVisible, setProfileVisible } = useContext(AppContext);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    try {
      if (input && messagesId) {
        await updateDoc(doc(db, 'messages', messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            text: input,
            createdAt: new Date()
          })
        })
        const userIDs = [chatUser.rId, userData.id];

        userIDs.forEach(async (id) => {
          const userChatsRef = doc(db, 'chats', id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data();
            const chatIndex = userChatData.chatData.findIndex((c) => c.messageId === messagesId);
            userChatData.chatData[chatIndex].lastMessage = input.slice(0, 30);
            userChatData.chatData[chatIndex].updatedAt = Date.now();

            if (userChatData.chatData[chatIndex].rId === userData.id) {
              userChatData.chatData[chatIndex].messageSeen = false;
            }
            await updateDoc(userChatsRef, {
              chatData: userChatData.chatData
            })
          }
        })
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
    setInput("");
  }

  const sendImage = async (e) => {
    try {
      const fileUrl = await upload(e.target.files[0]);

      if (fileUrl && messagesId) {
        await updateDoc(doc(db, 'messages', messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            image: fileUrl,
            createdAt: new Date()
          })
        })

        const userIDs = [chatUser.rId, userData.id];

        userIDs.forEach(async (id) => {
          const userChatsRef = doc(db, 'chats', id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data();
            const chatIndex = userChatData.chatData.findIndex((c) => c.messageId === messagesId);
            userChatData.chatData[chatIndex].lastMessage = "Image";
            userChatData.chatData[chatIndex].updatedAt = Date.now();

            if (userChatData.chatData[chatIndex].rId === userData.id) {
              userChatData.chatData[chatIndex].messageSeen = false;
            }
            await updateDoc(userChatsRef, {
              chatData: userChatData.chatData
            })
          }
        })
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }

  const convertTimeStamp = (timestamp) => {
    let date = timestamp.toDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    if (hours > 12) {
      return hours - 12 + ':' + minutes + " PM"
    }
    else {
      return hours + ':' + minutes + " AM"
    }
  }

  useEffect(() => {
    if (messagesId) {
      const unSub = onSnapshot(doc(db, 'messages', messagesId), (res) => {
        setMessages(res.data().messages.reverse())
      })

      return () => {
        unSub();
      }
    }
  }, [messagesId])

  const viewProfile = () => {
    setProfileVisible(true);
    setChatVisible(false);
  }
  

  return chatUser ? (
    <div className={`chat-box ${chatVisible ? '' : 'hidden'}`}>
      <div className="chat-user">
      <IoMdArrowBack onClick={() => setChatVisible(false)} className='arrow-icon'/>
        <img src={chatUser.userData.avatar} alt="" onClick={viewProfile}/>
        <p>{chatUser.userData.name} {Date.now() - chatUser.userData.lastSeen <= 70000 ? <img className='dot' src={assets.green_dot} alt="" /> : null}</p>
        <img src={assets.help_icon} className='help' alt="" />
      </div>

      <div className="chat-msg">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sId === userData.id ? 's-msg' : 'r-msg'}>
            {msg["image"]
            ? <img className='msg-img' src={msg.image} alt="" />
            : <p className="msg">{msg.text}</p>
            }
            <div>
              <img src={msg.sId === userData.id ? userData.avatar : chatUser.userData.avatar} alt="" />
              <p>{convertTimeStamp(msg.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='send a message...' />
        <input onChange={sendImage} type="file" id='image' accept='image/png, image/gif, image/jpeg' hidden />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img onClick={sendMessage} src={assets.send_button} alt="" />
      </div>
    </div>
  )
  : <div className={`chat-welcome ${chatVisible ? '' : 'hidden'}`}>
    <img src={assets.logo_icon} alt="" />
    <p>Chat anytime, anywhere</p>
  </div>
}

export default ChatBox