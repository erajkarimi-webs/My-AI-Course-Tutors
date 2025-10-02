
import React, { useCallback, useState } from 'react';
import { UploadIcon, FileIcon, CloseIcon } from './Icons';
import { UploadedFile } from '../types';

interface FileUploadProps {
  onFileUpload: (files: FileList) => void;
  uploadedFiles: UploadedFile[];
  removeFile: (fileName: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, uploadedFiles, removeFile }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files);
      e.target.value = ''; // Reset input to allow re-uploading the same file
    }
  };

  return (
    <aside className="w-full md:w-80 bg-gray-800/50 p-4 flex flex-col space-y-4 border-r border-gray-700 overflow-y-auto h-full max-h-[calc(100vh-4rem)]">
      <div>
        <h2 className="text-lg font-semibold text-gray-200 mb-2">Course Materials</h2>
        <p className="text-sm text-gray-400 mb-4">Upload your lecture notes and past exams.</p>
        <label
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center w-full h-32 px-4 transition bg-gray-800 border-2 ${isDragging ? 'border-blue-400' : 'border-gray-600'} border-dashed rounded-md cursor-pointer hover:border-gray-500`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadIcon className="w-8 h-8 mb-2 text-gray-500"/>
            <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500">PDF, TXT, PNG, JPG, etc.</p>
          </div>
          <input type="file" className="hidden" multiple onChange={handleFileChange} />
        </label>
      </div>
      <div className="flex-1 overflow-y-auto">
        {uploadedFiles.length > 0 && <h3 className="text-md font-semibold text-gray-300 mb-2">Uploaded Files</h3>}
        <ul className="space-y-2">
          {uploadedFiles.map((file, index) => (
            <li key={`${file.name}-${index}`} className="flex items-center justify-between bg-gray-700 p-2 rounded-md">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-300 truncate" title={file.name}>{file.name}</span>
              </div>
              <button onClick={() => removeFile(file.name)} className="p-1 rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500">
                <CloseIcon className="w-4 h-4 text-gray-400 hover:text-red-400"/>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};
