import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Contacts from "../components/Contacts";
import { allUsersRoute,host } from "../utills/ApisRoute";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChetContainer";
import {io} from "socket.io-client"

export default function Chet() {
  const socket = useRef()
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      const user = localStorage.getItem("chat-app-user");
      if (!user) {
        navigate("/login");
      } else {
        const parsedUser = JSON.parse(user);
        setCurrentUser(parsedUser);
      }
    };
    fetchUser();
  }, [navigate]);

useEffect(()=>{

  if(currentUser){
    socket.current = io(host);
    socket.current.emit("add-user", currentUser._id)
  }
},[currentUser]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          try {
            const { data } = await axios.get(
              `${allUsersRoute}/${currentUser._id}`
            );
            setContacts(data);
          } catch (error) {
            console.error("Failed to fetch contacts:", error);
          }
        } else {
          navigate("/setavatar");
        }
      }
    };
    fetchContacts();
  }, [currentUser, navigate]);
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <Container>
      <div className="container">
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          changeChat={handleChatChange}
        />
        {currentChat === undefined ? (
          <Welcome currentUser={currentUser} />
        ) : (
          <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket}/>
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import styled from "styled-components";
// import { allUsersRoute, host } from "../utills/ApisRoute";
// import Contacts from "../components/Contacts";
// import Welcome from "../components/Welcome";
// import ChatContainer from "../components/ChetContainer";
// // import io from "socket.io-client"; // Import io

// export default function Chat() {
//   const navigate = useNavigate();
//   const socket = useRef();
//   const [contacts, setContacts] = useState([]);
//   const [currentChat, setCurrentChat] = useState(undefined);
//   const [currentUser, setCurrentUser] = useState(undefined);

//   useEffect(() => {
//     const fetchUser = async () => {
//       if (!localStorage.getItem("chet-app-user")) {
//         navigate("/login");
//       } else {
//         setCurrentUser(
//           await JSON.parse(localStorage.getItem("chet-app-user"))
//         );
//       }
//     };
//     fetchUser();
//   }, [navigate]);

//   useEffect(() => {
//     if (currentUser) {
//       socket.current = io(host);
//       socket.current.emit("add-user", currentUser._id);
//     }
//   }, [currentUser]);

//   useEffect(() => {
//     const fetchContacts = async () => {
//       if (currentUser) {
//         if (currentUser.isAvatarImageSet) {
//           const { data } = await axios.get(`${allUsersRoute}/${currentUser._id}`);
//           setContacts(data);
//         } else {
//           navigate("/setAvatar");
//         }
//       }
//     };
//     fetchContacts();
//   }, [currentUser, navigate]);

//   const handleChatChange = (chat) => {
//     setCurrentChat(chat);
//   };

//   return (
//     <>
//       <Container>
//         <div className="container">
//           <Contacts contacts={contacts} changeChat={handleChatChange} />
//           {currentChat === undefined ? (
//             <Welcome />
//           ) : (
//             <ChatContainer currentChat={currentChat} socket={socket} />
//           )}
//         </div>
//       </Container>
//     </>
//   );
// }
