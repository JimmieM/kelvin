import { ChatPage } from './components/chat/chat.page';

export type AppMode = 'wall' | 'chat';

function App() {
   return (
      <>
         <ChatPage />
      </>
   );
}

export default App;
