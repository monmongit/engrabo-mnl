import React, { useEffect, useRef, useState } from "react";
import { server } from "../server";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import styles from "../styles/style";
import { GrGallery } from "react-icons/gr";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
import Header from "../components/Layout/Header";
const ENDPOINT = "https://socket-engrabomanila.onrender.com"; //(Deployment)
// const ENDPOINT = "http://localhost:4000/";
const socket = socketIO(ENDPOINT, { transports: ["websocket"] });

const UserInboxPage = () => {
  const { user, loading } = useSelector((state) => state.user);
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [images, setImages] = useState(null);
  const [open, setOpen] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    socket.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        images: data.images,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    if (
      arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender)
    ) {
      setMessages((prevMessages) => [...prevMessages, arrivalMessage]);
    }
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        const response = await axios.get(
          `${server}/conversation/get-all-conversation-user/${user?._id}`,
          {
            withCredentials: true,
          }
        );
        setConversations(response.data.conversations);
      } catch (error) {
        console.log(error);
      }
    };
    getConversation();
  }, [user, messages]);

  useEffect(() => {
    if (user) {
      socket.emit("addUser", user?._id);
      socket.on("getUsers", (data) => {
        setOnlineUsers(data);
      });
    }
  }, [user]);

  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find((member) => member !== user?._id);
    const online = onlineUsers.find((user) => user.userId === chatMembers);
    return online ? true : false;
  };

  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await axios.get(
          `${server}/message/get-all-messages/${currentChat?._id}`
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.log(error);
      }
    };
    if (currentChat) {
      getMessage();
    }
  }, [currentChat]);

  const sendMessageHandler = async (e) => {
    e.preventDefault();

    const message = {
      sender: user?._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user?._id
    );

    socket.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      if (newMessage !== "") {
        const res = await axios.post(
          `${server}/message/create-new-message`,
          message
        );
        setMessages([...messages, res.data.message]);
        updateLastMessage();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessage = async () => {
    socket.emit("updateLastMessage", {
      lastMessage: newMessage,
      lastMessageId: user._id,
    });

    try {
      await axios.put(
        `${server}/conversation/update-last-message/${currentChat._id}`,
        {
          lastMessage: newMessage,
          lastMessageId: user._id,
        }
      );
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageUpload = async (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImages(reader.result);
        imageSendingHandler(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const imageSendingHandler = async (image) => {
    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socket.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      images: image, // Include image in the event
    });

    try {
      const res = await axios.post(`${server}/message/create-new-message`, {
        images: image,
        sender: user._id,
        text: newMessage,
        conversationId: currentChat._id,
      });
      setImages(null);
      setMessages([...messages, res.data.message]);
      updateLastMessageForImage();
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessageForImage = async () => {
    try {
      await axios.put(
        `${server}/conversation/update-last-message/${currentChat._id}`,
        {
          lastMessage: "Sent an image",
          lastMessageId: user._id,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full">
      {!open && (
        <>
          <Header />
          <h1 className="text-center text-[30px] py-3 font-Poppins">
            All Messages
          </h1>
          {conversations.map((item, index) => (
            <MessageList
              key={index}
              data={item}
              index={index}
              setOpen={setOpen}
              setCurrentChat={setCurrentChat}
              me={user?._id}
              setUserData={setUserData}
              userData={userData}
              online={onlineCheck(item)}
              setActiveStatus={setActiveStatus}
              loading={loading}
            />
          ))}
        </>
      )}
      {open && (
        <AdminInbox
          setOpen={setOpen}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          userId={user._id}
          userData={userData}
          activeStatus={activeStatus}
          scrollRef={scrollRef}
          handleImageUpload={handleImageUpload}
        />
      )}
    </div>
  );
};

const MessageList = ({
  data,
  index,
  setOpen,
  setCurrentChat,
  me,
  setUserData,
  userData,
  online,
  setActiveStatus,
  loading,
}) => {
  const [active, setActive] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const handleClick = async (id) => {
    navigate(`/inbox?${id}`);
    setOpen(true);
    setCurrentChat(data);
    setUserData(user);
    setActiveStatus(online);
    setActive(index);

    // // Emit updateSeenStatus event
    // socket.emit('updateSeenStatus', data._id);

    // await axios.put(`${server}/message/update-seen-status/${data._id}`, {
    //   seen: true,
    // });
  };

  useEffect(() => {
    const userId = data.members.find((user) => user !== me);

    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/admin/get-admin-info/${userId}`);
        setUser(res.data.admin);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [me, data]);

  console.log(online);
  return (
    <>
      <div
        className={`flex items-center m-4 p-3  py-3 ${
          handleClick ? "bg-[#00000010]" : "bg-transparent"
        } cursor-pointer`}
        onClick={() => handleClick(data._id)}
      >
        <div className="relative">
          <img
            src={`${user?.avatar?.url}`}
            alt=""
            className="w-[50px] h-[50px] rounded-full"
          />
          {online ? (
            <div className="w-[12px] h-[12px] bg-green-400 rounded-full absolute top-[1px] right-[1px]" />
          ) : (
            <div className="w-[12px] h-[12px] bg-[#b5b5ac] rounded-full absolute top-[1px] right-[1px]" />
          )}
        </div>
        <div className="pl-3">
          <h1 className="font-[600]">{user?.name}</h1>
          <p className="text-[14px] text-[#000000a1]">
            {!loading && data?.lastMessageId !== user?._id
              ? "You"
              : `${user?.name?.split(" ")[0]} `}
            : {data?.lastMessage}
          </p>
        </div>
      </div>
    </>
  );
};

const AdminInbox = ({
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  userId,
  userData,
  activeStatus,
  scrollRef,
  handleImageUpload,
}) => {
  console.log(userData);
  return (
    <div className="w-full min-h-full flex flex-col justify-between">
      <div className="w-full flex p-3 items-center justify-between bg-[#b19b56]">
        <div className="flex">
          <img
            src={`${userData?.avatar?.url}`}
            alt=""
            className="w-[60px] h-[60px] rounded-full"
          />
          <div className="pl-3">
            <h1 className="text-[18px] font-[600] text-[#171203]">
              {userData?.name}
            </h1>
            <h1>{activeStatus ? "Active Now" : ""}</h1>
          </div>
        </div>
        <AiOutlineArrowRight
          size={20}
          className="cursor-pointer"
          onClick={() => setOpen(false)}
        />
      </div>

      <div className="px-3 h-[65vh] py-3 overflow-y-scroll hide-scrollbar">
        {messages.map((item, index) => (
          <div
            key={index}
            className={`flex w-full my-2 ${
              item.sender === userId ? "justify-end" : "justify-start"
            }`}
            ref={scrollRef}
          >
            {item.sender !== userId && (
              <img
                src={`${userData?.avatar?.url}`}
                alt=""
                className="w-[40px] h-[40px] rounded-full mr-3"
              />
            )}

            {item.images && (
              <div
                className={`flex flex-col w-max ${
                  item.sender === userId ? "items-end" : "items-start"
                }`}
              >
                <img
                  src={
                    typeof item.images === "string"
                      ? item.images
                      : item.images.url
                  }
                  alt="Description of the content"
                  className="w-[200px] h-[200px] rounded-[10px] mr-2"
                />
              </div>
            )}

            {item.text && (
              <div
                className={`flex flex-col w-max ${
                  item.sender === userId ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`p-2 rounded ${
                    item.sender === userId ? "bg-[#171203]" : "bg-[#78683a96]"
                  } text-[#fff]`}
                >
                  <p>{item.text}</p>
                </div>
                <p className="text-[12px] text-[#000000d3] pt-1">
                  {format(item.createdAt)}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <form
        className="p-3 relative w-full flex justify-between items-center"
        onSubmit={sendMessageHandler}
      >
        <div className="w-[30px]">
          <input
            type="file"
            name=""
            id="image"
            className="hidden"
            onChange={handleImageUpload}
          />
          <label htmlFor="image">
            <GrGallery className="cursor-pointer" />
          </label>
        </div>
        <div className="w-full">
          <input
            type="text"
            required
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Enter your message..."
            className={`${styles.input} placeholder-[#9e8a4f] pl-3 !h-[40px]`}
          />
          <input type="submit" value="Send" className="hidden" id="send" />
          <label htmlFor="send">
            <AiOutlineSend
              size={25}
              className="absolute right-4 top-5 cursor-pointer"
              fill="#171203"
            />
          </label>
        </div>
      </form>
    </div>
  );
};

export default UserInboxPage;
