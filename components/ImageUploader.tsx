import React, { useCallback, useRef } from 'react';
import { UploadIcon, SparklesIcon } from './Icons';
import type { TranslationSet } from '../localization/translations';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  onSubmitDetections: () => void;
  isLoadingDetections: boolean;
  selectedFileName?: string;
  translations: TranslationSet;
  
  // New props for API Key management
  apiKeyInputValue: string;
  onApiKeyInputValueChange: (value: string) => void;
  onSaveApiKeyClick: () => void;
  apiKeyErrorText: string | null;
  isSavingApiKey: boolean;
  isApiKeyReady: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageSelect, 
  onSubmitDetections, 
  isLoadingDetections, 
  selectedFileName, 
  translations,
  apiKeyInputValue,
  onApiKeyInputValueChange,
  onSaveApiKeyClick,
  apiKeyErrorText,
  isSavingApiKey,
  isApiKeyReady,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoadingDetections) return; // Prevent changing file while processing
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  }, [onImageSelect, isLoadingDetections]);

  const triggerFileInput = () => {
    if (isLoadingDetections) return;
    fileInputRef.current?.click();
  };

  const handleApiKeyFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSavingApiKey) {
      onSaveApiKeyClick();
    }
  };
  
  // Overall uploader interaction should be disabled if detections are loading.
  // API key saving can also be a reason to disable its own button.
  const uploaderDisabled = isLoadingDetections; 

  return (
    <div className="space-y-6 p-4 sm:p-6 bg-gray-700/50 rounded-xl shadow-lg">
      {/* API Key Input Section */}
      {!isApiKeyReady && (
         <p className="text-center text-purple-300 mb-3">{translations.apiKeySetupInstruction}</p>
      )}
      <form onSubmit={handleApiKeyFormSubmit} className="space-y-3 p-4 bg-gray-700 rounded-lg shadow">
        <div>
          <label htmlFor="apiKeyInput" className="block text-sm font-medium text-gray-300 mb-1">
            {translations.apiKeyLabel}
            {isApiKeyReady && <span className="text-green-400 ml-2">(✓ Validated)</span>}
          </label>
          <div className="flex space-x-2">
            <input
              id="apiKeyInput"
              type="password"
              value={apiKeyInputValue}
              onChange={(e) => onApiKeyInputValueChange(e.target.value)}
              placeholder={translations.apiKeyInputPlaceholder}
              className="flex-grow px-3 py-2 bg-gray-600 text-gray-200 border border-gray-500 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors disabled:opacity-70"
              disabled={isSavingApiKey}
              aria-describedby={apiKeyErrorText ? "apiKeyErrorInline" : undefined}
            />
            <button
              type="submit"
              disabled={isSavingApiKey || isLoadingDetections}
              className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSavingApiKey ? translations.processingButton : translations.apiKeySaveButton}
            </button>
          </div>
          {apiKeyErrorText && (
            <p id="apiKeyErrorInline" className="text-red-400 text-xs mt-1" role="alert">
              {apiKeyErrorText}
            </p>
          )}
        </div>
        <p className="text-xs text-gray-400">
          {translations.apiKeyInstructions}{' '}
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 underline"
          >
            {translations.apiKeyHowToLinkText}
          </a>. {translations.apiKeyStorageNotice}
        </p>
      </form>

      {/* Image Upload Section */}
      <div 
        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed 
          ${uploaderDisabled ? 'border-gray-600 cursor-not-allowed' : 'border-gray-500 hover:border-purple-500 cursor-pointer'} 
          rounded-lg transition-colors duration-300 bg-gray-700 
          ${!uploaderDisabled ? 'hover:bg-gray-600' : ''}`}
        onClick={triggerFileInput}
        role="button"
        tabIndex={uploaderDisabled ? -1 : 0}
        onKeyDown={(e) => !uploaderDisabled && e.key === 'Enter' && triggerFileInput()}
        aria-label={`${translations.uploadInstructionPrefix} ${translations.uploadInstructionSuffix}`}
        aria-disabled={uploaderDisabled}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          disabled={uploaderDisabled}
          aria-hidden="true"
        />
        <div className={`flex flex-col items-center justify-center pt-5 pb-6 ${uploaderDisabled ? 'text-gray-500' : 'text-gray-400'}`}>
          <UploadIcon className="w-10 h-10 mb-3" />
          <p className="mb-2 text-sm"><span className="font-semibold">{translations.uploadInstructionPrefix}</span> {translations.uploadInstructionSuffix}</p>
          <p className="text-xs">{translations.fileTypes}</p>
        </div>
      </div>

      {selectedFileName && (
        <div className={`text-sm text-center ${uploaderDisabled ? 'text-gray-500' : 'text-purple-300'}`}>
          {translations.selectedFile} <span className="font-semibold">{selectedFileName}</span>
        </div>
      )}

      <button
        onClick={onSubmitDetections}
        disabled={isLoadingDetections || !selectedFileName || !isApiKeyReady}
        className="w-full flex items-center justify-center px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-md hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed group"
        aria-label={isLoadingDetections ? translations.processingButton : translations.detectButton}
      >
        {isLoadingDetections ? (
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