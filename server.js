import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import Groq from 'groq-sdk';

const app = express();

// Allow your website's domain
app.use(cors({
  origin: 'https://chchweather.org.nz' // replace with your actual site URL
}));

app.use(bodyParser.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/ask', async (req, res) => {
  try {
    const { prompt } = req.body;
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
    });
    res.json({ reply: chatCompletion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating summary');
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
