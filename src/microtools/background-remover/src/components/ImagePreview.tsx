import { useState } from 'react';
import { Download, Palette, X } from 'lucide-react';
import { Button } from './ui/button';
import { applyBackgroundColor } from '../lib/backgroundRemoval';
import { toast } from 'sonner';

interface ImagePreviewProps {
  originalImage: string;
  processedImage: string | null;
  isProcessing: boolean;
  onReset: () => void;
}

const BACKGROUND_COLORS = [
  { name: 'Transparent', value: 'transparent' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Black', value: '#000000' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Pink', value: '#EC4899' },
];

export const ImagePreview = ({
  originalImage,
  processedImage,
  isProcessing,
  onReset,
}: ImagePreviewProps) => {
  const [showComparison, setShowComparison] = useState(false);
  const [selectedBg, setSelectedBg] = useState('transparent');
  const [displayImage, setDisplayImage] = useState<string | null>(null);
  const [isApplyingBg, setIsApplyingBg] = useState(false);

  const handleDownload = async () => {
    if (!processedImage) return;

    try {
      const imageToDownload = displayImage || processedImage;
      const link = document.createElement('a');
      link.href = imageToDownload;
      link.download = `background-removed-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download image');
    }
  };

  const handleBackgroundChange = async (color: string) => {
    if (!processedImage || color === selectedBg) return;

    setSelectedBg(color);

    if (color === 'transparent') {
      setDisplayImage(null);
      return;
    }

    setIsApplyingBg(true);
    try {
      // Convert data URL to blob
      const response = await fetch(processedImage);
      const blob = await response.blob();
      
      // Apply background color
      const newBlob = await applyBackgroundColor(blob, color);
      const newUrl = URL.createObjectURL(newBlob);
      setDisplayImage(newUrl);
      toast.success(`Background changed to ${BACKGROUND_COLORS.find(c => c.value === color)?.name}`);
    } catch (error) {
      console.error('Error applying background:', error);
      toast.error('Failed to apply background color');
    } finally {
      setIsApplyingBg(false);
    }
  };

  return (
    <div className="w-full space-y-6 animate-slide-up">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowComparison(!showComparison)}
            disabled={!processedImage || isProcessing}
            className="bg-card/50 backdrop-blur-sm"
          >
            {showComparison ? 'Show Result' : 'Compare'}
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="bg-card/50 backdrop-blur-sm"
          >
            <X className="w-4 h-4 mr-2" />
            New Image
          </Button>
          
          <Button
            onClick={handleDownload}
            disabled={!processedImage || isProcessing}
            className="bg-gradient-primary shadow-glow hover:shadow-glow/80"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Image Display */}
      <div className="relative rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm border border-border shadow-card">
        <div className="aspect-video w-full relative bg-[repeating-conic-gradient(#80808020_0%_25%,transparent_0%_50%)] bg-[length:20px_20px]">
          {showComparison ? (
            <div className="grid grid-cols-2 h-full">
              <div className="relative border-r border-border">
                <img
                  src={originalImage}
                  alt="Original"
                  className="w-full h-full object-contain p-4"
                />
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white">
                  Original
                </div>
              </div>
              <div className="relative">
                <img
                  src={displayImage || processedImage || originalImage}
                  alt="Processed"
                  className="w-full h-full object-contain p-4"
                />
                <div className="absolute bottom-4 right-4 bg-primary/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-primary-foreground">
                  Processed
                </div>
              </div>
            </div>
          ) : (
            <img
              src={displayImage || processedImage || originalImage}
              alt="Preview"
              className="w-full h-full object-contain p-4"
            />
          )}
          
          {isProcessing && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-foreground font-medium">Processing your image...</p>
                <p className="text-muted-foreground text-sm mt-2">This may take a moment</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Background Color Selector */}
      {processedImage && !isProcessing && (
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Background Color</h3>
          </div>
          
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {BACKGROUND_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => handleBackgroundChange(color.value)}
                disabled={isApplyingBg}
                className={`
                  group relative aspect-square rounded-xl transition-all duration-200
                  ${selectedBg === color.value 
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110' 
                    : 'hover:scale-105'
                  }
                  ${isApplyingBg ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                style={{
                  backgroundColor: color.value === 'transparent' ? 'transparent' : color.value,
                  backgroundImage: color.value === 'transparent' 
                    ? 'repeating-conic-gradient(#80808040 0% 25%, transparent 0% 50%)'
                    : 'none',
                  backgroundSize: '10px 10px',
                }}
                title={color.name}
              >
                {color.value === 'transparent' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                  {color.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
