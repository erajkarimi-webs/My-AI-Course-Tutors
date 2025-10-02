
import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { UserIcon, RobotIcon } from './Icons';
import { PracticeProblem } from './PracticeProblem';

interface ChatWindowProps {
  history: ChatMessage[];
}

const ChatMessageItem: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.sender === 'user';

  if (message.type === 'problem' && message.problem && message.solution) {
    return <PracticeProblem problem={message.problem} solution={message.solution} />;
  }
  
  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1"><RobotIcon className="w-5 h-5 text-white" /></div>}
      <div className={`max-w-xl p-4 rounded-xl shadow-md ${isUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
        <p className="whitespace-pre-wrap">{message.text}</p>
      </div>
      {isUser && <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0 mt-1"><UserIcon className="w-5 h-5 text-gray-300" /></div>}
    </div>
  );
};

export const ChatWindow: React.FC<ChatWindowProps> = ({ history }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6">
      <div className="flex flex-col gap-6">
        {history.map((msg, index) => (
          <ChatMessageItem key={index} message={msg} />
        ))}
      </div>
    </div>
  );
};
