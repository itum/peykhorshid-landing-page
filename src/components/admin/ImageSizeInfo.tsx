import React from 'react';
import { Info } from 'lucide-react';

interface ImageSizeInfoProps {
  recommendedSize: string;
  description?: string;
  className?: string;
}

const ImageSizeInfo: React.FC<ImageSizeInfoProps> = ({ 
  recommendedSize, 
  description = "سایز پیشنهادی",
  className = ""
}) => {
  return (
    <div className={`flex items-center gap-2 text-sm text-gray-600 ${className}`}>
      <Info className="h-4 w-4 text-blue-500" />
      <span className="font-medium">{description}:</span>
      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-mono text-xs">
        {recommendedSize}
      </span>
    </div>
  );
};

export default ImageSizeInfo;
