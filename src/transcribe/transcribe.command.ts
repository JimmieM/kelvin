import { Command } from 'commander';
import express from 'express';

import open from 'open';
import { runChatCompletion } from '../chat-gpt/chat-completion.js';
import { convertTextToSpeech } from '../aws/polly/text-to-speech.js';
import path from 'path';

import { rootDirectory } from '../root/index.js';

export const transcribeCommand = new Command('transcribe');

const inlineHtml = `
<!DOCTYPE html>
<html>
<body>

<audio id="myAudio" type="audio/mpeg">
Your browser does not support the audio element.
</audio>

<button onclick="startTranscribing()">Start transcribing</button>
<p id="transcript"></p>

<script>
  var recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  function startTranscribing() {
    recognition.start();
  }

  recognition.onresult = function(event) {
    var transcript = event.results[0][0].transcript;
    document.getElementById('transcript').innerText = transcript;
    fetch('/transcript', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ transcript: transcript })
    }).then(response => response.json())
      .then(data => {

         setTimeout(function() {
            $("#myAudio").trigger('click');
        }, 200);

        setTimeout(function() {
         var audioElement = document.getElementById('myAudio');
         audioElement.src = data.filePath; // Here, replace "filePath" with the actual key you used in your response object.
         audioElement.play();
     }, 500);

        console.warn(data)

      });
  };

  startTranscribing()
</script>

</body>
</html>
`;

transcribeCommand
   .description('Transcribes audio from the microphone')
   .action(() => {
      // Create a new Express application
      const app = express();

      const publicDirectory = path.join(rootDirectory, 'public');
      app.use('/public', express.static(publicDirectory));

      // Middlewares for handling JSON body
      app.use(express.json());
      app.use(express.urlencoded({ extended: false }));

      let chatGptHistory: any[] = [];

      // Serve a static HTML file
      app.get('/', (req, res) => {
         res.send(inlineHtml);
      });

      // Handle transcript POST requests
      app.post('/transcript', async (req, res) => {
         try {
            console.log('Received transcript:', req.body.transcript);

            const text = req.body.transcript;

            chatGptHistory = await runChatCompletion(text, chatGptHistory);

            const latestMessage = chatGptHistory[chatGptHistory.length - 1][1];

            const textToMp3Filepath = await convertTextToSpeech(
               latestMessage,
               {},
            );

            // TODO: Here, you can call the function that plays the text
            res.json({
               filePath: `http://localhost:5200/public/${textToMp3Filepath}`,
            });
         } catch (error) {
            res.send('Bad').status(500);
         }
      });

      // Start the server
      const server = app.listen(5200, () => {
         console.log(
            'Server started. Open a browser and go to http://localhost:3000',
         );
         // Open the user's default browser
         open('http://localhost:5200');
      });

      // When the user presses Ctrl+C, close the server
      process.on('SIGINT', () => {
         server.close();
         process.exit(0);
      });
   });
