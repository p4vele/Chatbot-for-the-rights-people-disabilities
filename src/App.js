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
  const [isPopupOpen, setIsPopupOpen] = useState(false);
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
      const botMessage = { role: 'assistant', content: "תודה על שיתוף הפעולה! כעת אתה יכול לשאול אותי שאלות או לחזור חזרה למידע נוסף!" };
      setChatMessages((prevMessages) => [...prevMessages, botMessage]);
      if (isTTSEnabled) {
        speak(" תודה על שיתוף הפעולה! כעת אתה יכול לשאול אותי שאלות נוספות או לחזור חזרה למידע נוסף.");
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

  const openPopup = () => {
    setIsPopupOpen(true);
  };
  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const HandleAOption = (option) => {
    const userMessage = { role: 'user', content: option };
    setChatMessages((prevMessages) => [...prevMessages, userMessage]);
    if (option === '0-59') {
      const responseMessage = "על פי הנתונים שהוזנו למערכת, אינך זכאי לקצבה, לבירור נוסף, ניתן לפנות לסניף";
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
      } else if(userInfo.age === '18-64' && userInfo.percent==='40-100') {
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
  function formatAssistantMessage(message) {
    return message
        .replace(/(\d+\.\s*)/g, '\n$1')
        .replace(/:\s*/g, ':\n')
        .trim();
}






  
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
              content: `תתנהג כמו מומחה לענייני ביטוח לאומי The user is named ${userInfo.name}, aged ${userInfo.age}, with a disability type of ${userInfo.disabilityType}, disability percent of ${userInfo.percent}, and lives in ${userInfo.livingArea} with location ${userInfo.specificLocation}.`,
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
  
      const assistantMessage = { role: 'assistant', content: formatAssistantMessage(response.data.choices[0].message.content) };
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
            <div>
              <h4 className="disclaimer">
                  צא'ט זה אינו מהווה תחלופה או כל ייעוץ מקצועי ופותח על מנת להכיוון בלבד!             
               <button className="open-popup" onClick={openPopup}>
                  למידע נוסף לחצו כאן!
              </button>
              </h4>
            </div>
          </div>
          <div className="chat-messages" ref={scrollViewRef}>
              {chatMessages.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.role}`}>
                  <span className="role">{msg.role === 'user' ? ' :אני ' : 'בוט : '}</span>
                  <span className="content" >{msg.content}</span>
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
              <div className="dropdown-group">
                <div>
                    לחץ על מנת לבחור
                  </div>
                <select onChange={(e) => handleDisabilitySelection(e.target.value)} id="living-area-select">
                    <option value= "" disabled selected>בחר סוג לקות</option>
                    <option value="שמיעה">שמיעה</option>
                    <option value="ראייה">ראייה</option>
                    <option value="ניידות">ניידות</option>
                    <option value="נפשי">נפשי</option>
                    <option value="קוגנטיבית">קוגנטיבית</option>

                </select>
              </div>             
            ) : step === 3 ? (
              <div className="button-group">
                <button onClick={() => handlePercentSelection('0-20')} id="percent-0-38">0 - 20</button>
                <button onClick={() => handlePercentSelection('21-39')} id="percent-21-39">21 - 39</button>
                <button onClick={() => handlePercentSelection('40-100')} id="percent-50+">40+</button>
              </div>
            ) : step === 4 ? (
              <div className="dropdown-group">
                <div>
                    לחץ על מנת לבחור אזור
                  </div>
                <select onChange={(e) => handleLivingAreaSelection(e.target.value)} id="living-area-select">
                    <option value= "" disabled selected>בחר אזור מגורים</option>
                    <option value="צפון">צפון</option>
                    <option value="מרכז">מרכז</option>
                    <option value="דרום">דרום</option>
                    <option value="ירושלים">ירושלים</option>
                    <option value="אילת">אילת</option>


                </select>
              </div>
            )  : step === 5 && userInfo.livingArea === 'צפון' ? (
              <div className="dropdown-group">
                <div>
                    לחץ על מנת לבחור עיר
                  </div>
                  <select onChange={(e) => handleLocationSelection(e.target.value)} id="location-north-select">
                      <option value="" disabled selected>בחר מיקום</option>
                      <option value="בת-ים">בת ים</option>
                      <option value="חדרה">חדרה</option>
                      <option value="חיפה">חיפה</option>
                      <option value="טבריה">טבריה</option>
                      <option value="כרמיאל">כרמיאל</option>
                      <option value="נהריה">נהריה</option>
                      <option value="נצרת">נצרת</option>
                      <option value="נתניה">נתניה</option>
                      <option value="עפולה">עפולה</option>
                      <option value="קריות">קריות</option>
                  </select>
              </div>
          ) : step === 5 && userInfo.livingArea === 'דרום' ? (
              <div className="dropdown-group">
                  <div>
                    לחץ על מנת לבחור עיר
                  </div>
                  <select onChange={(e) => handleLocationSelection(e.target.value)} id="location-south-select">
                      <option value="" disabled selected>בחר מיקום</option>
                      <option value="אשדוד">אשדוד</option>
                      <option value="אשקלון">אשקלון</option>
                      <option value="באר-שבע">באר שבע</option>
                  </select>
              </div>
          ) : step === 5 && userInfo.livingArea === 'ירושלים' ? (
            <div className="dropdown-group">
                <div>
                  לחץ על מנת לבחור עיר
                </div>
                <select onChange={(e) => handleLocationSelection(e.target.value)} id="location-south-select">
                    <option value="" disabled selected>בחר מיקום</option>
                    <option value="ירושלים-צפון">ירושלים צפון</option>
                    <option value="ירושלים">ירושלים</option>
                </select>
            </div>
        ) : step === 5 && userInfo.livingArea === 'אילת' ? (
          <div className="dropdown-group">
              <div>
                לחץ על מנת לבחור עיר
              </div>
              <select onChange={(e) => handleLocationSelection(e.target.value)} id="location-south-select">
                  <option value="" disabled selected>בחר מיקום</option>
                  <option value="אילת"> אילת </option>
              </select>
          </div>
      ) : step === 5 && userInfo.livingArea === 'מרכז' ? (
              <div className="dropdown-group">
                <div>
                    לחץ על מנת לבחור עיר
                  </div>
                  <select onChange={(e) => handleLocationSelection(e.target.value)} id="location-center-select">
                      <option value="" disabled selected>בחר מיקום</option>
                      <option value="בני-ברק">בני ברק</option>
                      <option value="חולון">חולון</option>
                      <option value="כפר-סבא">כפר סבא</option>
                      <option value="פתח-תקווה">פתח תקווה</option>
                      <option value="ראשון-לציון">ראשון לציון</option>
                      <option value="רחובות">רחובות</option>
                      <option value="רמלה">רמלה</option>
                      <option value="רמת-גן">רמת גן</option>
                      <option value="תל-אביב">תל אביב</option>
                  </select>
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
          
          {isPopupOpen && (
              <>
              <div className="overlay" onClick={closePopup}></div>
                <div className="popup">
                  <p>
                    פרויקט זה פותח על ידי פבל קורמילצ'יק ואוראל מאיר. <br/>
                    בהנחיית עורך דין איתן עמרם בקרוס נגישות יישמוית למהנדסי תוכנה.<br/>
                    צא'ט זה אינו מהווה תחלופה או כל ייעוץ מקצועי ופותח על מנת להכיוון בלבד!
                    </p>
                  <button className="close-popup" onClick={closePopup}>סגירה</button>
                </div>
              </>
            )}
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
