import React, { useContext, useEffect, useState } from 'react';
import './ProfileUpdate.css';
import assets from '../../assets/assets';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import upload from '../../lib/upload';
import { AppContext } from '../../context/AppContext';

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const [preImage, setPreImage] = useState("");
  const {setUserData} = useContext(AppContext);

  const profileUpdate = async (event) => {
    event.preventDefault();
    try {
      const docRef = doc(db, "users", uid);
      let imgUrl = preImage;

      if (image) {
        imgUrl = await upload(image);
      }

      await updateDoc(docRef, {
        avatar: imgUrl,
        bio: bio,
        name: name,
      });
      const snap = await getDoc(docRef);
      console.log(snap.data());
      setUserData(snap.data());
      navigate('/chat');
      toast.success("Profile Updated Successfully");
    } catch (error) {
      console.error("Error updating profile: ", error);
      toast.error("Failed to update profile");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || "");
          setBio(data.bio || "");
          setPreImage(data.avatar || "");
        } else {
          toast.error("User data not found");
        }
      } else {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={image ? URL.createObjectURL(image) : preImage || assets.avatar_icon}
              alt="Profile Avatar"
            />
            Upload profile image
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Your name"
            required
          />
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="Write your profile bio"
          ></textarea>
          <button type="submit">Save</button>
        </form>
        <img
          className='profile-pic'
          src={image ? URL.createObjectURL(image) : preImage || assets.logo_icon}
          alt="Current Profile"
        />
      </div>
    </div>
  );
};

export default ProfileUpdate;
