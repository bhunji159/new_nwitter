import react from "react";
import {
  addDoc,
  serverTimestamp,
  collection,
  query,
  onSnapshot,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import { dbService } from "../myBase";
import DisplayReply from "./Displayreply";
import arrow from "../arrow.webp";

const Reply = ({ repID, userObj, nweetObj }) => {
  const [repText, setRepText] = react.useState("");
  const [replys, setReplys] = react.useState([]);
  const repRef = repID + "rep";
  const NweetRepNumRef = doc(dbService, "nweets", `${nweetObj.id}`);

  react.useEffect(() => {
    const q = query(collection(dbService, repRef), orderBy("createdAt", "asc"));
    onSnapshot(q, (snapshot) => {
      const repArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReplys(repArr);
    });
  }, []);

  const onChange = (event) => {
    setRepText(event.target.value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();

    await addDoc(collection(dbService, repRef), {
      text: repText,
      createdAt: serverTimestamp(),
      creatorId: userObj.uid,
      nickName: userObj.displayName,
    });
    updateDoc(NweetRepNumRef, {
      repNum: nweetObj.repNum + 1,
    });
    setRepText("");
  };
  return (
    <div className="repContainer">
      <div className="repArrow">
        <img src={arrow} alt="arrow" />
      </div>
      <div className="replyBox">
        <div className="editing__rep">
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="rep"
              onChange={onChange}
              value={repText}
            ></input>
            <input type="submit" value="rep"></input>
          </form>
        </div>
        <div className="display__rep">
          {replys.map((Reply) => (
            <DisplayReply
              key={Reply.id}
              replyObj={Reply}
              isOwner={Reply.creatorId === userObj.uid}
              collectionName={repRef}
              nweetObj={nweetObj}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reply;
