import React, { useEffect, useRef, useState } from 'react';
import { server } from '../server';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AiOutlineArrowRight, AiOutlineSend } from 'react-icons/ai';
import styles from '../styles/style';
import { GrGallery } from 'react-icons/gr';
import socketIO from 'socket.io-client';
import { format } from 'timeago.js';
import Header from '../components/Layout/Header';
const ENDPOINT = 'http://localhost:4000/';
const socketId = socketIO(ENDPOINT, { transports: ['websocket'] });

const DashboardMessages = () => {
  const { user, loading } = useSelector((state) => state.user);
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userData, setUserData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [images, setImages] = useState(null);
  const [open, setOpen] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    socketId.on('getMessage', (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        const resonse = await axios.get(
          `${server}/conversation/get-all-conversation-user/${user?._id}`,
          {
            withCredentials: true,
          }
        );

        setConversations(resonse.data.conversations);
      } catch (error) {
        // console.log(error);
      }
    };
    getConversation();
  }, [user, messages]);

  useEffect(() => {
    if (user) {
      const userId = user?._id;
      socketId.emit('addUser', userId);
      socketId.on('getUsers', (data) => {
        setOnlineUsers(data);
      });
    }
  }, [user]);

  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find((member) => member !== user?._id);
    const online = onlineUsers.find((user) => user.userId === chatMembers);
    return online ? true : false;
  };

  // Get messages
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
    getMessage();
  }, [currentChat]);

  // Create new messages
  const sendMessageHandler = async (e) => {
    e.preventDefault();

    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member.id !== user?._id
    );

    socketId.emit('sendMessage', {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      if (newMessage !== '') {
        await axios
          .post(`${server}/message/create-new-message`, message)
          .then((res) => {
            setMessages([...messages, res.data.message]);
            updateLastMessage();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessage = async () => {
    socketId.emit('updateLastMessage', {
      lastMessage: newMessage,
      lastMessageId: user._id,
    });

    await axios
      .put(`${server}/conversation/update-last-message/${currentChat._id}`, {
        lastMessage: newMessage,
        lastMessageId: user._id,
      })
      .then((res) => {
        console.log(res.data.conversation);
        setNewMessage('');
      })
      .catch((error) => {
        console.log(error);
      });
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

  const imageSendingHandler = async (e) => {
    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socketId.emit('sendMessage', {
      senderId: user._id,
      receiverId,
      images: e,
    });

    console.log(user.id);
    try {
      await axios
        .post(`${server}/message/create-new-message`, {
          images: e,
          sender: user._id,
          text: newMessage,
          conversationId: currentChat._id,
        })
        .then((res) => {
          setImages();
          setMessages([...messages, res.data.message]);
          updateLastMessageForImage();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessageForImage = async () => {
    await axios.put(
      `${server}/conversation/update-last-message/${currentChat._id}`,
      {
        lastMessage: 'Sent an image',
        lastMessageId: user._id,
      }
    );
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: 'smooth' });
  }, [messages]);

  return (
    <div className="w-full">
      {/* All messages list */}
      {!open && (
        <>
          <Header />
          <h1 className="text-center text-[30px] py-3 font-Poppins ">
            All Messages
          </h1>
          {conversations &&
            conversations.map((item, index) => (
              <MessageList
                data={item}
                key={index}
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
  const [active, setActive] = useState(0);
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/inbox?${id}`);
    setOpen(true);
  };

  useEffect(() => {
    setActiveStatus(online);
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
  }, [me, data, online, setActiveStatus]);

  return (
    <div
      className={`w-full flex p-3 py-3 ${
        active === index ? 'bg-[#00000010]' : 'bg-transparent'
      } cursor-pointer`}
      onClick={(e) =>
        setActive(index) ||
        handleClick(data._id) ||
        setCurrentChat(data) ||
        setUserData(user) ||
        setActiveStatus(online)
      }
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
          {!loading && data?.lastMessageId !== userData?._id
            ? 'You'
            : userData?.name?.split(' ')[0] + ' '}
          : {data?.lastMessage}
        </p>
      </div>
    </div>
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
  return (
    <div className="w-full min-h-full flex flex-col justify-between">
      {/* message header */}
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
            <h1>{activeStatus ? 'Active Now' : ''}</h1>
          </div>
        </div>
        <AiOutlineArrowRight
          size={20}
          className="cursor-pointer"
          onClick={() => setOpen(false)}
        />
      </div>

      {/* messages */}
      <div className="px-3 h-[65vh] py-3 overflow-y-scroll hide-scrollbar">
        {messages &&
          messages.map((item, index) => (
            <div
              key={index}
              className={`flex w-full my-2 ${
                item.sender === userId ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* For messages from others, include the image to the left */}
              {item.sender !== userId && (
                <img
                  src={`${userData?.avatar?.url}`}
                  alt=""
                  className="w-[40px] h-[40px] rounded-full mr-3"
                />
              )}

              {/* Images */}
              {item.images && (
                <div
                  className={`flex flex-col w-max ${
                    item.sender === userId ? 'items-end' : 'items-start'
                  }`}
                >
                  <img
                    src={item.images.url}
                    alt="Description of the content"
                    className="w-[200px] h-[200px]  rounded-[10px] mr-2"
                  />
                </div>
              )}

              {/* Text container */}
              {item.text !== '' && (
                <div
                  className={`flex flex-col w-max ${
                    item.sender === userId ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`p-2 rounded ${
                      item.sender === userId ? 'bg-[#000]' : 'bg-[#b19a5696]'
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

      {/* Send Message */}
      <form
        className="p-3 relative w-full flex justify-between items-center"
        onSubmit={sendMessageHandler}
      >
        <div className="w-[30]">
          <input
            type="file"
            name=""
            id="image"
            className="hidden"
            onChange={handleImageUpload}
          />
          <label htmlFor="image">
            <GrGallery className="cursor-pointer" size={20} fill="#171203" />
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
export default DashboardMessages;
