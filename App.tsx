
import React, { useState, useCallback, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ImageDisplayWithDetections } from './components/ImageDisplayWithDetections';
import { Spinner } from './components/Spinner';
import { LanguageSelector } from './components/LanguageSelector';
import { detectSmokeAndFire } from './services/geminiService';
import type { Detection } from './types';
import { fileToBase64 } from './utils/fileUtils';
import { translations, LanguageCode } from './localization/translations';

const App: React.FC = () => {
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [detections, setDetections] = useState<Detection[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<LanguageCode>('en');

  const currentTranslations = translations[language];

  useEffect(() => {
    // Clean up object URL
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
    setDetections(null); // Clear previous detections
    setError(null); // Clear previous errors
  }, [selectedImageUrl]);

  const handleSubmit = useCallback(async () => {
    if (!selectedImageFile) {
      setError(currentTranslations.selectImageFirst);
      return;
    }

    setIsLoading(true);
    setError(null);
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
      setError((err as Error).message || currentTranslations.errorDuringDetection);
      setDetections(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedImageFile, language, currentTranslations]);

  const handleLanguageChange = (lang: LanguageCode) => {
    setLanguage(lang);
    setError(null); // Clear errors on language change
    // Optionally clear detections if desired, or re-fetch if an image is loaded
    // For now, just changing UI language. API results are based on language at time of call.
  };
  
  useEffect(() => {
    document.title = currentTranslations.pageTitle;
  }, [currentTranslations.pageTitle]);


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

      <main className="w-full max-w-4xl bg-gray-800 shadow-2xl rounded-xl p-6 sm:p-8">
        <ImageUploader
          onImageSelect={handleImageSelect}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          selectedFileName={selectedImageFile?.name}
          translations={currentTranslations}
        />

        {error && (
          <div className="mt-6 p-4 bg-red-700/50 border border-red-500 text-red-200 rounded-lg text-center">
            <p className="font-semibold">{currentTranslations.errorHeading}</p>
            <p>{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="mt-8 flex flex-col items-center justify-center">
            <Spinner />
            <p className="mt-3 text-lg text-purple-400">{currentTranslations.analyzingImage}</p>
          </div>
        )}
        
        <div className="mt-8">
          <ImageDisplayWithDetections 
            imageUrl={selectedImageUrl} 
            detections={detections} 
            isLoading={isLoading}
            translations={currentTranslations}
          />
        </div>
        
        {selectedImageUrl && !isLoading && detections && detections.length === 0 && (
          <div className="mt-6 p-4 bg-green-700/30 border border-green-500 text-green-200 rounded-lg text-center">
            <p className="font-semibold">{currentTranslations.noDetections}</p>
          </div>
        )}

        {selectedImageUrl && !isLoading && detections && detections.length > 0 && (
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
