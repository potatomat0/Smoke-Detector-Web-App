
import React, { useCallback, useRef } from 'react';
import { UploadIcon, SparklesIcon } from './Icons';
import type { TranslationSet } from '../localization/translations';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  onSubmit: () => void;
  isLoading: boolean;
  selectedFileName?: string;
  translations: TranslationSet;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, onSubmit, isLoading, selectedFileName, translations }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  }, [onImageSelect]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 bg-gray-700/50 rounded-xl shadow-lg">
      <div 
        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-500 hover:border-purple-500 rounded-lg cursor-pointer transition-colors duration-300 bg-gray-700 hover:bg-gray-600"
        onClick={triggerFileInput}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && triggerFileInput()}
        aria-label={translations.uploadInstruction}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          disabled={isLoading}
          aria-hidden="true"
        />
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
          <UploadIcon className="w-10 h-10 mb-3" />
          <p className="mb-2 text-sm"><span className="font-semibold">{translations.uploadInstructionPrefix}</span> {translations.uploadInstructionSuffix}</p>
          <p className="text-xs">{translations.fileTypes}</p>
        </div>
      </div>

      {selectedFileName && (
        <div className="text-sm text-center text-purple-300">
          {translations.selectedFile} <span className="font-semibold">{selectedFileName}</span>
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={isLoading || !selectedFileName}
        className="w-full flex items-center justify-center px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-md hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed group"
        aria-label={isLoading ? translations.processingButton : translations.detectButton}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {translations.processingButton}
          </>
        ) : (
          <>
            <SparklesIcon className="w-6 h-6 mr-2 transition-transform duration-300 group-hover:scale-110" />
            {translations.detectButton}
          </>
        )}
      </button>
    </div>
  );
};
