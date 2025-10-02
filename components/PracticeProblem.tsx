
import React, { useState } from 'react';
import { RobotIcon, EyeIcon, EyeSlashIcon } from './Icons';

interface PracticeProblemProps {
  problem: string;
  solution: string;
}

export const PracticeProblem: React.FC<PracticeProblemProps> = ({ problem, solution }) => {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
        <RobotIcon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 max-w-xl p-4 rounded-xl shadow-md bg-gray-700 text-gray-200 rounded-bl-none">
        <h3 className="text-lg font-semibold mb-2 text-blue-300">Practice Problem</h3>
        <p className="whitespace-pre-wrap mb-4 pb-4 border-b border-gray-600">{problem}</p>
        
        {showSolution ? (
          <div>
            <h4 className="text-md font-semibold mb-2 text-green-300">Solution</h4>
            <p className="whitespace-pre-wrap text-gray-300">{solution}</p>
            <button
              onClick={() => setShowSolution(false)}
              className="mt-4 flex items-center gap-2 text-sm font-medium text-yellow-400 hover:text-yellow-300"
            >
              <EyeSlashIcon className="w-5 h-5" />
              Hide Solution
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowSolution(true)}
            className="flex items-center gap-2 text-sm font-medium text-yellow-400 hover:text-yellow-300"
          >
            <EyeIcon className="w-5 h-5" />
            Show Solution
          </button>
        )}
      </div>
    </div>
  );
};
