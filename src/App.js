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
    "מהו אחוז הלקות שלך?",
    "היכן אתה גר?",
    "איזה יישוב אתה בוחר?",
    "מה תרצה לדעת?"
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

  const handleOptionSelection = (option) => {
    const userMessage = { role: 'user', content: option };
    setChatMessages((prevMessages) => [...prevMessages, userMessage]);
  
    if (option === 'A') {
      if (userInfo.age === '0-18' && userInfo.percent === '0-38') {
        const responseMessage = "קצבה כללית כיום עומדת על 1771 שקלים חדשים\n שים לי כי מודבר עד גיל 18 ו3 חודשים";
        const assistantMessage = { role: 'assistant', content: responseMessage };
        setChatMessages((prevMessages) => [...prevMessages, assistantMessage]);
        if (isTTSEnabled) speak(responseMessage);
      } else if (userInfo.age === '0-18') {
        const responseMessage = "קצבה כללית כיום עומדת על 3479 שקלים חדשים\n שים לי כי מודבר עד גיל 18 ו3 חודשים";
        const assistantMessage = { role: 'assistant', content: responseMessage };
        setChatMessages((prevMessages) => [...prevMessages, assistantMessage]);
        if (isTTSEnabled) speak(responseMessage);
      }
      else if (!(userInfo.age === '0-18')&& userInfo.percent === '50-100') {
        const responseMessage = "קצבה כללית כיום עומדת על 3479 שקלים חדשים\n שים לי כי מודבר עד גיל 18 ו3 חודשים";
        const assistantMessage = { role: 'assistant', content: responseMessage };
        setChatMessages((prevMessages) => [...prevMessages, assistantMessage]);
        if (isTTSEnabled) speak(responseMessage);
      } else if (!(userInfo.age === '0-18')&& userInfo.percent === '50-100') {
        const responseMessage = "קצבה כללית כיום עומדת על 3479 שקלים חדשים";
        const assistantMessage = { role: 'assistant', content: responseMessage };
        setChatMessages((prevMessages) => [...prevMessages, assistantMessage]);
        if (isTTSEnabled) speak(responseMessage); }
    else if (option === 'B') {
      if (userInfo.age === '0-18' && userInfo.percent==='38-50') {
        const responseMessage = "לא ניתן לקבוע מיד, נא לבדוק עם סניפך הקרוב";
        const assistantMessage = { role: 'assistant', content: responseMessage };
        setChatMessages((prevMessages) => [...prevMessages, assistantMessage]);
        if (isTTSEnabled) speak(responseMessage);
      } else if(!(userInfo.age === '0-18') && userInfo.percent==='0-38') {
        const responseMessage = "לפי המערכת, הינך זכאי לשנת לימודים אחרונה אשר תסובסד על ידי הביטוח לאומי\n";
        const assistantMessage = { role: 'assistant', content: responseMessage };
        setChatMessages((prevMessages) => [...prevMessages, assistantMessage]);
        if (isTTSEnabled) speak(responseMessage);
      } else if(!(userInfo.age === '0-18') && !(userInfo.percent==='0-38')) {
        const responseMessage = "לפי המערכת, הינך זכאי לקצבת לימודים מלאה אשר תסובסד על ידי הביטוח לאומי\n בנוסף, במהלך הלימודים הינך זכאי לקצבת לימודים";
        const assistantMessage = { role: 'assistant', content: responseMessage };
        setChatMessages((prevMessages) => [...prevMessages, assistantMessage]);
        if (isTTSEnabled) speak(responseMessage);
      }
    }
  
    setStep(step + 1); // Move to the next step
  };
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

    if (step < steps.length) {
      if (step === 1) return;  // Age is handled by buttons, skip message input
      if (step === 2) return;  // Disability type is handled by buttons, skip message input
      if (step === 3) return;  // Percent is handled by buttons, skip message input
      if (step === 4) return;  // Living area is handled by buttons, skip message input

      switch (step) {
        case 0:
          setUserInfo((prev) => ({ ...prev, name: message }));
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
            {step === 1 ? (
              <div className="button-group">
                <button onClick={() => handleAgeSelection('0-18')} id="age-0-18">0 - 18</button>
                <button onClick={() => handleAgeSelection('18-64')} id="age-18-64">18 - 64</button>
                <button onClick={() => handleAgeSelection('64+')} id="age-64+">64+</button>
              </div>
            ) : step === 2 ? (
              <div className="button-group">
                <button onClick={() => handleDisabilitySelection('Eyes Disability')} id="disability-eyes">לקות ראיה</button>
                <button onClick={() => handleDisabilitySelection('Movement Disability')} id="disability-movement">לקות הליכה</button>
                <button onClick={() => handleDisabilitySelection('Hearing Disability')} id="disability-hearing">לקות שמיעה</button>
              </div>
            ) : step === 3 ? (
              <div className="button-group">
                <button onClick={() => handlePercentSelection('0-38')} id="percent-0-38">0 - 38</button>
                <button onClick={() => handlePercentSelection('38-50')} id="percent-38-50">38 - 50</button>
                <button onClick={() => handlePercentSelection('50-100')} id="percent-50+">50+</button>
              </div>
            ) : step === 4 ? (
              <div className="button-group">
                <button onClick={() => handleLivingAreaSelection('North')} id="living-area-north">צפון</button>
                <button onClick={() => handleLivingAreaSelection('Center')} id="living-area-center">מרכז</button>
                <button onClick={() => handleLivingAreaSelection('South')} id="living-area-south">דרום</button>
              </div>
            ) : step === 5 && userInfo.livingArea === 'North' ? (
              <div className="button-group">
                <button onClick={() => handleLocationSelection('Bat-Yam')} id="location-bat-yam">בת ים</button>
                <button onClick={() => handleLocationSelection('Hadera')} id="location-hadera">חדרה</button>
                <button onClick={() => handleLocationSelection('Haifa')} id="location-haifa">חיפה</button>
                <button onClick={() => handleLocationSelection('Tveria')} id="location-tveria">טבריה</button>
                <button onClick={() => handleLocationSelection('Carmiel')} id="location-carmiel">כרמיאל</button>
                <button onClick={() => handleLocationSelection('Nahariha')} id="location-nahariha">נהריה</button>
                <button onClick={() => handleLocationSelection('Nazrat')} id="location-nazrat">נצרת</button>
                <button onClick={() => handleLocationSelection('Natania')} id="location-natania">נתניה</button>
                <button onClick={() => handleLocationSelection('Afola')} id="location-afola">עפולה</button>
                <button onClick={() => handleLocationSelection('Kraiot')} id="location-kraiot">קריות</button>
              </div>
            ) : step === 5 && userInfo.livingArea === 'South' ? (
              <div className="button-group">
                <button onClick={() => handleLocationSelection('Ashdod')} id="location-ashdod">אשדוד</button>
                <button onClick={() => handleLocationSelection('Askelon')} id="location-askelon">אשקלון</button>
                <button onClick={() => handleLocationSelection('Beer-Sheva')} id="location-beer-sheva">באר שבע</button>
              </div>  
            ) :step === 5 && userInfo.livingArea === 'Center' ? (
              <div className="button-group">
                <button onClick={() => handleLocationSelection('Bni-Brak')} id="location-bni-brak">בני ברק</button>
                <button onClick={() => handleLocationSelection('Holon')} id="location-holon">חולון</button>
                <button onClick={() => handleLocationSelection('Cfar-Saba')} id="location-cfar-saba">כפר סבא</button>
                <button onClick={() => handleLocationSelection('Petah-Tikva')} id="location-petah-tikva">פתח תקווה</button>
                <button onClick={() => handleLocationSelection('Rishon-Lezion')} id="location-rishon-lezion">ראשון לציון</button>
                <button onClick={() => handleLocationSelection('Rehovot')} id="location-rehovot">רחובות</button>
                <button onClick={() => handleLocationSelection('Ramla')} id="location-ramla">רמלה</button>
                <button onClick={() => handleLocationSelection('Ramat-Gan')} id="location-ramat-gan">רמת גן</button>
                <button onClick={() => handleLocationSelection('Tel-Aviv')} id="location-tlv">תל אביב</button>
                </div>  
            ) : step === 6 ? (
              <div className="button-group">
                <button onClick={() => handleOptionSelection('A')} id="option-a">בדיקה לגבי קצבה כללית</button>
                <button onClick={() => handleOptionSelection('B')} id="option-b"> זכאות לשיקום לימודים</button>
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
            </div>
            {step > 0 && (
              <button className="go-back" onClick={goBack}>חזור</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
