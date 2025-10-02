
import React, { useState, useCallback, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { UploadedFile, ChatMessage, TutorMode } from './types';
import { runTutorQuery } from './services/geminiService';
import { fileToGenerativePart } from './utils/fileUtils';
import { WelcomeScreen } from './components/WelcomeScreen';

const App: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const aiRef = useRef<GoogleGenAI | null>(null);

  if (process.env.API_KEY && !aiRef.current) {
    aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  const handleFileUpload = async (files: FileList) => {
    setError(null);
    try {
      const filePromises = Array.from(files).map(async (file) => {
        const generativePart = await fileToGenerativePart(file);
        return {
          name: file.name,
          type: file.type,
          generativePart,
        };
      });
      const newFiles = await Promise.all(filePromises);
      setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    } catch (err) {
      setError('Error processing files. Please try again.');
      console.error(err);
    }
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(f => f.name !== fileName));
  };


  const handleSendMessage = useCallback(async (message: string, mode: TutorMode) => {
    if (!message.trim() || isLoading || uploadedFiles.length === 0) return;
    if (!aiRef.current) {
        setError("API key not configured. Please set the API_KEY environment variable.");
        return;
    }

    setIsLoading(true);
    setError(null);

    const userMessage: ChatMessage = { sender: 'user', text: message };
    setChatHistory((prev) => [...prev, userMessage]);

    try {
      const result = await runTutorQuery(aiRef.current, uploadedFiles, message, mode);
      
      let aiMessage: ChatMessage;

      if (mode === TutorMode.PRACTICE_PROBLEM) {
        try {
          const parsedResult = JSON.parse(result);
          aiMessage = {
            sender: 'ai',
            type: 'problem',
            problem: parsedResult.problem || "Sorry, I couldn't generate a problem.",
            solution: parsedResult.solution || "No solution was provided."
          };
        } catch (e) {
          console.error("Failed to parse JSON for practice problem:", e);
          aiMessage = { sender: 'ai', text: "I tried to generate a practice problem, but there was an issue with the format. Here's the raw response: " + result };
        }
      } else {
        aiMessage = { sender: 'ai', text: result };
      }
      
      setChatHistory((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      const errorMessage = `Error communicating with AI: ${err.message || 'An unknown error occurred'}`;
      setError(errorMessage);
      setChatHistory((prev) => [...prev, { sender: 'ai', text: `Sorry, I encountered an error. ${errorMessage}` }]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, uploadedFiles]);
  
  const startNewSession = () => {
    setUploadedFiles([]);
    setChatHistory([]);
    setError(null);
    setIsLoading(false);
  };


  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen flex flex-col font-sans">
      <Header onNewSession={startNewSession} />
      <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-4rem)]">
        <FileUpload 
          onFileUpload={handleFileUpload} 
          uploadedFiles={uploadedFiles}
          removeFile={removeFile}
        />
        <div className="flex-1 flex flex-col bg-gray-800 border-l border-gray-700 h-full">
          {chatHistory.length === 0 && uploadedFiles.length > 0 && <WelcomeScreen />}
          <ChatWindow history={chatHistory} />
          {error && <div className="px-4 py-2 text-red-400 bg-red-900/50 text-sm">{error}</div>}
          <ChatInput 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading} 
            hasFiles={uploadedFiles.length > 0} 
          />
        </div>
      </main>
    </div>
  );
};

export default App;
