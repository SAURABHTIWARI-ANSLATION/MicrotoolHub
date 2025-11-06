import { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  disabled?: boolean;
}

export const ImageUploader = ({ onImageSelect, disabled }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a PNG, JPG, or WEBP image');
      return false;
    }

    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB');
      return false;
    }

    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));

    if (imageFile && validateFile(imageFile)) {
      onImageSelect(imageFile);
    }
  }, [onImageSelect, disabled]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      onImageSelect(file);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  }, [onImageSelect]);

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300
        ${isDragging 
          ? 'border-primary bg-primary/10 scale-105' 
          : 'border-border bg-card/50 backdrop-blur-sm hover:border-primary/50'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={handleFileInput}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        id="file-upload"
      />
      
      <label
        htmlFor="file-upload"
        className={`flex flex-col items-center justify-center p-12 md:p-16 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-primary rounded-full blur-xl opacity-50 animate-pulse-glow" />
          <div className="relative bg-card rounded-full p-6 shadow-glow">
            {isDragging ? (
              <ImageIcon className="w-12 h-12 text-primary animate-bounce" />
            ) : (
              <Upload className="w-12 h-12 text-primary" />
            )}
          </div>
        </div>
        
        <h3 className="text-2xl font-bold mb-2 text-foreground">
          {isDragging ? 'Drop your image here' : 'Upload an image'}
        </h3>
        
        <p className="text-muted-foreground text-center max-w-md">
          Drag & drop your image here, or click to browse
        </p>
        
        <p className="text-sm text-muted-foreground mt-4">
          Supports PNG, JPG, WEBP (max 10MB)
        </p>
      </label>
    </div>
  );
};
