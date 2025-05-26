
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
    footerText: "AI Vision App. Powered by Gemini.",
    languageEnglish: "English",
    languageVietnamese: "Tiếng Việt",
    smoke: "Smoke",
    fire: "Fire",
    errorLoadingImage: "Error loading image",
    imageDisplayArea: "Image display area with detections",
  },
  vi: {
    pageTitle: "AI Phát Hiện Khói & Lửa",
    appTitle: "AI Phát Hiện Khói & Lửa",
    appSubtitle: "Tải ảnh lên để phát hiện khói và lửa bằng Gemini.",
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
    footerText: "Ứng dụng Thị giác AI. Cung cấp bởi Gemini.",
    languageEnglish: "English",
    languageVietnamese: "Tiếng Việt",
    smoke: "Khói",
    fire: "Lửa",
    errorLoadingImage: "Lỗi tải hình ảnh",
    imageDisplayArea: "Khu vực hiển thị hình ảnh với các phát hiện",
  }
};
