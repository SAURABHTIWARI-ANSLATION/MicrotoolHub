import { useState } from "react";
import { Upload, X, AlertCircle, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB in bytes

interface FileData {
  id: string;
  file: File;
  name: string;
  type: string;
  size: number;
  isOverLimit: boolean;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const FileSizeChecker = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = (fileList: FileList) => {
    const newFiles: FileData[] = Array.from(fileList).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      type: file.type || "Unknown",
      size: file.size,
      isOverLimit: file.size > MAX_FILE_SIZE,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const clearAll = () => {
    setFiles([]);
  };

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const hasOverLimitFiles = files.some((file) => file.isOverLimit);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center
          transition-all duration-300 hover:border-primary/50 hover:shadow-soft
          ${isDragging ? "border-primary bg-gradient-primary/5 scale-[1.02] shadow-glow" : "border-border bg-card"}
        `}
      >
        <input
          type="file"
          multiple
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          id="file-input"
        />
        <div className="flex flex-col items-center gap-4">
          <div className="p-6 rounded-full bg-gradient-primary/10 shadow-elegant">
            <Upload className="w-12 h-12 text-primary" strokeWidth={2.5} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">
              {isDragging ? "Drop files here" : "Upload Files"}
            </h3>
            <p className="text-muted-foreground">
              Drag & drop files or click to browse
            </p>
            <p className="text-sm text-muted-foreground">
              Max file size: <span className="font-medium text-foreground">100 MB</span>
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      {files.length > 0 && (
        <div className="flex items-center justify-between p-5 rounded-xl bg-gradient-soft border border-primary/20 shadow-soft">
          <div className="space-y-1">
            <p className="text-sm font-semibold">
              Total Files: <span className="text-primary text-lg">{files.length}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Total Size: <span className="font-semibold text-foreground">{formatFileSize(totalSize)}</span>
            </p>
          </div>
          <Button variant="gradient" size="sm" onClick={clearAll}>
            Clear All
          </Button>
        </div>
      )}

      {/* Warning for oversized files */}
      {hasOverLimitFiles && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Some files exceed the 100 MB limit and cannot be processed.
          </AlertDescription>
        </Alert>
      )}

      {/* Files List */}
      {files.length > 0 && (
        <div className="space-y-3">
          {files.map((fileData) => (
            <div
              key={fileData.id}
              className={`
                p-5 rounded-xl border transition-all duration-300
                ${
                  fileData.isOverLimit
                    ? "border-destructive/40 bg-destructive/5"
                    : "border-border bg-card hover:shadow-elegant hover:border-primary/30"
                }
              `}
            >
              <div className="flex items-start gap-4">
                <div className={`
                  p-3 rounded-xl flex-shrink-0 transition-all
                  ${fileData.isOverLimit ? "bg-destructive/10" : "bg-gradient-primary/15 shadow-soft"}
                `}>
                  <FileText className={`w-6 h-6 ${fileData.isOverLimit ? "text-destructive" : "text-primary"}`} strokeWidth={2.5} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{fileData.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {fileData.type}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(fileData.id)}
                      className="flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`
                      text-sm font-medium
                      ${fileData.isOverLimit ? "text-destructive" : "text-foreground"}
                    `}>
                      {formatFileSize(fileData.size)}
                    </span>
                    {fileData.isOverLimit ? (
                      <span className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="w-3 h-3" />
                        Exceeds 100 MB limit
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-primary">
                        <CheckCircle className="w-3 h-3" />
                        Valid
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {files.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No files uploaded yet. Drop files above to get started.</p>
        </div>
      )}
    </div>
  );
};
