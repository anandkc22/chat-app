import React, { useContext, useState, useEffect } from 'react'
import './RightSidebar.css'
import assets from '../../assets/assets'
import { logout } from '../../config/firebase'
import { AppContext } from '../../context/AppContext'
import { IoMdArrowBack } from "react-icons/io";

const RightSidebar = () => {

  const {chatUser, messages, profileVisible, setProfileVisible, setChatVisible} = useContext(AppContext);
  const [msgImages, setMsgImages] = useState([]);

  useEffect(() => {
    let tempVar = [];
    messages.map((msg) => {
      if (msg.image) {
        tempVar.push(msg.image);
      }
    })
    setMsgImages(tempVar);
  }, [messages])

  const viewProfile = () => {
    setProfileVisible(false);
    setChatVisible(true);
  }

  return chatUser ? (
    <div className={`rs ${profileVisible ? '' : 'hidden'}`}>
      <IoMdArrowBack onClick={viewProfile} className='arrow-back'/>
      <div className="rs-profile">
        <img src={chatUser.userData.avatar} alt="" />
        <h3>{Date.now() - chatUser.userData.lastSeen <= 70000 ? <img src={assets.green_dot} className='dot' alt="" /> : null} {chatUser.userData.name}</h3>
        <p>{chatUser.userData.bio}</p>
      </div>
      <hr />
      <div className="rs-media">
        <p>Media</p>
        <div>
          {msgImages.map((url, index) => (
            <img key={index} src={url} onClick={() => window.open(url)} alt="" />
          ))}
        </div>
      </div>
      <button onClick={() => logout()}>Logout</button>
    </div>
  )
  : (
    <div className='rs'>
      <button onClick={() => logout()}>Logout</button>
    </div>
  )
}

export default RightSidebar