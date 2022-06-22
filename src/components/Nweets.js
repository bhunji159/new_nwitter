import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import react from "react";
import { dbService, storageService } from "../myBase";
import { deleteObject, ref } from "@firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPencilAlt,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import Reply from "./Reply";

const Nweets = ({ nweetObj, isOwner, userObj }) => {
  const [editing, setEditing] = react.useState(false);
  const [newNweet, setNewNweet] = react.useState(nweetObj.text);
  const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);
  const urlRef = ref(storageService, nweetObj.photoUrl);
  const [edtingRep, setEdtingRep] = react.useState(false);
  const onDeleteClick = async () => {
    const ok = window.confirm("are you suere to delete this nweet?");
    if (ok) {
      await deleteDoc(NweetTextRef);
      if (nweetObj.photoUrl !== "") {
        await deleteObject(urlRef);
      }
    }
  };
  const onEditClick = () => {
    setEditing(true);
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    updateDoc(NweetTextRef, {
      text: newNweet,
    });
    goPrev();
  };
  const goPrev = () => {
    setEditing((prev) => !prev);
  };
  const time = String(nweetObj.createdAt?.toDate());
  const timeArr = time.split(" ");
  const displayedTime =
    timeArr[4] + "-" + timeArr[3] + "/" + timeArr[1] + "/" + timeArr[2];

  const onReplyClick = () => {
    setEdtingRep((prev) => !prev);
  };

  return (
    <>
      <div className="nweet">
        {editing ? (
          <>
            <form onSubmit={onSubmit} className="container nweetEdit">
              <input
                type="text"
                placeholder="Edit your nweet"
                value={newNweet}
                onChange={onChange}
                className="formInput"
              />
              <input type="submit" value="update nweet" className="formBtn" />
            </form>
            <span onClick={goPrev} className="formBtn cancelBtn">
              cancle
            </span>
          </>
        ) : (
          <>
            <h4 className="nweet_display_name">{nweetObj.nickName}</h4>
            <h3 className="nweet_text">
              {nweetObj.text}
              {nweetObj.photoUrl && nweetObj.text ? (
                <>
                  <span className="lineChange">{"\n"} </span>
                  <span className="lineChange">{"\n"} </span>
                </>
              ) : null}

              {nweetObj.photoUrl && <img src={nweetObj.photoUrl} alt="error" />}
            </h3>

            <div className="nweet__actions">
              {isOwner ? (
                <>
                  <span onClick={onDeleteClick}>
                    <FontAwesomeIcon icon={faTrash} />
                  </span>
                  <span onClick={onEditClick}>
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </span>
                </>
              ) : null}
            </div>
            <div className="nweet__bottomBox">
              <span className="nweet__rep" onClick={onReplyClick}>
                <FontAwesomeIcon style={{ marginRight: 4 }} icon={faComment} />
                {nweetObj.repNum}
              </span>
              <span className="display_time">{displayedTime}</span>
            </div>
          </>
        )}
      </div>
      {edtingRep ? (
        <>
          <Reply repID={nweetObj.id} userObj={userObj} nweetObj={nweetObj} />
        </>
      ) : null}
    </>
  );
};

export default Nweets;
