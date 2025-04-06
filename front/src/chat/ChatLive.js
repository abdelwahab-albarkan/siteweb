// ChatLive.js
import React, { useState, useEffect, useRef } from "react";
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from './firebase';  // Assurez-vous que ce chemin est correct

import "./ChatLive.css";

export default function ChatLive() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  // Questions spécifiques à WRI9A
  const wri9aQuestions = [
    "Comment acheter un billet sur WRI9A?",
    "Quels événements sont disponibles?",
    "Comment contacter le support WRI9A?"
  ];

  // Charger les messages depuis Firebase
  useEffect(() => {
    if (!isOpen) return;

    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messages);
    });

    return () => unsubscribe();
  }, [isOpen]);

  // Auto-scroll vers le bas
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async (messageText = input) => {
    const textToSend = messageText.trim();
    if (!textToSend) return;

    // Message utilisateur
    const userMessage = {
      text: textToSend,
      sender: "user",
      timestamp: serverTimestamp()
    };

    // Envoyer le message utilisateur dans Firestore
    await addDoc(collection(db, "messages"), userMessage);
    setInput("");
    setIsThinking(true);

    // 1. Réponse initiale (1 seconde)
    setTimeout(async () => {
      const botResponseInitial = {
        text: "Je réfléchis, merci de patienter...",
        sender: "bot",
        timestamp: serverTimestamp()
      };
      await addDoc(collection(db, "messages"), botResponseInitial);
    }, 1000); // 1 seconde

    // 2. Réponse finale après 2 secondes
    setTimeout(async () => {
      const botResponseFinal = {
        text: getWri9aResponse(textToSend),
        sender: "bot",
        timestamp: serverTimestamp()
      };
      await addDoc(collection(db, "messages"), botResponseFinal);
      setIsThinking(false);
    }, 3000); // 3 secondes après l'envoi initial, donc 2 secondes après la première réponse
  };

  const getWri9aResponse = (message) => {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes("acheter") || lowerMsg.includes("billet")) {
      return "Pour acheter un billet sur WRI9A :\n1. Choisissez votre événement\n2. Sélectionnez vos places\n3. Paiement sécurisé\n4. Recevez votre e-ticket immédiatement!";
    } else if (lowerMsg.includes("événements") || lowerMsg.includes("disponibles")) {
      return "WRI9A propose des billets pour :\n- Concerts\n- Matchs de football\n- Festivals\n- Pièces de théâtre\nVisitez notre page d'accueil pour découvrir les prochains événements!";
    } else if (lowerMsg.includes("contacter") || lowerMsg.includes("support")) {
      return "Contactez le support WRI9A par :\n📧 Email: support@wri9a.com\n📞 Téléphone: +212 6 00 00 00 00\n💬 Ce chat (ouvert 24/7)";
    } else {
      return "Merci pour votre message! Notre équipe WRI9A vous répondra rapidement.";
    }
  };

  const sendQuickQuestion = (question) => {
    setInput(question);
    setTimeout(() => {
      sendMessage(question);
    }, 100);
  };

  return (
    <div className={`chat-container ${isOpen ? "open" : ""}`}>
      <div className="chat-toggle-btn" onClick={toggleChat}>
        {isOpen ? (
          <span className="close-icon">✖</span>
        ) : (
          <div className="chat-icon">
            <span className="notification-badge">3</span>
            <span>💬</span>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="header-content">
              <h3>Support WRI9A</h3>
              <p>Service client 24/7</p>
            </div>
            <button className="close-btn" onClick={toggleChat}>
              ✖
            </button>
          </div>

          {/* Questions WRI9A */}
          <div className="quick-questions">
            {wri9aQuestions.map((question, index) => (
              <button 
                key={index} 
                className="quick-question-btn"
                onClick={() => sendQuickQuestion(question)}
                disabled={isThinking}
              >
                {question}
              </button>
            ))}
          </div>

          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="empty-state">
                <p>Comment pouvons-nous vous aider?</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`message ${msg.sender}`}>
                  <div className="message-content">
                    {msg.text.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                    <div className="message-time">
                      {msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
            {isThinking && (
              <div className="message bot thinking">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Posez votre question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              disabled={isThinking}
            />
            <button 
              onClick={() => sendMessage()} 
              disabled={isThinking || !input.trim()}
              className={isThinking ? "sending" : ""}
            >
              {isThinking ? "..." : "➤"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
