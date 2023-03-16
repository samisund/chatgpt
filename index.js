const express = require('express');
const app = express();

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const PORT = process.env.PORT || 3000;

app.use(express.json());
  
app.post('/', async (req, res) => {

  if(!req.body || !req.body.userMessage || !req.body.userMessage.message) {
    return res.status(400).send({
      error: 'invalid request'
   });
  }

  const { message } = req.body.userMessage;

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{role: "user", content: message}],
  });

  const answer = completion.data.choices[0].message.content || '';

  if(!answer) {
    return res.status(400).send({
      error: 'invalid answer from openai'
   });
  }
  
  res.send({
    botMessage: answer
  });
});
 
app.listen(PORT, () => {
  console.log(`Our express server is up on port ${PORT}`);
});