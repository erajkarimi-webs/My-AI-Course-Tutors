
import React, { useState, useRef, useEffect } from 'react';
import { TutorMode } from '../types';
import { SendIcon, SparklesIcon, DocumentQuestionIcon } from './Icons';

interface ChatInputProps {
  onSendMessage: (message: string, mode: TutorMode) => void;
  isLoading: boolean;
  hasFiles: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, hasFiles }) => {
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState<TutorMode>(TutorMode.EXPLAIN_CONCEPT);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !isLoading && hasFiles) {
      onSendMessage(message, mode);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const ModeButton: React.FC<{
    buttonMode: TutorMode, 
    label: string, 
    icon: React.ReactNode
  }> = ({ buttonMode, label, icon }) => (
    <button
      onClick={() => setMode(buttonMode)}
      disabled={!hasFiles}
      className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
        mode === buttonMode 
        ? 'bg-blue-600 text-white' 
        : 'bg-gray-600 hover:bg-gray-500 text-gray-300'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="p-4 bg-gray-900 border-t border-gray-700">
        <div className="flex items-center gap-2 mb-3">
            <ModeButton 
                buttonMode={TutorMode.EXPLAIN_CONCEPT}
                label="Explain Concept"
                icon={<DocumentQuestionIcon className="w-5 h-5" />}
            />
            <ModeButton 
                buttonMode={TutorMode.PRACTICE_PROBLEM}
                label="Practice Problem"
                icon={<SparklesIcon className="w-5 h-5" />}
            />
        </div>
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={!hasFiles ? "Please upload your course materials first..." : 
            mode === TutorMode.EXPLAIN_CONCEPT ? "e.g., Explain Bernoulli's principle..." : "e.g., a problem about pipe friction..."}
          className="w-full bg-gray-700 text-gray-200 rounded-lg p-3 pr-20 resize-none border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200 max-h-40"
          rows={1}
          disabled={!hasFiles || isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !message.trim() || !hasFiles}
          className="absolute right-3 bottom-2.5 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
          ) : (
            <SendIcon className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};
