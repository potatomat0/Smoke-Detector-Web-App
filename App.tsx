import React, { useState, useCallback, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ImageDisplayWithDetections } from './components/ImageDisplayWithDetections';
import { Spinner } from './components/Spinner';
import { LanguageSelector } from './components/LanguageSelector';
// ApiKeyModal is removed
import { initializeGeminiClient, detectSmokeAndFire, isGeminiClientInitialized } from './services/geminiService';
import type { Detection } from './types';
import { fileToBase64 } from './utils/fileUtils';
import { translations, LanguageCode, GEMINI_API_KEY_LOCAL_STORAGE } from './localization/translations';

const App: React.FC = () => {
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [detections, setDetections] = useState<Detection[] | null>(null);
  const [isLoadingDetections, setIsLoadingDetections] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [language, setLanguage] = useState<LanguageCode>('en');
  
  // New states for inline API key management
  const [userApiKeyInput, setUserApiKeyInput] = useState<string>('');
  const [currentValidApiKey, setCurrentValidApiKey] = useState<string | null>(null);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [isInitializingApiKey, setIsInitializingApiKey] = useState<boolean>(false);

  const currentTranslations = translations[language];

  const attemptInitializeClient = useCallback(async (keyToTry: string, lang: LanguageCode) => {
    if (!keyToTry.trim()) {
      setApiKeyError(translations[lang].apiKeyCannotBeEmpty);
      localStorage.removeItem(GEMINI_API_KEY_LOCAL_STORAGE);
      setCurrentValidApiKey(null);
      return false;
    }
    setIsInitializingApiKey(true);
    setApiKeyError(null);
    const initResult = initializeGeminiClient(keyToTry, lang);
    if (initResult.success) {
      localStorage.setItem(GEMINI_API_KEY_LOCAL_STORAGE, keyToTry);
      setCurrentValidApiKey(keyToTry);
      // Optionally set a success message or clear error for a short time
      // setApiKeyError(currentTranslations.apiKeySuccess); // Or handle this differently
      setIsInitializingApiKey(false);
      return true;
    } else {
      localStorage.removeItem(GEMINI_API_KEY_LOCAL_STORAGE);
      setCurrentValidApiKey(null);
      setApiKeyError(initResult.error || translations[lang].apiKeyInvalidError);
      setIsInitializingApiKey(false);
      return false;
    }
  }, []); // translations[lang] will be passed directly or use currentTranslations inside

  useEffect(() => {
    const storedKey = localStorage.getItem(GEMINI_API_KEY_LOCAL_STORAGE);
    if (storedKey) {
      setUserApiKeyInput(storedKey);
      attemptInitializeClient(storedKey, language);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, attemptInitializeClient]); // Rerun if language changes to re-validate with correct error messages if needed.

  useEffect(() => {
    return () => {
      if (selectedImageUrl) {
        URL.revokeObjectURL(selectedImageUrl);
      }
    };
  }, [selectedImageUrl]);

  const handleImageSelect = useCallback((file: File) => {
    if (selectedImageUrl) {
      URL.revokeObjectURL(selectedImageUrl);
    }
    setSelectedImageFile(file);
    setSelectedImageUrl(URL.createObjectURL(file));
    setDetections(null); 
    setGeneralError(null);
  }, [selectedImageUrl]);

  const handleSubmitDetections = useCallback(async () => {
    if (!currentValidApiKey || !isGeminiClientInitialized()) {
      setGeneralError(currentTranslations.geminiClientNotInitialized);
      // Prompt user to check API key input area
      setApiKeyError(currentTranslations.geminiClientNotInitialized); // Also show error near API key input
      return;
    }
    if (!selectedImageFile) {
      setGeneralError(currentTranslations.selectImageFirst);
      return;
    }

    setIsLoadingDetections(true);
    setGeneralError(null);
    setDetections(null);

    try {
      const base64Data = await fileToBase64(selectedImageFile);
      const mimeType = selectedImageFile.type;
      
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(mimeType)) {
        throw new Error(currentTranslations.unsupportedImageType);
      }

      const result = await detectSmokeAndFire(base64Data, mimeType, language);
      setDetections(result);
    } catch (err) {
      console.error("Detection error:", err);
      const errorMessage = (err as Error).message || currentTranslations.errorDuringDetection;
      setGeneralError(errorMessage);
      if (errorMessage === currentTranslations.apiKeyInvalidError || errorMessage === currentTranslations.geminiClientNotInitialized) {
        // API key became invalid during operation
        localStorage.removeItem(GEMINI_API_KEY_LOCAL_STORAGE);
        setCurrentValidApiKey(null);
        setApiKeyError(errorMessage); // Show error near API key input
      }
      setDetections(null);
    } finally {
      setIsLoadingDetections(false);
    }
  }, [selectedImageFile, language, currentTranslations, currentValidApiKey]);

  const handleLanguageChange = (lang: LanguageCode) => {
    setLanguage(lang);
    setGeneralError(null); 
    setApiKeyError(null); 
    const keyToRevalidate = currentValidApiKey || userApiKeyInput || localStorage.getItem(GEMINI_API_KEY_LOCAL_STORAGE);
    if (keyToRevalidate) {
       attemptInitializeClient(keyToRevalidate, lang);
    }
  };
  
  useEffect(() => {
    document.title = currentTranslations.pageTitle;
  }, [currentTranslations.pageTitle]);

  const handleSaveApiKey = useCallback(() => {
    attemptInitializeClient(userApiKeyInput, language);
  }, [userApiKeyInput, language, attemptInitializeClient]);

  const isApiKeyReady = currentValidApiKey !== null && isGeminiClientInitialized();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 md:p-8">      
      <header className="w-full max-w-4xl mb-8 text-center">
        <div className="flex justify-between items-center mb-2 sm:mb-4">
          <h1 className="text-3xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-left flex-1">
            {currentTranslations.appTitle}
          </h1>
          <LanguageSelector currentLanguage={language} onChangeLanguage={handleLanguageChange} translations={currentTranslations}/>
        </div>
        <p className="text-gray-400 mt-2 text-lg text-left sm:text-center">
          {currentTranslations.appSubtitle}
        </p>
      </header>

      <main className={`w-full max-w-4xl bg-gray-800 shadow-2xl rounded-xl p-6 sm:p-8`}>
        <ImageUploader
          onImageSelect={handleImageSelect}
          onSubmitDetections={handleSubmitDetections}
          isLoadingDetections={isLoadingDetections}
          selectedFileName={selectedImageFile?.name}
          translations={currentTranslations}
          // API Key Props
          apiKeyInputValue={userApiKeyInput}
          onApiKeyInputValueChange={setUserApiKeyInput}
          onSaveApiKeyClick={handleSaveApiKey}
          apiKeyErrorText={apiKeyError}
          isSavingApiKey={isInitializingApiKey}
          isApiKeyReady={isApiKeyReady}
        />

        {generalError && (
          <div className="mt-6 p-4 bg-red-700/50 border border-red-500 text-red-200 rounded-lg text-center">
            <p className="font-semibold">{currentTranslations.errorHeading}</p>
            <p>{generalError}</p>
          </div>
        )}

        {isLoadingDetections && (
          <div className="mt-8 flex flex-col items-center justify-center">
            <Spinner />
            <p className="mt-3 text-lg text-purple-400">{currentTranslations.analyzingImage}</p>
          </div>
        )}
        
        <div className="mt-8">
          <ImageDisplayWithDetections 
            imageUrl={selectedImageUrl} 
            detections={detections} 
            isLoading={isLoadingDetections} // Pass isLoadingDetections as isLoading
            translations={currentTranslations}
          />
        </div>
        
        {selectedImageUrl && !isLoadingDetections && detections && detections.length === 0 && isApiKeyReady && (
          <div className="mt-6 p-4 bg-green-700/30 border border-green-500 text-green-200 rounded-lg text-center">
            <p className="font-semibold">{currentTranslations.noDetections}</p>
          </div>
        )}

        {selectedImageUrl && !isLoadingDetections && detections && detections.length > 0 && isApiKeyReady && (
           <div className="mt-6 p-4 bg-gray-700 rounded-lg">
             <h3 className="text-xl font-semibold text-purple-300 mb-3">{currentTranslations.detectionDetails}</h3>
             <ul className="space-y-2">
               {detections.map((detection, index) => (
                 <li key={index} className="p-3 bg-gray-600 rounded shadow">
                   <span className={`font-bold capitalize ${detection.type === 'fire' ? 'text-red-400' : 'text-yellow-400'}`}>
                     {detection.type === 'fire' ? currentTranslations.fire : currentTranslations.smoke}:
                   </span>
                   <span className="ml-2 text-gray-300">{detection.description}</span>
                 </li>
               ))}
             </ul>
           </div>
        )}
      </main>

      <footer className="w-full max-w-4xl mt-12 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} {currentTranslations.footerText}</p>
      </footer>
    </div>
  );
};

export default App;