import { useRef, useEffect, useState } from 'react';
import audioWaveGif from '../assets/audio_wave.gif'; // adjust the path according to your file structure

declare global {
   interface Window {
      webkitSpeechRecognition: any;
   }
}

export default function ChatPage() {
   const recognitionRef = useRef(new window.webkitSpeechRecognition());
   const audioElementRef = useRef<any>(null);

   const [transcript, setTranscript] = useState('');
   const [latestMessage, setLatestMessage] = useState('');

   recognitionRef.current.lang = 'en-US';
   recognitionRef.current.interimResults = false;

   const startTranscribing = () => {
      recognitionRef.current.start();
   };

   recognitionRef.current.onend = () => {
      setTimeout(startTranscribing, 3000);
   };

   recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0]?.transcript;
      if (!transcript) {
         return;
      }

      if (transcript.trim() === 'stop') {
         audioElementRef.current?.stop();
         return;
      }

      setTranscript(transcript);

      recognitionRef.current.stop();
      fetch('/transcript', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ transcript: transcript }),
      })
         .then((response) => response.json())
         .then((data) => {
            setLatestMessage(data.latestMessage);

            setTimeout(function () {
               audioElementRef.current.click();
            }, 200);

            setTimeout(function () {
               audioElementRef.current.src = data.filePath;
               audioElementRef.current.play();
            }, 500);

            setTimeout(startTranscribing, 3000);
         });
   };

   useEffect(() => {
      startTranscribing();
   }, []);

   return (
      <div className="bg-black">
         <div className=" mx-auto text-center flex flex-col">
            {transcript && !recognitionRef.current.paused && (
               <div className="mt-12 max-w-24">
                  <div className="text-white font-bold text-lg" id="transcript">
                     {transcript}
                  </div>
                  <div className="text-slate-200 font-sembold text-lg mt-12">
                     {latestMessage}
                  </div>
               </div>
            )}
            {(!transcript || recognitionRef.current.paused) && (
               <>
                  <img
                     src={audioWaveGif}
                     className="mx-auto mt-12"
                     alt="Description of GIF"
                     style={{ width: '35vw' }}
                  />

                  <h3 className="text-slate-200 font-bold text-xl mt-20"></h3>

                  <div className="mt-12">
                     <button
                        onClick={startTranscribing}
                        className="relative px-6 py-3 font-bold text-white rounded-lg group"
                     >
                        <span className="absolute inset-0 w-full h-full transition duration-300 transform -translate-x-1 -translate-y-1 bg-purple-800 ease opacity-80 group-hover:translate-x-0 group-hover:translate-y-0"></span>
                        <span className="absolute inset-0 w-full h-full transition duration-300 transform translate-x-1 translate-y-1 bg-pink-800 ease opacity-80 group-hover:translate-x-0 group-hover:translate-y-0 mix-blend-screen"></span>
                        <span className="relative"> Ask Kelvin anything.</span>
                     </button>
                  </div>
               </>
            )}
            <audio id="myAudio" ref={audioElementRef} />
         </div>
      </div>
   );
}
