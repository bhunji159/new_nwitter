import { ref, uploadString, getDownloadURL } from "@firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { addDoc, serverTimestamp, collection } from "firebase/firestore";
import { storageService, dbService } from "../myBase";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const Makenweet = ({ userObj }) => {
  const [myPhoto, setMyPhoto] = useState(null);
  const [nweet, setNweet] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    let photoUrl = "";
    if (myPhoto != null) {
      const PhotoRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(PhotoRef, myPhoto, "data_url");
      photoUrl = await getDownloadURL(response.ref);
    }

    await addDoc(collection(dbService, "nweets"), {
      text: nweet,
      createdAt: serverTimestamp(),
      creatorId: userObj.uid,
      nickName: userObj.displayName,
      photoUrl,
      repNum: 0,
    });
    setNweet("");
    setMyPhoto(null);
  };

  const onChange = (event) => {
    setNweet(event.target.value);
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
      setMyPhoto(result);
    };
    if (theFile) reader.readAsDataURL(theFile);
  };
  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="tweet somthing"
          maxLength={120}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attatch-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attatch-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
      />

      {myPhoto === null ? null : (
        <div className="factoryForm__attachment">
          <img
            alt="load error"
            src={myPhoto}
            style={{
              backgroundImage: myPhoto,
            }}
          />
          <div
            className="factoryForm__clear"
            onClick={() => {
              setMyPhoto(null);
            }}
          >
            <span>Remove</span>

            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default Makenweet;
