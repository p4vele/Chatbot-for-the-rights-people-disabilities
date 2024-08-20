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
  const [isThinking, setIsThinking] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    age: '',
    disabilityType: '',
    percent: '',
    livingArea: '',
    specificLocation: '',
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
    "מהו אחוז הנכות הרפואית שלך?",
    "היכן אתה גר?",
    "איזה יישוב אתה בוחר?",
    "מה תרצה לדעת?",
    "מהו אחוז אי כשירות עבודה שלך?"
  ];

  useEffect(() => {
    const initialMessage = "שלום! אני פה כדי לעזור לך עם הזכויות שלך. ענה על השאלות הבאות כדי שאוכל לספק את התשובה הטובה ביותר. מה שמך?";
    setChatMessages([{ role: 'assistant', content: initialMessage }]);
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
    if (step === 0 && isTTSEnabled){
      const initialMessage = "שלום! אני פה כדי לעזור לך עם הזכויות שלך. ענה על השאלות הבאות כדי שאוכל לספק את התשובה הטובה ביותר. מה שמך?";
      speak(initialMessage);
    } else if (step < steps.length) {
      const botMessage = { role: 'assistant', content: steps[step] };
      setChatMessages((prevMessages) => [...prevMessages, botMessage]);
      if (isTTSEnabled) {
        speak(steps[step]);
      }
    } else {
      const botMessage = { role: 'assistant', content: "תודה על המידע! כעת אתה יכול לשאול אותי שאלות או לחזור חזרה למידע נוסף!" };
      setChatMessages((prevMessages) => [...prevMessages, botMessage]);
      if (isTTSEnabled) {
        speak(" תודה על המידע! כעת אתה יכול לשאול אותי שאלות נוספות או לחזור חזרה למידע נוסף.");
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

  const HandleAOption = (option) => {
    const userMessage = { role: 'user', content: option };
    setChatMessages((prevMessages) => [...prevMessages, userMessage]);
    if (option === '0-59') {
      const responseMessage = "לא זכאי.";
      const assistantMessage = { role: 'assistant', content: responseMessage };
      setChatMessages((prevMessages) => [...prevMessages, assistantMessage]);
      if (isTTSEnabled) speak(responseMessage);
    } else if (option === '60') {
      const responseMessage = " כיום, קצבת הנכות עבור אי-כושר העבודה עבור מקרה זה, הינו : 2,476 שקלים חדשים";
      const assistantMessage = { role: 'assistant', content: responseMessage };
      setChatMessages((prevMessages) => [...prevMessages, assistantMessage]);
      if (isTTSEnabled) speak(responseMessage);
    } else if (option === '65') {
      const responseMessage = " כיום, קצבת הנכות עבור אי-כושר העבודה עבור מקרה זה, הינו : 2,636 שקלים חדשים";
      const assistantMessage = { role: 'assistant', content: responseMessage };
      setChatMessages((prevMessages) => [...prevMessages, assistantMessage]);
      if (isTTSEnabled) speak(responseMessage);
    } else if (option === '74') {
      const responseMessage = " כיום, קצבת הנכות עבור אי-כושר העבודה עבור מקרה זה, הינו : 2,925 שקלים חדשים";
      const assistantMessage = { role: 'assistant', content: responseMessage };
      setChatMessages((prevMessages) => [...prevMessages, assistantMessage]);
      if (isTTSEnabled) speak(responseMessage);
    }
    else if (option === '75+'){
      const responseMessage = " כיום, קצבת הנכות עבור אי-כושר העבודה עבור מקרה זה, הינו : 4,291 שקלים חדשים";
      const assistantMessage = { role: 'assistant', content: responseMessage };
      setChatMessages((prevMessages) => [...prevMessages, assistantMessage]);
      if (isTTSEnabled) speak(responseMessage);
    }
    setStep(step + 1);
  }
  const handleOptionSelection = (option) => {
    const userMessage = { role: 'user', content: option };
    setChatMessages((prevMessages) => [...prevMessages, userMessage]);
  
    //section For A
    if (option === 'קצבה-כללית') {
      setStep(step + 1); // Move to the next step
    }
      //section for B
    else if (option === 'שיקום') {
      if (userInfo.age === '0-18') {
        const responseMessage = "על פי הנתונים שהזנת, לא ניתן לקבוע מיד, נא לבדוק עם סניפך הקרוב";
        const assistantMessage = { role: 'assistant', content: responseMessage };
        setChatMessages((prevMessages) => [...prevMessages, assistantMessage]);
        if (isTTSEnabled) speak(responseMessage);
      } else if(userInfo.age === '18-64' && userInfo.percent==='0-20') {
        const responseMessage = "הינך לא זכאי לסבסוד מלגדת לימודים על ידי שיקום";
        const assistantMessage = { role: 'assistant', content: responseMessage };
        setChatMessages((prevMessages) => [...prevMessages, assistantMessage]);
        if (isTTSEnabled) speak(responseMessage);
      } else if(userInfo.age === '18-64' && userInfo.percent==='21-39') {
        const responseMessage = "הינך זכאי לשנת לימודים אחת, אשר הינה השנה האחרונה ללימודים";
        const assistantMessage = { role: 'assistant', content: responseMessage };
        setChatMessages((prevMessages) => [...prevMessages, assistantMessage]);
        if (isTTSEnabled) speak(responseMessage);
      } else if(userInfo.age === '18-64' && userInfo.percent==='40+') {
        const responseMessage = "לפי המערכת, הינך זכאי לקצבת לימודים מלאה אשר תסובסד על ידי הביטוח לאומי\n בנוסף, במהלך הלימודים הינך זכאי לקצבת לימודים אם הינך מקבל נכות חלקית או לא מקבל קצבה";
        const assistantMessage = { role: 'assistant', content: responseMessage };
        setChatMessages((prevMessages) => [...prevMessages, assistantMessage]);
        if (isTTSEnabled) speak(responseMessage);
      }
      setStep(step + 2); // Move to the next step
    }
    
  };

  const toggleTTS = () => {
    setIsTTSEnabled(!isTTSEnabled);
  };

  const goBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleAgeSelection = (ageRange) => {
    const userMessage = { role: 'user', content: ageRange };
    setChatMessages((prevMessages) => [...prevMessages, userMessage]);

    setUserInfo((prev) => ({ ...prev, age: ageRange }));
    setStep(step + 1);
  };

  const handleDisabilitySelection = (disabilityType) => {
    const userMessage = { role: 'user', content: disabilityType };
    setChatMessages((prevMessages) => [...prevMessages, userMessage]);

    setUserInfo((prev) => ({ ...prev, disabilityType }));
    setStep(step + 1);
  };

  const handlePercentSelection = (percentRange) => {
    const userMessage = { role: 'user', content: percentRange };
    setChatMessages((prevMessages) => [...prevMessages, userMessage]);

    setUserInfo((prev) => ({ ...prev, percent: percentRange }));
    setStep(step + 1);
  };

  const handleLivingAreaSelection = (area) => {
    const userMessage = { role: 'user', content: area };
    setChatMessages((prevMessages) => [...prevMessages, userMessage]);

    setUserInfo((prev) => ({ ...prev, livingArea: area }));
    setStep(step + 1);
  };

  const handleLocationSelection = (location) => {
    const userMessage = { role: 'user', content: location };
    setChatMessages((prevMessages) => [...prevMessages, userMessage]);

    setUserInfo((prev) => ({ ...prev, specificLocation: location }));
    setStep(step + 1);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
  
    const userMessage = { role: 'user', content: message };
    setChatMessages((prevMessages) => [...prevMessages, userMessage]);
    setMessage(''); 
    inputRef.current.focus();
  
    if (step < steps.length) {
      setStep(step + 1);
      return;
    }
  
    setIsThinking(true);  // Show thinking dots
  
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are an expert on rights for people with disabilities. The user is named ${userInfo.name}, aged ${userInfo.age}, with a disability type of ${userInfo.disabilityType}, disability percent of ${userInfo.percent}, and lives in ${userInfo.livingArea} with location ${userInfo.specificLocation}.`,
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
  
    setIsThinking(false);  // Hide thinking dots
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
              {isThinking && (
                <div className="chat-message assistant">
                  <span className="role">בוט : </span>
                  <span className="content">...</span> 
                </div>
              )}
            </div>

          
          <div className="input-container">
            {step === 1 ? (
              <div className="button-group">
                <button onClick={() => handleAgeSelection('0-18')} id="age-0-18">0 - 18</button>
                <button onClick={() => handleAgeSelection('18-64')} id="age-18-64">18 - 64</button>
                <button onClick={() => handleAgeSelection('64+')} id="age-64+">64+</button>
              </div>
            ) : step === 2 ? (
              <div className="button-group">
                <button onClick={() => handleDisabilitySelection('לקות ראייה')} id="disability-eyes">לקות ראיה</button>
                <button onClick={() => handleDisabilitySelection('לקות פיזית')} id="disability-movement">לקות פיזית</button>
                <button onClick={() => handleDisabilitySelection('לקות שמיעה')} id="disability-hearing">לקות שמיעה</button>
              </div>
            ) : step === 3 ? (
              <div className="button-group">
                <button onClick={() => handlePercentSelection('0-20')} id="percent-0-38">0 - 20</button>
                <button onClick={() => handlePercentSelection('21-39')} id="percent-21-39">21 - 39</button>
                <button onClick={() => handlePercentSelection('40-100')} id="percent-50+">40+</button>
              </div>
            ) : step === 4 ? (
              <div className="button-group">
                <button onClick={() => handleLivingAreaSelection('צפון')} id="living-area-north">צפון</button>
                <button onClick={() => handleLivingAreaSelection('מרכז')} id="living-area-center">מרכז</button>
                <button onClick={() => handleLivingAreaSelection('דרום')} id="living-area-south">דרום</button>
              </div>
            ) : step === 5 && userInfo.livingArea === 'צפון' ? (
              <div className="button-group">
                <button onClick={() => handleLocationSelection('בת-ים')} id="location-bat-yam">בת ים</button>
                <button onClick={() => handleLocationSelection('חדרה')} id="location-hadera">חדרה</button>
                <button onClick={() => handleLocationSelection('חיפה')} id="location-haifa">חיפה</button>
                <button onClick={() => handleLocationSelection('טבריה')} id="location-tveria">טבריה</button>
                <button onClick={() => handleLocationSelection('כרמיאל')} id="location-carmiel">כרמיאל</button>
                <button onClick={() => handleLocationSelection('נהריה')} id="location-nahariha">נהריה</button>
                <button onClick={() => handleLocationSelection('נצרת')} id="location-nazrat">נצרת</button>
                <button onClick={() => handleLocationSelection('נתניה')} id="location-natania">נתניה</button>
                <button onClick={() => handleLocationSelection('עפולה')} id="location-afola">עפולה</button>
                <button onClick={() => handleLocationSelection('קריות')} id="location-kraiot">קריות</button>
              </div>
            ) : step === 5 && userInfo.livingArea === 'דרום' ? (
              <div className="button-group">
                <button onClick={() => handleLocationSelection('אשדוד')} id="location-ashdod">אשדוד</button>
                <button onClick={() => handleLocationSelection('אשקלון')} id="location-askelon">אשקלון</button>
                <button onClick={() => handleLocationSelection('באר-שבע')} id="location-beer-sheva">באר שבע</button>
              </div>  
            ) :step === 5 && userInfo.livingArea === 'מרכז' ? (
              <div className="button-group">
                <button onClick={() => handleLocationSelection('בני-ברק')} id="location-bni-brak">בני ברק</button>
                <button onClick={() => handleLocationSelection('חולון')} id="location-holon">חולון</button>
                <button onClick={() => handleLocationSelection('כפר-סבא')} id="location-cfar-saba">כפר סבא</button>
                <button onClick={() => handleLocationSelection('פתח-תקווה')} id="location-petah-tikva">פתח תקווה</button>
                <button onClick={() => handleLocationSelection('ראשון-לציון')} id="location-rishon-lezion">ראשון לציון</button>
                <button onClick={() => handleLocationSelection('רחובות')} id="location-rehovot">רחובות</button>
                <button onClick={() => handleLocationSelection('רמלה')} id="location-ramla">רמלה</button>
                <button onClick={() => handleLocationSelection('רמת-גן')} id="location-ramat-gan">רמת גן</button>
                <button onClick={() => handleLocationSelection('תל-אביב')} id="location-tlv">תל אביב</button>
                </div>  
            ) : step === 6 ? (
              <div className="button-group">
                <button onClick={() => handleOptionSelection('קצבה-כללית')} id="option-a">בדיקה לגבי סכום קצבה כללית</button>
                <button onClick={() => handleOptionSelection('שיקום')} id="option-b"> זכאות לשיקום לימודים</button>
              </div>
            ) : step === 7 ? (
              <div className="button-group">
                <button onClick={() => HandleAOption('0-59')} id="work-a"> 0 - 59 % </button>
                <button onClick={() => HandleAOption('60')} id="work-b"> 60 % </button>
                <button onClick={() => HandleAOption('65')} id="work-c"> 65 % </button>
                <button onClick={() => HandleAOption('74')} id="work-d"> 74 %</button>
                <button onClick={() => HandleAOption('75+')} id="work-e"> 75% +</button>


              </div>
            ) : (
              <div className="input-field">
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="הקלד הודעה..."
                />
                <button onClick={sendMessage}>שלח</button>
              </div>
            )}
          </div>

          <div className="controls">
            <div className="tts-toggle">
              <button onClick={toggleTTS}>
                <FontAwesomeIcon icon={isTTSEnabled ? faVolumeUp : faVolumeMute} />
              </button>
              {step > 0 && (
              <button className="go-back" onClick={goBack}>חזור</button>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
