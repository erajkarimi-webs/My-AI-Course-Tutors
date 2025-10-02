
import { GoogleGenAI, Type, Part } from '@google/genai';
import { UploadedFile, TutorMode } from '../types';

const practiceProblemSchema = {
  type: Type.OBJECT,
  properties: {
    problem: {
      type: Type.STRING,
      description: 'The full text of the practice problem, including any necessary context or data.',
    },
    solution: {
      type: Type.STRING,
      description: 'A detailed, step-by-step solution to the problem.',
    },
  },
  required: ['problem', 'solution'],
};

const getSystemInstruction = (): Part => {
  return {
    text: `You are an expert AI tutor for a university-level Hydraulics course. 
    Your knowledge is strictly limited to the user-provided lecture notes and exam materials. 
    Do not use any external information or prior knowledge. 
    Your goal is to help the student understand the material.
    All your responses must be based *only* on the content within the provided files.
    When asked to explain something, cite which file you are using if possible.
    When generating a practice problem, ensure it is similar in style, topic, and difficulty to the examples in the provided documents.`
  };
};

export const runTutorQuery = async (
  ai: GoogleGenAI,
  files: UploadedFile[],
  prompt: string,
  mode: TutorMode
): Promise<string> => {
  const model = 'gemini-2.5-flash';
  
  const fileParts = files.map(file => file.generativePart);

  let userPromptText: string;
  let responseMimeType: string | undefined = undefined;
  let responseSchema: typeof practiceProblemSchema | undefined = undefined;

  if (mode === TutorMode.PRACTICE_PROBLEM) {
    userPromptText = `Generate a new, unique practice problem related to the topic of "${prompt}". Use the provided documents as a reference for style and content. Provide a detailed solution.`;
    responseMimeType = "application/json";
    responseSchema = practiceProblemSchema;
  } else {
    userPromptText = `Based on the provided documents, please explain the following concept or answer this question: "${prompt}"`;
  }
  
  const contents = [
    ...fileParts,
    { text: userPromptText }
  ];

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: {
        systemInstruction: getSystemInstruction(),
        ...(responseMimeType && { responseMimeType }),
        ...(responseSchema && { responseSchema }),
      },
    });
    return response.text;
  } catch (error) {
    console.error('Gemini API call failed:', error);
    throw new Error('Failed to get a response from the AI model.');
  }
};
