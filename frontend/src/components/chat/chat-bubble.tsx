export const ChatBubbleFromMe = ({ text }: { text: string }) => (
   <div className="chat-message">
      <div className="flex items-end justify-end">
         <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
            <div>
               <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-pink-600 text-white ">
                  {text}
               </span>
            </div>
         </div>
      </div>
   </div>
);

export const ChatBubbleFromAi = ({ text }: { text: string }) => (
   <div className="chat-message">
      <div className="flex items-end">
         <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
            <div>
               <span className="px-4 py-2 rounded-lg inline-block bg-gray-300 text-gray-600">
                  {text}
               </span>
            </div>
         </div>
      </div>
   </div>
);
