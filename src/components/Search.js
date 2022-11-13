import React, { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

export default function Search() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);

  async function handleSearch() {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );
    const querySnapshot = await getDocs(q);
    try {
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
        console.log(doc.id, " => ", doc.data());
      });
    } catch (err) {
      setErr(true);
    }
  }

  function handleKey(e) {
    e.code === "Enter" && handleSearch();
  }

  async function handleSelect() {
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //creates user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {
      setErr(true);
    }
    setUser(null);
    setUser("");
  }

  return (
    <div className="search">
      <div className="searchForm">
        <div className="searchForm">
          <input
            type="text"
            placeholder="find a user"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            onKeyDown={handleKey}
            value={username}
          />
        </div>
        {err && <span>User Not Found</span>}
        {user && (
          <div className="userChat" onClick={handleSelect}>
            <img src={user.photoURL} alt="" />
            <div className="userChatInfo">
              <span>{user.displayName}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
