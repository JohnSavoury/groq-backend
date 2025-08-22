import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import Groq from 'groq-sdk';

const app = express();
const PORT = process.env.PORT || 3000;

// List of allowed origins
const allowedOrigins = [
  "http://localhost",
  "http://127.0.0.1",
  "https://chchweather.org.nz"
];

// CORS middleware
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like curl, Postman, or server-side requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      return callback(new Error('CORS policy does not allow this origin'), false);
    }
    return callback(null, true);
  },
  methods: ["GET","POST","OPTIONS"],
  credentials: true
}));

// Parse JSON bodies
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
    res.status(500).json({ error: 'Error generating summary' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});