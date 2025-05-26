export type LanguageCode = 'en' | 'vi';

export interface TranslationSet {
  pageTitle: string;
  appTitle: string;
  appSubtitle: string;
  selectImageFirst: string;
  unsupportedImageType: string;
  errorDuringDetection: string;
  analyzingImage: string;
  noDetections: string;
  detectionDetails: string;
  uploadInstructionPrefix: string;
  uploadInstructionSuffix: string;
  fileTypes: string;
  selectedFile: string;
  detectButton: string;
  processingButton: string;
  uploadToSee: string;
  preparingImage: string;
  analyzingOverlay: string;
  errorHeading: string;
  footerText: string;
  languageEnglish: string;
  languageVietnamese: string;
  smoke: string;
  fire: string;
  errorLoadingImage: string;
  imageDisplayArea: string;

  // API Key Form Translations
  apiKeyLabel: string;
  apiKeySetupInstruction: string; // New for inline setup
  apiKeyInstructions: string; // Re-purposed for brief inline explanation
  apiKeyInputPlaceholder: string;
  apiKeySaveButton: string;
  apiKeyMissingError: string; // Can still be relevant if input is empty on submit
  apiKeyInvalidError: string;
  apiKeyCannotBeEmpty: string; // Can still be relevant if input is empty on submit
  apiKeySuccess: string; // Potentially for a success message after saving
  apiKeyHowToLinkText: string;
  apiKeyStorageNotice: string; // Re-purposed for brief inline notice
  geminiClientNotInitialized: string;
}

export const translations: Record<LanguageCode, TranslationSet> = {
  en: {
    pageTitle: "Smoke & Fire Detection AI",
    appTitle: "Smoke & Fire Detector AI",
    appSubtitle: "Upload an image to detect smoke and fire using Gemini.",
    selectImageFirst: "Please select an image first.",
    unsupportedImageType: "Unsupported image type. Please use JPEG, PNG, or WebP.",
    errorDuringDetection: "An unknown error occurred during detection.",
    analyzingImage: "Analyzing image, please wait...",
    noDetections: "No smoke or fire detected in the image.",
    detectionDetails: "Detection Details:",
    uploadInstructionPrefix: "Click to upload",
    uploadInstructionSuffix: "or drag and drop",
    fileTypes: "PNG, JPG, WEBP (MAX. 5MB)",
    selectedFile: "Selected:",
    detectButton: "Detect Smoke & Fire",
    processingButton: "Processing...",
    uploadToSee: "Upload an image to see it here",
    preparingImage: "Preparing image...",
    analyzingOverlay: "Analyzing...",
    errorHeading: "Error:",
    footerText: "",
    languageEnglish: "English",
    languageVietnamese: "Tiếng Việt",
    smoke: "Smoke",
    fire: "Fire",
    errorLoadingImage: "Error loading image",
    imageDisplayArea: "Image display area with detections",

    // API Key Form Translations
    apiKeyLabel: "Gemini API Key",
    apiKeySetupInstruction: "Set up your Gemini API Key to enable analysis:",
    apiKeyInstructions: "Enter your Google Gemini API Key. Obtain one from Google AI Studio.",
    apiKeyInputPlaceholder: "Enter your Gemini API Key here",
    apiKeySaveButton: "Save & Validate Key",
    apiKeyMissingError: "API Key is required to proceed.",
    apiKeyInvalidError: "Invalid API Key or failed to initialize. Please check your key and try again.",
    apiKeyCannotBeEmpty: "API Key cannot be empty.",
    apiKeySuccess: "API Key saved and validated successfully!",
    apiKeyHowToLinkText: "Get a Gemini API Key",
    apiKeyStorageNotice: "Your API key is stored locally in your browser.",
    geminiClientNotInitialized: "Gemini client not initialized. Please set your API Key.",
  },
  vi: {
    pageTitle: "AI Phát Hiện Khói & Lửa",
    appTitle: "AI Phát Hiện Khói & Lửa",
    appSubtitle: "Tải ảnh lên để phát hiện khói và lửa bằng Gemini Flash.",
    selectImageFirst: "Vui lòng chọn một hình ảnh trước.",
    unsupportedImageType: "Loại hình ảnh không được hỗ trợ. Vui lòng sử dụng JPEG, PNG hoặc WebP.",
    errorDuringDetection: "Đã xảy ra lỗi không xác định trong quá trình phát hiện.",
    analyzingImage: "Đang phân tích hình ảnh, vui lòng đợi...",
    noDetections: "Không phát hiện thấy khói hoặc lửa trong hình ảnh.",
    detectionDetails: "Chi Tiết Phát Hiện:",
    uploadInstructionPrefix: "Nhấp để tải lên",
    uploadInstructionSuffix: "hoặc kéo và thả",
    fileTypes: "PNG, JPG, WEBP (TỐI ĐA 5MB)",
    selectedFile: "Đã chọn:",
    detectButton: "Phát Hiện Khói & Lửa",
    processingButton: "Đang xử lý...",
    uploadToSee: "Tải ảnh lên để xem tại đây",
    preparingImage: "Đang chuẩn bị hình ảnh...",
    analyzingOverlay: "Đang phân tích...",
    errorHeading: "Lỗi:",
    footerText: "",
    languageEnglish: "English",
    languageVietnamese: "Tiếng Việt",
    smoke: "Khói",
    fire: "Lửa",
    errorLoadingImage: "Lỗi tải hình ảnh",
    imageDisplayArea: "Khu vực hiển thị hình ảnh với các phát hiện",

    // API Key Form Translations
    apiKeyLabel: "Gemini API Key",
    apiKeySetupInstruction: "Cài đặt API Key Gemini của bạn để bật tính năng phân tích:",
    apiKeyInstructions: "Nhập API Key Google Gemini của bạn. Bạn có thể lấy key từ Google AI Studio.",
    apiKeyInputPlaceholder: "Nhập API Key Gemini của bạn tại đây",
    apiKeySaveButton: "Lưu & Xác thực Key",
    apiKeyMissingError: "Cần có API Key để tiếp tục.",
    apiKeyInvalidError: "API Key không hợp lệ hoặc không thể khởi tạo. Vui lòng kiểm tra key của bạn và thử lại.",
    apiKeyCannotBeEmpty: "API Key không được để trống.",
    apiKeySuccess: "API Key đã được lưu và xác thực thành công!",
    apiKeyHowToLinkText: "Lấy API Key Gemini",
    apiKeyStorageNotice: "API key của bạn được lưu trữ cục bộ trong trình duyệt.",
    geminiClientNotInitialized: "Ứng dụng Gemini chưa được khởi tạo. Vui lòng cài đặt API Key.",
  }
};

export const GEMINI_API_KEY_LOCAL_STORAGE = 'GEMINI_USER_API_KEY';