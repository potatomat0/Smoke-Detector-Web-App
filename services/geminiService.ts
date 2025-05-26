
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { Detection, GeminiDetectionResponse } from '../types';
import type { LanguageCode, TranslationSet } from "../localization/translations";
import { translations } from "../localization/translations";


let ai: GoogleGenAI | null = null;

export const initializeGeminiClient = (apiKey: string, currentLanguage: LanguageCode): { success: boolean; error?: string } => {
  const currentTranslations = translations[currentLanguage];
  if (!apiKey || apiKey.trim() === "") {
    const message = currentTranslations.apiKeyCannotBeEmpty;
    console.error(message);
    return { success: false, error: message };
  }
  try {
    ai = new GoogleGenAI({ apiKey });
    // It's hard to synchronously validate the key without making a call.
    // The SDK constructor might throw for fundamentally malformed structures, but not for invalid credentials.
    // For now, we assume construction success means it's structurally okay.
    // Actual validation happens on the first API call.
    return { success: true };
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI client:", error);
    const message = error instanceof Error ? error.message : currentTranslations.apiKeyInvalidError;
    return { success: false, error: message };
  }
};

export const isGeminiClientInitialized = (): boolean => {
  return ai !== null;
};

const getPromptText = (language: LanguageCode): string => {
  const langInstruction = language === 'vi' 
    ? "Cung cấp mô tả bằng tiếng Việt." 
    : "Provide descriptions in English.";
  
  const exampleDescription = language === 'vi'
    ? "Đám cháy nhỏ ở giữa dưới cùng của hình ảnh."
    : "Small fire at the bottom-center of the image.";

  return `Analyze the provided image to identify any instances of smoke or fire.
${langInstruction}
For each detected instance, provide the following information in a JSON object:
1. "type": A string, either "smoke" or "fire".
2. "description": A brief textual description of the detected instance and its location (IN THE SPECIFIED LANGUAGE: ${language === 'vi' ? 'Vietnamese' : 'English'}).
3. "boundingBox": An object with "x1", "y1", "x2", "y2" keys. These values should be floating-point numbers between 0.0 and 1.0, representing the top-left (x1, y1) and bottom-right (x2, y2) corners of the bounding box as percentages of the image's total width and height.

Return a single JSON object with a key "detections", which is an array of these detection objects.
If no smoke or fire is detected, return an empty array for "detections": {"detections": []}.
Example for a single detection:
{
  "detections": [
    {
      "type": "fire",
      "description": "${exampleDescription}",
      "boundingBox": { "x1": 0.45, "y1": 0.8, "x2": 0.55, "y2": 0.9 }
    }
  ]
}
`;
};

export const detectSmokeAndFire = async (base64ImageData: string, mimeType: string, language: LanguageCode): Promise<Detection[]> => {
  const currentTranslations = translations[language];
  if (!ai) {
    return Promise.reject(new Error(currentTranslations.geminiClientNotInitialized));
  }
  try {
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64ImageData,
      },
    };

    const textPart = {
      text: getPromptText(language),
    };
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
      }
    });

    let jsonStr = response.text.trim();
    
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }

    try {
      const parsedData = JSON.parse(jsonStr) as GeminiDetectionResponse;
      if (parsedData && Array.isArray(parsedData.detections)) {
        const validDetections = parsedData.detections.filter(d => 
            d.type && (d.type === 'smoke' || d.type === 'fire') &&
            d.description && typeof d.description === 'string' &&
            d.boundingBox && typeof d.boundingBox.x1 === 'number' &&
            typeof d.boundingBox.y1 === 'number' &&
            typeof d.boundingBox.x2 === 'number' &&
            typeof d.boundingBox.y2 === 'number'
        );
        return validDetections;
      } else {
        console.error("Parsed JSON does not have the expected 'detections' array structure:", parsedData);
        const errorMessage = language === 'vi'
            ? "Định dạng phản hồi không hợp lệ từ API: không tìm thấy mảng 'detections' hoặc định dạng sai."
            : "Invalid response format from API: 'detections' array not found or malformed.";
        throw new Error(errorMessage);
      }
    } catch (e) {
      console.error("Failed to parse JSON response:", e, "Raw string:", jsonStr);
      const errorMessage = language === 'vi'
          ? `Không thể phân tích phản hồi API dưới dạng JSON. Đầu ra thô của Gemini: ${jsonStr.substring(0,1000)}`
          : `Failed to parse API response as JSON. Gemini raw output: ${jsonStr.substring(0,1000)}`;
      throw new Error(errorMessage);
    }

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Check if the error is related to API key specifically (e.g., 400/401/403 status from API)
    // This is a generic catch, so specific API key errors might be wrapped.
    // For now, we'll re-throw a generic message, but ideally, detect specific auth errors.
    if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes('PERMISSION_DENIED'))) {
         throw new Error(currentTranslations.apiKeyInvalidError);
    }
    
    if (error instanceof Error) {
        const errorMessage = language === 'vi'
            ? `Yêu cầu API Gemini không thành công: ${error.message}`
            : `Gemini API request failed: ${error.message}`;
        throw new Error(errorMessage);
    }
    const unknownErrorMessage = language === 'vi'
        ? "Đã xảy ra lỗi không xác định khi giao tiếp với API Gemini."
        : "An unknown error occurred while communicating with the Gemini API.";
    throw new Error(unknownErrorMessage);
  }
};
