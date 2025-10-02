
import React from 'react';
import { DocumentQuestionIcon, SparklesIcon } from './Icons';

export const WelcomeScreen: React.FC = () => {
    return (
        <div className="flex-1 flex flex-col justify-center items-center p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-200 mb-2">Ready to Study!</h2>
            <p className="text-gray-400 max-w-md mb-8">
                Your documents are loaded. Now you can ask the AI Tutor questions or ask for practice problems based on your materials.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
                <div className="bg-gray-700/50 p-6 rounded-lg">
                    <div className="flex items-center justify-center mb-3 text-blue-400">
                        <DocumentQuestionIcon className="w-8 h-8"/>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-200 mb-2">Explain a Concept</h3>
                    <p className="text-sm text-gray-400">
                        Select "Explain Concept" below and ask about any topic from your notes, like "What is the continuity equation?".
                    </p>
                </div>
                <div className="bg-gray-700/50 p-6 rounded-lg">
                    <div className="flex items-center justify-center mb-3 text-purple-400">
                        <SparklesIcon className="w-8 h-8"/>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-200 mb-2">Generate Practice Problems</h3>
                    <p className="text-sm text-gray-400">
                        Select "Practice Problem" and ask for a question on a topic, like "a problem about Reynolds number".
                    </p>
                </div>
            </div>
        </div>
    );
};
