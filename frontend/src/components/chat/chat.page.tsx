import { useCallback, useEffect, useRef, useState } from 'react';
import { AppMode } from '../../App';
import audioWaveGif from '../../assets/audio_wave.gif'; // adjust the path according to your file structure
import { AppSwitchButton } from '../app-mode-switch';
import { Input } from '../input';
import { ChatBubbleFromAi, ChatBubbleFromMe } from './chat-bubble';
import * as marked from 'marked';

declare global {
   interface Window {
      webkitSpeechRecognition: any;
   }
}

const onEnterKeyPressHandler = (e: React.KeyboardEvent<any>, cb: () => any) => {
   if (e.key === 'Enter') {
      e.preventDefault();
      cb();
   }
};

const createMarkUp = (val: string) => {
   return { __html: marked.parse(val) };
};

export const ChatPage = () => {
   const messagesEndRef = useRef<any>(null);

   const [mode, setMode] = useState<AppMode>('wall');

   const recognitionRef = useRef(new window.webkitSpeechRecognition());
   const audioElementRef = useRef<any>(null);

   const [hasResponseError, setHasResponseError] = useState<undefined | string>(
      '',
   );
   const [isLoadingResponse, setIsLoadingResponse] = useState(false);
   const [transcript, setTranscript] = useState('');
   const [latestMessage, setLatestMessage] = useState('');
   const [history, setHistory] = useState<[string, string][]>([]);
   const [input, setInput] = useState('');

   recognitionRef.current.lang = process.env.REACT_APP_LANG_CODE || 'en-US';
   recognitionRef.current.interimResults = false;

   const startTranscribing = () => {
      recognitionRef.current.start();
   };

   recognitionRef.current.onend = () => {
      setTimeout(startTranscribing, 700);
   };

   recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0]?.transcript;
      if (!transcript) {
         return;
      }

      sendTranscript(transcript);
   };

   const sendTranscript = useCallback(
      (transcript: string, bypassWakeWord?: boolean) => {
         if (transcript.trim() === 'stop') {
            audioElementRef.current?.stop();
            return Promise.reject();
         }

         setTranscript(transcript);

         recognitionRef.current.stop();
         setIsLoadingResponse(true);

         return fetch('/transcript', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ transcript: transcript, bypassWakeWord }),
         })
            .then((response) => {
               if (!response.ok) {
                  throw response;
               }
               return response.json();
            })
            .then((data) => {
               setHasResponseError(undefined);
               setLatestMessage(data.latestMessage);
               setHistory(data.history);

               setTimeout(() => {
                  audioElementRef.current.click();
               }, 200);

               setTimeout(() => {
                  audioElementRef.current.src = data.filePath;
                  audioElementRef.current.play();
               }, 500);

               setTimeout(startTranscribing, 3000);

               setIsLoadingResponse(false);
            })
            .catch((err) => {
               console.warn(err);
               setIsLoadingResponse(false);
               setHasResponseError(
                  "I didn't quite get that. Try again, or with a wake word ...",
               );
            });
      },
      [],
   );

   const onEnterClick = useCallback(() => {
      if (isLoadingResponse) return;

      sendTranscript(input, true).then(() => setInput(''));
   }, [input, isLoadingResponse, sendTranscript]);

   useEffect(() => {
      startTranscribing();
   }, []);

   useEffect(() => {
      if (messagesEndRef.current) {
         messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
      }
   }, [history, mode]);

   return (
      <div className="bg-black">
         <audio id="myAudio" ref={audioElementRef} />

         {transcript && !recognitionRef.current.paused && (
            <div className="w-[70vw] mx-auto flex flex-col justify-between h-screen">
               <div className="flex justify-center mt-2">
                  <AppSwitchButton mode={mode} onChange={setMode} />
               </div>

               <div className="mt-12 max-w-24 w-full">
                  {mode === 'wall' && (
                     <>
                        <div
                           className="text-white font-bold text-lg text-center"
                           id="transcript"
                        >
                           {transcript}
                        </div>

                        {isLoadingResponse && (
                           <img
                              src={audioWaveGif}
                              className="mx-auto mt-16"
                              alt="Loading ..."
                              style={{ width: '15vw' }}
                           />
                        )}
                        {!isLoadingResponse && hasResponseError && (
                           <div className="text-slate-300 font-sembold text-lg mt-12 text-center">
                              {hasResponseError}
                           </div>
                        )}

                        {!isLoadingResponse && !hasResponseError && (
                           <div
                              className="text-slate-200 font-sembold text-lg mt-12 text-center"
                              dangerouslySetInnerHTML={createMarkUp(
                                 latestMessage,
                              )}
                           />
                        )}
                     </>
                  )}

                  {mode === 'chat' && (
                     <>
                        {!isLoadingResponse && hasResponseError && (
                           <div className="text-slate-300 font-sembold text-lg mt-12 text-center">
                              {hasResponseError}
                           </div>
                        )}

                        <div
                           id="messages"
                           ref={messagesEndRef}
                           className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch max-h-96 mt-2"
                        >
                           {history?.map((item) => {
                              return (
                                 <>
                                    <ChatBubbleFromMe text={item[0]} />
                                    <ChatBubbleFromAi text={item[1]} />
                                 </>
                              );
                           })}
                        </div>
                     </>
                  )}
               </div>

               <div className="mb-3">
                  <Input
                     disabled={isLoadingResponse}
                     onChange={setInput}
                     value={input}
                     onKeyPress={(e) => onEnterKeyPressHandler(e, onEnterClick)}
                  />
               </div>
            </div>
         )}

         {(!transcript || recognitionRef.current.paused) && (
            <div className=" mx-auto text-center flex flex-col">
               <img
                  src={audioWaveGif}
                  className="mx-auto mt-16"
                  alt="Description of GIF"
                  style={{ width: '30vw' }}
               />

               <h3 className="text-slate-200 font-bold text-xl mt-12"></h3>

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
            </div>
         )}
      </div>
   );
};
