🧠 EmotiBot – AI Chat & Image Generator
🌍 "Talk, Imagine, and Create with Emotion."

📖 Overview

EmotiBot is an intelligent multi-modal assistant built with React (frontend) and Node.js + Express (backend).
It allows users to chat with an AI in natural language and generate realistic images from text prompts — all with optional voice synthesis replies for a human-like experience.

💬 Text → Text
🖼️ Text → Image
🔊 AI Voice Replies

🚀 Features

✅ Conversational AI (via OpenRouter GPT models)
✅ AI Image Generation from text prompts
✅ Text-to-Speech audio playback (gTTS)
✅ Clear chat history
✅ Elegant and responsive React UI
✅ Modular backend with Express routes (/api/chat, /api/image)

🏗️ Tech Stack
Layer	Technologies
Frontend	React, React Router, CSS3
Backend	Node.js, Express.js
AI Models	OpenRouter GPT, Image Generator API
Voice	gTTS (Google Text-to-Speech)
Utilities	Axios, Langdetect, Denque
Styling	Custom CSS
📁 Project Structure
emotibot-app/
│
├── client/                  # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── pages/
│   │   │   ├── TextToText.js
│   │   │   └── TextToImage.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── globals.css
│   └── package.json
│
├── server/                  # Express Backend
│   ├── routes/
│   │   ├── chat.js
│   │   └── image.js
│   ├── index.js
│   └── package.json
│
└── README.md

⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/anisabidd88-pro/emotibot-chatbot.git
cd emotibot-chatbot

2️⃣ Setup the backend
cd server
npm install


Create a .env file:

OPENROUTER_API_KEY=your_api_key_here
PORT=5000
Or replace "paste oppenrouter api key here" by your oppenrouter api key in "server\routes\chat.js" and "server\routes\image.js"

Run the backend:

node index.js


The server runs by default on http://localhost:5000

3️⃣ Setup the frontend
cd ../client
npm install
npm start


Open http://localhost:3000
 to use the app.

💬 API Endpoints
Endpoint	Method	Description
/api/chat	POST	Send user text, receive AI reply (and voice)
/api/chat/clear	POST	Reset the chat history
/api/image	POST	Generate AI image(s) from text

🧑‍💻 Developer Notes

You can replace the OpenRouter model with OpenAI GPT-4, Gemini, or other APIs.

Voice synthesis uses gTTS; for advanced emotion control, you can integrate ElevenLabs Voice API.

For deployment, consider:

Frontend → Vercel / Netlify

Backend → Render / Railway / Heroku

🌟 Future Improvements

 Multi-language chat support

 Persistent chat sessions

 Image style presets (realistic, anime, art)

 Custom TTS voices

 Dark mode

🧾 License

This project is released under the MIT License — free to use, modify, and distribute.

💖 Author

Anis Abid

🎭 Creator of EmotiBot | Passionate about AI & Creative Technologies
