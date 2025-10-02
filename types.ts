
import { Part } from '@google/genai';

export enum TutorMode {
  EXPLAIN_CONCEPT = 'EXPLAIN_CONCEPT',
  PRACTICE_PROBLEM = 'PRACTICE_PROBLEM',
}

export interface UploadedFile {
  name: string;
  type: string;
  generativePart: Part;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text?: string;
  type?: 'problem';
  problem?: string;
  solution?: string;
}
