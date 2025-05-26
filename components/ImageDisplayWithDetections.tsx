
import React, { useRef, useEffect } from 'react';
import type { Detection } from '../types';
import { DetectionType } from '../types';
import type { TranslationSet } from '../localization/translations';

interface ImageDisplayWithDetectionsProps {
  imageUrl: string | null;
  detections: Detection[] | null;
  isLoading: boolean;
  translations: TranslationSet;
}

export const ImageDisplayWithDetections: React.FC<ImageDisplayWithDetectionsProps> = ({ imageUrl, detections, isLoading, translations }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!imageUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const image = new Image();
    image.crossOrigin = "anonymous"; 
    image.src = imageUrl;

    image.onload = () => {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      if (detections) {
        detections.forEach(detection => {
          const { x1, y1, x2, y2 } = detection.boundingBox;
          const rectX = x1 * canvas.width;
          const rectY = y1 * canvas.height;
          const rectWidth = (x2 - x1) * canvas.width;
          const rectHeight = (y2 - y1) * canvas.height;

          ctx.beginPath();
          ctx.rect(rectX, rectY, rectWidth, rectHeight);
          
          let strokeColor = 'yellow'; // Default for smoke
          let labelText = translations.smoke.toUpperCase();
          if (detection.type === DetectionType.FIRE) {
            strokeColor = 'red';
            labelText = translations.fire.toUpperCase();
          }
          
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = Math.max(2, Math.min(canvas.width, canvas.height) * 0.005); 
          ctx.stroke();

          ctx.fillStyle = strokeColor;
          ctx.font = `${Math.max(12, canvas.height * 0.02)}px Arial`; 
          // Offset text slightly for better visibility inside or near the box border
          const textX = rectX + 5;
          const textY = rectY + Math.max(15, canvas.height * 0.025);
          ctx.fillText(labelText, textX < canvas.width - 50 ? textX : rectX - 50, textY < canvas.height - 5 ? textY : rectY - 5 );
        });
      }
    };
    
    image.onerror = () => {
        console.error("Failed to load image for canvas display.");
        ctx.clearRect(0,0,canvas.width,canvas.height); 
        ctx.fillStyle = 'red';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(translations.errorLoadingImage, canvas.width / 2, canvas.height / 2);
    }

  }, [imageUrl, detections, translations]);

  if (!imageUrl && !isLoading) {
    return (
      <div className="flex items-center justify-center h-64 sm:h-96 bg-gray-700/30 border-2 border-dashed border-gray-600 rounded-lg text-gray-500">
        <p className="text-lg">{translations.uploadToSee}</p>
      </div>
    );
  }
  
  if (isLoading && !imageUrl) { 
    return (
      <div className="flex items-center justify-center h-64 sm:h-96 bg-gray-700/30 border-2 border-dashed border-gray-600 rounded-lg text-gray-500">
        <p className="text-lg">{translations.preparingImage}</p>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video bg-gray-700/30 rounded-lg overflow-hidden shadow-inner relative">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full object-contain"
        aria-label={translations.imageDisplayArea}
      />
      {imageUrl && isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <p className="text-white text-xl">{translations.analyzingOverlay}</p>
        </div>
      )}
    </div>
  );
};
