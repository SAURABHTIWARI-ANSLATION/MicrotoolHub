import { Progress } from './ui/progress';

interface ProcessingProgressProps {
  progress: number;
}

export const ProcessingProgress = ({ progress }: ProcessingProgressProps) => {
  const getStatusMessage = (progress: number): string => {
    if (progress < 30) return 'Loading AI model...';
    if (progress < 50) return 'Analyzing image...';
    if (progress < 80) return 'Removing background...';
    if (progress < 95) return 'Finalizing...';
    return 'Complete!';
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 animate-slide-up">
      <div className="text-center">
        <div className="relative inline-block mb-4">
          <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">{progress}%</span>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-2">{getStatusMessage(progress)}</h3>
        <p className="text-muted-foreground text-sm">
          Please wait while we process your image
        </p>
      </div>
      
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Started</span>
          <span>Processing</span>
          <span>Complete</span>
        </div>
      </div>
    </div>
  );
};
