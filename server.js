import express from 'express';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Allow requests from your site only (change to your domain), or set origin: true to allow all.
app.use(cors({
  origin: ['https://chchweather.org.nz', 'http://localhost:8000'] // adjust as needed
}));
app.use(express.json());

if (!process.env.GROQ_API_KEY) {
  console.warn('Warning: GROQ_API_KEY not set in environment. Set it before running.');
}

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/ask', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  try {
    const chatCompletion = await client.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = chatCompletion?.choices?.[0]?.message?.content ?? '';
    res.json({ response: responseText });
  } catch (err) {
    console.error('Groq error:', err);
    // If the SDK throws APIError subclasses you can inspect them; return the message
    res.status(500).json({ error: err?.message ?? 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
