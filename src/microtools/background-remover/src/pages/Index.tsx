import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { ImageUploader } from '../components/ImageUploader';
import { ImagePreview } from '../components/ImagePreview';
import { ProcessingProgress } from '../components/ProcessingProgress';
import { removeBackground, loadImage } from '../lib/backgroundRemoval';
import { toast } from 'sonner';

const Index = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleImageSelect = async (file: File) => {
    try {
      // Load and display original image
      const img = await loadImage(file);
      const reader = new FileReader();
      
      reader.onload = (e) => {
        setOriginalImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Start background removal process
      setIsProcessing(true);
      setProgress(0);
      toast.info('Starting background removal...');

      const resultBlob = await removeBackground(img, (progressValue) => {
        setProgress(progressValue);
      });

      // Convert blob to data URL for display
      const resultUrl = URL.createObjectURL(resultBlob);
      setProcessedImage(resultUrl);
      
      toast.success('Background removed successfully!');
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setProgress(0);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border backdrop-blur-lg bg-background/80 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-lg blur-lg opacity-75" />
              <div className="relative bg-card rounded-lg p-2">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                AI Background Remover
              </h1>
              <p className="text-sm text-muted-foreground">
                Remove image backgrounds instantly with AI
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Hero Section */}
          {!originalImage && (
            <div className="text-center space-y-4 mb-12 animate-slide-up">
              <h2 className="text-4xl md:text-5xl font-bold">
                Remove Background from
                <span className="block bg-gradient-primary bg-clip-text text-transparent">
                  Any Image in Seconds
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Powered by advanced AI technology, our tool automatically detects and removes backgrounds with pixel-perfect precision. No signup required.
              </p>
            </div>
          )}

          {/* Upload or Preview Area */}
          {!originalImage ? (
            <ImageUploader 
              onImageSelect={handleImageSelect} 
              disabled={isProcessing}
            />
          ) : (
            <>
              {isProcessing && progress < 100 ? (
                <ProcessingProgress progress={progress} />
              ) : (
                <ImagePreview
                  originalImage={originalImage}
                  processedImage={processedImage}
                  isProcessing={isProcessing}
                  onReset={handleReset}
                />
              )}
            </>
          )}

          {/* Features Section */}
          {!originalImage && (
            <div className="grid md:grid-cols-3 gap-6 pt-8 animate-slide-up">
              {[
                {
                  title: 'AI-Powered',
                  description: 'Advanced machine learning for accurate background detection',
                  icon: '🤖',
                },
                {
                  title: 'Privacy First',
                  description: 'All processing happens in your browser. Your images never leave your device',
                  icon: '🔒',
                },
                {
                  title: 'Free & Fast',
                  description: 'No registration, no limits. Process images in seconds',
                  icon: '⚡',
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-6 hover:shadow-card transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border backdrop-blur-lg bg-background/80 py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>Built with ❤️ using React, TypeScript, and Hugging Face Transformers</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
