// استدعاء المكتبات
const express = require('express');
const router = express.Router();
const axios = require('axios');
const gTTS = require('gtts'); // 
const { detect } = require('langdetect');
const Denque = require('denque'); // 

// key API
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "paste oppenrouter api key here";
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";


const DEFAULT_TEXT_MODEL = "gpt-4o-mini";

const headers = {
  "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
  "Content-Type": "application/json",
  "HTTP-Referer": "http://localhost:5000",
  "X-Title": "Chatbot + Image Generator via OpenRouter"
};

// 📝 conversation history 
let conversationHistory = new Denque([], { capacity: 30 });

function addToConversation(role, content) {
  conversationHistory.push({ role, content });
}

router.post('/', async (req, res) => {
  try {
    const { prompt, model = DEFAULT_TEXT_MODEL } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    addToConversation("user", prompt);

    const payload = {
      model,
      messages: conversationHistory.toArray()
    };

    const response = await axios.post(`${OPENROUTER_BASE_URL}/chat/completions`, payload, { headers });
    const reply = response.data.choices[0].message.content;

    addToConversation("assistant", reply);

    const language = detect(reply)[0].lang;
    const tts = new gTTS(reply, language);

    const audioBuffer = await new Promise((resolve, reject) => {
      const chunks = [];
      const stream = tts.stream();

      stream.on('data', chunk => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });

    const audioBase64 = audioBuffer.toString('base64');

    res.json({
      reply,
      audio_base64: audioBase64
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/clear', (req, res) => {
  conversationHistory.clear(); 
  res.json({ message: "Conversation history cleared on server!" });
});

module.exports = router;
