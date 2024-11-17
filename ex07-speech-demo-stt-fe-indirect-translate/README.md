# React Speech service sample app

This sample shows how to integrate the backend for speech-to-text conversions.

## How to run the app

1. Clone this repo, then change directory to the project root and run `npm install` to install dependencies.
1. To run the Express server and React app together, run `npm start`.

## Speech-to-text from microphone

This sample updates the solution of previous lab. Use react-mic to record audio and send the file to the backend to handle.  

```javascript
const onStop = async (recordedBlob) => {
  console.log('Recorded Blob: ', recordedBlob);
  if (recordedBlob && recordedBlob.blob) {
    const formData = new FormData();
    formData.append('file', recordedBlob.blob, 'recording.wav');

    try {
      const response = await axios.post('http://localhost:5001/api/Voice/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      var text = response.data.DisplayText || response.data.displayText || 'No transcription available'
      console.log("text is " + text)
      setDisplayText(text);
      console.log('Transcription: ', response.data);
    } catch (error) {
      console.error('Error uploading the file:', error);
      setDisplayText('Error uploading the file.');      }
  } else {
    console.error('Recorded blob is empty or invalid');
  }
};
```

## Speech-to-text from file

Update the handleFileChange to following based on the previous lab.  

```javascript
const handleFileChange = async (event) => {

  const audioFile = event.target.files[0];

  const formData = new FormData();
  formData.append('file', audioFile);

  try {
    const response = await axios.post('http://localhost:5001/api/Voice/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    setDisplayText(response.data.DisplayText || response.data.displayText || 'No transcription available');
  } catch (error) {
    console.error('Error uploading the file:', error);
  }
};
```

You need the audio file as a JavaScript [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) object, so you can grab it directly off the event target using `const audioFile = event.target.files[0];`. Next, you use the file to create the `AudioConfig` and then pass it to the recognizer.

