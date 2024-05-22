import React, { useState, useEffect, useRef } from 'react';
import styles from '../../styles/style';
import { RiRobot2Line } from 'react-icons/ri';

const Chatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showCloudMessage, setShowCloudMessage] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isOpen) {
        setShowCloudMessage((prev) => !prev);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const faqResponses = {
    'how to order': 'To order, you can follow these steps...',
    'how to refund': 'To request a refund, please follow these steps...',
    'what are your policies': 'Our policies include...',
    // Add more FAQs and responses here
  };

  const handleSendMessage = (question) => {
    const userMessage = question || input.toLowerCase();
    const botResponse =
      faqResponses[userMessage] || 'Sorry, I do not understand your question.';

    setMessages([
      ...messages,
      { sender: 'user', text: userMessage },
      { sender: 'bot', text: botResponse },
    ]);
    setInput('');
  };

  return (
    <div
      className={isOpen ? styles.chatboxOpen : styles.chatboxClosed}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className={styles.chatboxHeader}>
        {isOpen ? (
          <div className="flex items-between justify-between">
            <RiRobot2Line size={30} />
            <h1 className="font-Roboto font-600 flex items-center justify-center mr-24">
              Hi I'm Engrabot
            </h1>
          </div>
        ) : (
          <RiRobot2Line size={30} />
        )}
      </div>
      {isOpen && (
        <div
          className={`${styles.chatboxContent} overflow-y-scroll hide-scrollbar`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.chatboxMessages}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.sender === 'user'
                    ? styles.userMessage
                    : styles.botMessage
                }
              >
                {message.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className={styles.chatboxSelection}>
            {Object.keys(faqResponses).map((question, index) => (
              <button
                key={index}
                className={styles.chatboxSelectionButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSendMessage(question);
                }}
              >
                {question}
              </button>
            ))}
          </div>
          <div className={styles.chatboxInput}>
            <input
              className={styles.chatboxInputField}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              onClick={(e) => e.stopPropagation()} // Prevent input click from closing the chatbox
            />
            <button
              className={styles.chatboxInputButton}
              onClick={(e) => {
                e.stopPropagation(); // Prevent button click from closing the chatbox
                handleSendMessage();
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
      {!isOpen && showCloudMessage && (
        <div className={styles.cloudMessage}>
          <h1 className="font-Roboto font-600">Do you have inquiries?</h1>
        </div>
      )}
    </div>
  );
};

export default Chatbox;
