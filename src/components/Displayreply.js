import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import react from "react";
import { dbService } from "../myBase";

const DisplayReply = ({ replyObj, isOwner, collectionName, nweetObj }) => {
  const [editing, setEditing] = react.useState(false);
  const [newReply, setnewReply] = react.useState("");
  const ReplyTextRef = doc(dbService, collectionName, `${replyObj.id}`);
  const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);

  const onDeleteClick = async () => {
    const ok = window.confirm("are you suere to delete this nweet?");
    if (ok) {
      await deleteDoc(ReplyTextRef);
      await updateDoc(NweetTextRef, {
        repNum: nweetObj.repNum - 1,
      });
    }
  };

  const onEditClick = () => {
    setEditing((prev) => !prev);
  };

  const onChange = (event) => {
    setnewReply(event.target.value);
  };
  const onSubmit = (event) => {
    event.preventDefault();
    updateDoc(ReplyTextRef, {
      text: newReply,
    });
    goPrev();
  };
  const goPrev = () => {
    onEditClick();
    setnewReply("");
  };
  return (
    <>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Edit your reply"
              value={newReply}
              onChange={onChange}
            />
            <input type="submit" value="update reply" />
          </form>
          <span onClick={goPrev}>cancle</span>
        </>
      ) : (
        <div>
          <h3>{replyObj.nickName}</h3>
          <span>___{replyObj.text}___ </span>
          {isOwner ? (
            <>
              <div>
                <span onClick={onEditClick}>_ _ _ _ _ _ _ _ _ _ _ edit___</span>
                <span onClick={onDeleteClick}>delete</span>
              </div>
            </>
          ) : null}
        </div>
      )}
    </>
  );
};

export default DisplayReply;
