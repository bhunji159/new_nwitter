import { dbService } from "../myBase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import Nweets from "../components/Nweets";
import Makenweet from "../components/Makenweet";

const Home = ({ userObj }) => {
  const [nweets, setNweets] = useState([]);

  useEffect(() => {
    const q = query(
      collection(dbService, "nweets"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const nweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArr);
    });
  }, []);

  return (
    <div className="container">
      <Makenweet userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {nweets.map((Nweet) => (
          <Nweets
            key={Nweet.id}
            nweetObj={Nweet}
            isOwner={Nweet.creatorId === userObj.uid}
            userObj={userObj}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
