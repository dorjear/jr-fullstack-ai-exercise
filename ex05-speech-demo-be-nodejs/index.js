const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const cors = require('cors');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const sdk = require("microsoft-cognitiveservices-speech-sdk");
require('dotenv').config();

ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();
const port = 5001;

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000'
}));

// Configure multer to save files with .webm extension
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.webm');
  }
});

const upload = multer({ storage: storage });

app.get('/api/Voice/get-speech-token', async (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  const speechKey = process.env.AZURE_SPEECH_KEY;
  const speechRegion = process.env.AZURE_REGION;

  if (speechKey === 'paste-your-speech-key-here' || speechRegion === 'paste-your-speech-region-here') {
    res.status(400).send('You forgot to add your speech key or region to the .env file.');
  } else {
    const headers = {
      headers: {
        'Ocp-Apim-Subscription-Key': speechKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    try {
      const tokenResponse = await axios.post(`https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, null, headers);
      res.send({ token: tokenResponse.data, region: speechRegion });
    } catch (err) {
      res.status(401).send('There was an error authorizing your speech key.');
    }
  }
});

app.post('/api/Voice/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const webmFilePath = req.file.path;
  const wavFilePath = webmFilePath.replace('.webm', '.wav');
  console.log(`WebM file saved to: ${webmFilePath}`);

  // Convert webm to wav
  ffmpeg(webmFilePath)
    .toFormat('wav')
    .on('error', (err) => {
      console.error('Error converting file: ', err);
      res.status(500).send('Error processing audio file');
    })
    .on('end', async () => {
      console.log(`Converted to WAV: ${wavFilePath}`);

      try {
        const audioFile = fs.readFileSync(wavFilePath);

        const audioConfig = sdk.AudioConfig.fromWavFileInput(audioFile);
        // TODO: implement the speech to text with sdk
        // use sdk.SpeechConfig.fromSubscription to set speech key and region
        // set speechConfig.speechRecognitionLanguage to 'en-US'
        // create SpeechRecognizer object
        // call recognizeOnceAsync to get result and set the result to the response



        // The following is doing same with Restful call rather than SDK.
        //   const response = await axios({
        //   method: 'post',
        //   url: `https://${process.env.AZURE_REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US`,
        //   headers: {
        //     'Content-Type': 'audio/wav',
        //     'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY
        //   },
        //   data: audioFile
        // });
        // console.log("The response is " + JSON.stringify(response.data))
        //
        // res.json(response.data);
      } catch (error) {
        console.error('Error processing audio file:', error);
        res.status(500).send('Error processing audio file');
      }
    })
    .save(wavFilePath);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
