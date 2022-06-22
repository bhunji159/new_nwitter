import { useNavigate } from "react-router-dom";
import { authService, dbService, storageService } from "../myBase";
import Nweets from "../components/Nweets";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "@firebase/firestore";
import { useEffect, useState } from "react";
import { updateProfile } from "@firebase/auth";
import {
  ref,
  uploadString,
  getDownloadURL,
  deleteObject,
} from "@firebase/storage";
import { v4 as uuidv4 } from "uuid";
import noimage from "../noimage.png";

const Profile = ({ refreshUser, userObj }) => {
  const navigate = useNavigate();
  const [editProfile, setEditProfile] = useState(false);
  const [newNickName, setNewNickName] = useState(userObj.displayName);
  const [newPhoto, setNewPhoto] = useState(userObj.photoURL);
  const [myNweets, setMyNweets] = useState([]);

  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };

  const getMyNweets = async () => {
    const q = query(
      collection(dbService, "nweets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt", "asc")
    );
    /*const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, "  => ", doc.data());
    });*/
    onSnapshot(q, (snapshot) => {
      const nweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMyNweets(nweetArr);
    });
  };
  const onEditNickNameClick = () => {
    setEditProfile((current) => !current);
  };

  const onNickNameChange = (event) => {
    setNewNickName(event.target.value);
  };

  useEffect(() => {
    console.log(userObj);
    getMyNweets();
    if (userObj.displayName == null) {
      setNewNickName("anonymous");
    }
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setEditProfile();
    let photoUrl = "";
    try {
      if (userObj.photoURL !== newPhoto && userObj.photoURL) {
        await deleteObject(ref(storageService, userObj.photoURL));
      }
    } catch (e) {
      console.log(e);
    }
    if (newPhoto == null) {
      await updateProfile(authService.currentUser, {
        photoURL: "",
      });
    } else if (newPhoto !== userObj.photoURL) {
      const PhotoRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(PhotoRef, newPhoto, "data_url");
      photoUrl = await getDownloadURL(response.ref);
      await updateProfile(authService.currentUser, {
        photoURL: photoUrl,
      });
    }
    await updateProfile(authService.currentUser, {
      displayName: newNickName,
    });
    refreshUser();
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setNewPhoto(result);
    };
    if (theFile) reader.readAsDataURL(theFile);
  };

  return (
    <>
      {/* 프로필 이미지 구현*/}
      <div className="container">
        <div className="profile">
          {userObj.photoURL == null ? (
            <img src={noimage} alt="no img" />
          ) : (
            <img
              src={userObj.photoURL}
              alt={<img src={noimage} alt="no img" />}
            />
          )}
        </div>
        <div className="container">
          {editProfile ? (
            <>
              <form onSubmit={onSubmit} className="proileForm">
                <input
                  type="text"
                  onChange={onNickNameChange}
                  value={newNickName}
                  className="formInput"
                  style={{ marginTop: 10 }}
                />
                <div className="profile_label">
                  <label
                    htmlFor="edit-profile-photo"
                    className="profile_label"
                    style={{ marginTop: "20px" }}
                  >
                    Edit photo
                  </label>
                </div>
                <input
                  id="edit-profile-photo"
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  style={{
                    opacity: 0,
                  }}
                />
                {newPhoto != null ? (
                  <>
                    <div className="profile">
                      <img src={newPhoto} alt="err to load img" />
                      <span
                        onClick={() => {
                          setNewPhoto(null);
                        }}
                        className="profile_label"
                      >
                        remove photo
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="profile">
                    <img src={noimage} alt="err" />
                  </div>
                )}
                <input
                  type="submit"
                  value="update profile"
                  className="formBtn"
                />
              </form>
              <span
                onClick={() => {
                  onEditNickNameClick();
                  setNewNickName(userObj.displayName);
                }}
                className="formBtn"
                style={{ marginTop: 10 }}
              >
                cancle edit profile
              </span>
            </>
          ) : (
            <span onClick={onEditNickNameClick} className="formBtn">
              Edit Profile
            </span>
          )}

          <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
            Log Out
          </span>
          <div style={{ marginTop: 50 }}>
            <span style={{}}>My Nweets</span>
            {myNweets.map((Nweet) => (
              <Nweets
                key={Nweet.id}
                nweetObj={Nweet}
                isOwner={Nweet.creatorId === userObj.uid}
                userObj={userObj}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
