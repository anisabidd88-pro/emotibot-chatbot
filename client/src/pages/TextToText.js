import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const TextToText = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarActive, setSidebarActive] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedChat = JSON.parse(localStorage.getItem('emotibot-chat') || '[]');
    if (savedChat.length > 0) {
      setMessages(savedChat);
    } else {
      setMessages([{
        sender: 'bot',
        content: "Hello! I'm EmotiBot, your multimodal AI assistant! 😊 How can I help you with text today?",
        timestamp: new Date().toISOString()
      }]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    localStorage.setItem('emotibot-chat', JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    const message = inputMessage.trim();
    if (!message) return;

    const userMessage = {
      sender: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: message })
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      const botMessage = {
        sender: 'bot',
        content: data.reply,
        audioBase64: data.audio_base64,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        sender: 'bot',
        content: `❌ Error: ${error.message}`,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const audioRef = useRef(null); 
  const playBotVoice = (audioBase64) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    audioRef.current = new Audio(`data:audio/mp3;base64,${audioBase64}`);
    audioRef.current.play();
  };

  const navigateToImage = async () => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      await fetch("http://localhost:5000/api/chat/clear", { method: "POST" });
    } catch (error) {
      console.error("Error clearing chat when switching mode:", error);
    }
    navigate('/text-to-image');
  };


  const clearChat = async () => {
    if (window.confirm('Are you sure you want to clear all chat history?')) {
      try {
        await fetch("http://localhost:5000/api/chat/clear", { method: "POST" });
        localStorage.removeItem('emotibot-chat');

        setMessages([{
          sender: 'bot',
          content: "Hello! I'm EmotiBot, your multimodal AI assistant! 😊 How can I help you with text today?",
          timestamp: new Date().toISOString()
        }]);
      } catch (error) {
        console.error("Failed to clear chat:", error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  return (
    <div className="container">
      <button className="hamburger-btn" onClick={toggleSidebar}>☰</button>
      <div className={`sidebar ${sidebarActive ? 'active' : ''}`}>
        <div className="logo">🤖 EmotiBot</div>
        <div className="mode-selector">
          <h3>Communication Modes</h3>
          <div className="mode-grid">
            <button className="mode-btn active" onClick={() => navigate('/text-to-text')}>💬 Text to Text</button>
            <button className="mode-btn" onClick={navigateToImage}>🖼️ Text to Image</button>
          </div>
        </div>
        <div className="Chat">
          <h3>Recent Chats</h3>
          <div id="Chat-list">
            {messages.filter(msg => msg.sender === 'user').slice(-5).map((msg, index) => (
              <div key={index} className="Chat-item">
                {msg.content.substring(0, 30)}...
              </div>
            ))}
          </div>
          <button className="clear-btn" onClick={clearChat}>Clear Chat</button>
        </div>
      </div>

      <div className="main-chat">
        <div className="chat-header">
          <div className="current-mode">💬 Text to Text Mode</div>
        </div>
        <div className="chat-messages" id="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              <div className="message-avatar">{message.sender === 'user' ? '👤' : '🤖'}</div>
              <div className="message-content">
                {message.content}
                {message.sender === 'bot' && message.audioBase64 && (
                  <button className="volume-btn" onClick={() => playBotVoice(message.audioBase64)}>🔊</button>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="typing-indicator" style={{ display: 'flex' }}>
              <div className="message-avatar">🤖</div>
              <div>
                EmotiBot is thinking
                <div className="typing-dots">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-input">
          <div className="input-container">
            <input 
              type="text" 
              className="input-field" 
              id="message-input" 
              placeholder="Type your message here..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="action-btn send-btn" onClick={sendMessage} title="Send message">➤</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextToText;
