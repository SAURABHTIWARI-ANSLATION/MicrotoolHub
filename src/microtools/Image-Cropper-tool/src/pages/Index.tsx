import { ImageCropper } from "../components/ImageCropper";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-12 animate-fade-in">
          <div className="inline-block">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Image Cropper
            </h1>
            <div className="h-1 bg-gradient-primary rounded-full"></div>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Crop your images to the perfect size with ease. Supports various aspect ratios and zoom controls.
          </p>
        </div>

        <ImageCropper />
      </div>
    </div>
  );
};

export default Index;