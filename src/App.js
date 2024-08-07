import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import backgroundImg from './background.png'; 

const ChatScreen = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(0); 
  const [userInfo, setUserInfo] = useState({
    name: '',
    age: '',
    disabilityType: '',
    percent: '',
    livingArea: '',
  });
  const [isTTSEnabled, setIsTTSEnabled] = useState(true); 
  const [lastSpokenMessage, setLastSpokenMessage] = useState('');

  const inputRef = useRef(null);
  const scrollViewRef = useRef(null);
  const apikey = process.env.REACT_APP_OPENAI_API_KEY;

  const steps = [
    "מה שמך?",
    "מה גילך?",
    "מהו סוג הלקות שלך?",
    "מהו אחוז הלקות שלך?",
    "היכן אתה גר?"
  ];

  useEffect(() => {
    const initialMessage = "  שלום! אני פה כדי לעזור לך עם הזכויות שלך. ענה על השאלות הבאות כדי שאוכל לספק את התשובה הטובה ביותר. מה שמך?";
    setChatMessages([
      { role: 'assistant', content: initialMessage }
    ]);
    if (isTTSEnabled){
      speak(initialMessage);
     }
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTop = scrollViewRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    if (step == 0 && isTTSEnabled){
      const initialMessage = "  שלום! אני פה כדי לעזור לך עם הזכויות שלך. ענה על השאלות הבאות כדי שאוכל לספק את התשובה הטובה ביותר. מה שמך?";
      speak(initialMessage);
     }
    else if (step < steps.length) {
      const botMessage = { role: 'assistant', content: steps[step] };
      setChatMessages((prevMessages) => [...prevMessages, botMessage]);
      if (isTTSEnabled) {
        speak(steps[step]);
      }
    } else {
      const botMessage = { role: 'assistant', content: "תודה על המידע! כעת אתה יכול לשאול אותי שאלות." };
      setChatMessages((prevMessages) => [...prevMessages, botMessage]);
      if (isTTSEnabled) {
        speak("תודה על המידע! כעת אתה יכול לשאול אותי שאלות.");
      }
    }
  }, [step]); 
  

 
  const speak = (text) => {
    if (isTTSEnabled && text !== lastSpokenMessage) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'he';
      
      window.speechSynthesis.cancel();
      
      speechSynthesis.speak(utterance);
      setLastSpokenMessage(text); 
    }
  };
  

  const toggleTTS = () => {
    setIsTTSEnabled(!isTTSEnabled);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { role: 'user', content: message };
    setChatMessages((prevMessages) => [...prevMessages, userMessage]);

    if (step < steps.length) {
    
      switch (step) {
        case 0:
          setUserInfo((prev) => ({ ...prev, name: message }));
          break;
        case 1:
          setUserInfo((prev) => ({ ...prev, age: message }));
          break;
        case 2:
          setUserInfo((prev) => ({ ...prev, disabilityType: message }));
          break;
        case 3:
          setUserInfo((prev) => ({ ...prev, percent: message }));
          break;
        case 4:
          setUserInfo((prev) => ({ ...prev, livingArea: message }));
          break;
        default:
          break;
      }
      setStep(step + 1);
    } else {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: `You are an expert on rights for people with disabilities. The user is named ${userInfo.name}, aged ${userInfo.age}, with a disability type of ${userInfo.disabilityType}, disability percent of ${userInfo.percent}, and lives in ${userInfo.livingArea}. use you infomation from https://www.btl.gov.il/Pages/default.aspx and https://www.gov.il/he/departments/molsa/govil-landing-page  `,
              },
              userMessage,
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${apikey}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const assistantMessage = { role: 'assistant', content: response.data.choices[0].message.content };
        setChatMessages((prevMessages) => [...prevMessages, assistantMessage]);
        if (isTTSEnabled) {
          speak(response.data.choices[0].message.content); 
        }
      } catch (error) {
        console.error('Error sending message to ChatGPT:', error);
      }
    }
    setMessage(''); 
    inputRef.current.focus(); 
  };

  return (
    <div className="app-container">

      <div className="background" style={{ backgroundImage: `url(${backgroundImg})` }}>

      <div className="chat-container">
        <div className="chat-header">
          <h2>ברוך הבא לצ'אט בוט זכויות בעלי מוגבלויות!</h2>
        </div>
        <div className="chat-messages" ref={scrollViewRef}>
          {chatMessages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.role}`}>
              <span className="role">{msg.role === 'user' ? ' :אני ' : 'בוט : '}</span>
              <span className="content">{msg.content}</span>
            </div>
          ))}
        </div>
        
        <div className="input-container">
          <input
            ref={inputRef}
            type="text"
            placeholder="רשום הודעה"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage}>שלח</button>
          <button onClick={toggleTTS}>
            <FontAwesomeIcon icon={isTTSEnabled ? faVolumeUp : faVolumeMute} />
          </button>
        </div>
      </div>
    </div>
  </div>    
  );
};

export default ChatScreen;
