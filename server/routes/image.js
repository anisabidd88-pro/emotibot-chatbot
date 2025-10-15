const express = require('express');
const router = express.Router();
const axios = require('axios');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "oppenrouter api key here";
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

const DEFAULT_IMAGE_MODEL = "google/gemini-2.5-flash-image-preview";

const headers = {
  "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
  "Content-Type": "application/json",
  "HTTP-Referer": "http://localhost:5000",
  "X-Title": "Chatbot + Image Generator via OpenRouter"
};

router.post('/', async (req, res) => {
  try {
    const { prompt, model = DEFAULT_IMAGE_MODEL } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Generate image
    const payload = {
      model,
      messages: [{"role": "user", "content": prompt}],
      modalities: ["image", "text"]
    };

    const response = await axios.post(`${OPENROUTER_BASE_URL}/chat/completions`, payload, { headers });
    
    const imageDataUrls = [];
    const choices = response.data.choices || [];
    
    if (choices.length > 0) {
      const msg = choices[0].message || {};
      const images = msg.images || [];
      
      for (const img of images) {
        if (img.image_url && img.image_url.url) {
          imageDataUrls.push(img.image_url.url);
        }
      }
    }
    
    if (imageDataUrls.length === 0) {
      return res.status(500).json({ error: "No image returned." });
    }

    res.json({
      images: imageDataUrls
    });
  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;