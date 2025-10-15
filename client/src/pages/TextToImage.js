import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const TextToImage = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarActive, setSidebarActive] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load chat history from localStorage
    const savedChat = JSON.parse(localStorage.getItem('emotibot-image-chat') || '[]');
    if (savedChat.length > 0) {
      setMessages(savedChat);
    } else {
      // Initial bot message
      setMessages([{
        sender: 'bot',
        content: "Hello! I'm EmotiBot, your image generation AI! 😊 Describe the image you want to create!",
        timestamp: new Date().toISOString()
      }]);
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // Save chat history to localStorage
    localStorage.setItem('emotibot-image-chat', JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    const message = inputMessage.trim();
    if (!message) return;

    // Add user message
    const userMessage = {
      sender: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Send message to backend
      const response = await fetch('http://localhost:5000/api/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: message,
          model: 'google/gemini-2.5-flash-image-preview'
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (data.images && data.images.length > 0) {
        // Add bot response with image
        const botMessage = {
          sender: 'bot',
          content: "Here's your generated image!",
          imageUrl: data.images[0],
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error("No image was generated");
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        sender: 'bot',
        content: `❌ Error: ${error.message}`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear all image generation history?')) {
      setMessages([{
        sender: 'bot',
        content: "Hello! I'm EmotiBot, your image generation AI! 😊 Describe the image you want to create!",
        timestamp: new Date().toISOString()
      }]);
      localStorage.removeItem('emotibot-image-chat');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
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
            <button className="mode-btn" onClick={() => navigate('/text-to-text')}>💬 Text to Text</button>
            <button className="mode-btn active" onClick={() => navigate('/text-to-image')}>🖼️ Text to Image</button>
          </div>
        </div>
        <div className="chat">
          <h3>Generation History</h3>
          <div id="chat-list">
            {messages.filter(msg => msg.sender === 'user').slice(-5).map((msg, index) => (
              <div key={index} className="chat-item">
                {msg.content.substring(0, 30)}...
              </div>
            ))}
          </div>
          <button className="clear-btn" onClick={clearChat}>Clear History</button>
        </div>
      </div>

      <div className="main-chat">
        <div className="chat-header">
          <div className="current-mode">🖼️ Text to Image Mode</div>
        </div>

        <div className="chat-messages" id="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              <div className="message-avatar">{message.sender === 'user' ? '👤' : '🤖'}</div>
              <div className="message-content">
                {message.content}
                {message.imageUrl && (
                  <div className="media-content">
                    <img src={message.imageUrl} alt="Generated image" />
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="typing-indicator" style={{ display: 'flex' }}>
              <div className="message-avatar">🤖</div>
              <div>
                EmotiBot is generating
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
              placeholder="Describe the image you want to generate..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="action-btn send-btn" onClick={sendMessage} title="Generate image">➤</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextToImage;