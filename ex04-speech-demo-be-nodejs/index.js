const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5001;

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000'
}));

app.get('/api/Voice/get-speech-token', async (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  const speechKey = process.env.AZURE_SPEECH_KEY;
  const speechRegion = process.env.AZURE_REGION;

  // TODO: call https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken and return the response to the client
  // Refer to https://learn.microsoft.com/en-us/azure/ai-services/authentication

});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
