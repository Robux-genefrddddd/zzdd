import { useState, useRef } from "react";
import { X, Upload, AlertCircle, CheckCircle } from "lucide-react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[], options: UploadOptions) => Promise<void>;
  loading?: boolean;
}

interface UploadOptions {
  isPublic: boolean;
  allowSharing: boolean;
  expiryDays?: number | null;
}

export function UploadModal({
  isOpen,
  onClose,
  onUpload,
  loading = false,
}: UploadModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [allowSharing, setAllowSharing] = useState(true);
  const [expiryDays, setExpiryDays] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (files.length === 0) {
      setError("Please select at least one file");
      return;
    }

    try {
      await onUpload(files, {
        isPublic,
        allowSharing,
        expiryDays,
      });
      setFiles([]);
      onClose();
    } catch (err: any) {
      setError(err.message || "Upload failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50 sticky top-0 bg-card/95 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Upload className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground">Upload Files</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-muted/40 transition-colors text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Drop Zone */}
          <div
            className={`border-2 rounded-lg p-8 text-center transition-all duration-300 ${
              isDragging
                ? "border-primary/50 bg-primary/5"
                : "border-dashed border-border/50 hover:border-border"
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              disabled={loading}
              className="hidden"
            />

            <div className="flex flex-col items-center">
              <div className="p-2.5 rounded-lg mb-3 bg-muted/30">
                <Upload className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                {isDragging
                  ? "Drop files here"
                  : "Drag files here or click to browse"}
              </p>
              <p className="text-xs text-muted-foreground">
                Any file type, up to 5GB each
              </p>
            </div>
          </div>

          {/* Files List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Selected files ({files.length})
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/20 border border-border/50 rounded"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="ml-3 p-1 rounded hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Options Section */}
          <div className="space-y-4 pt-4 border-t border-border/50">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Options
            </p>

            {/* Sharing option */}
            <label className="flex items-start gap-3 p-3 rounded border border-border/50 hover:bg-muted/20 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={allowSharing}
                onChange={(e) => setAllowSharing(e.target.checked)}
                className="w-4 h-4 mt-0.5"
              />
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground">
                  Allow sharing
                </p>
                <p className="text-xs text-muted-foreground">
                  Others can create share links
                </p>
              </div>
            </label>

            {/* Privacy option */}
            <label className="flex items-start gap-3 p-3 rounded border border-border/50 hover:bg-muted/20 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 mt-0.5"
              />
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground">
                  Public files
                </p>
                <p className="text-xs text-muted-foreground">
                  Visible to anyone with link
                </p>
              </div>
            </label>

            {/* Expiry option */}
            {isPublic && (
              <div className="p-3 rounded border border-border/50 bg-muted/20">
                <label className="block text-xs font-medium text-foreground mb-2">
                  Expiry (days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={expiryDays || ""}
                  onChange={(e) =>
                    setExpiryDays(e.target.value ? parseInt(e.target.value) : null)
                  }
                  placeholder="Optional"
                  className="input-field text-xs"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Leave empty for no expiry
                </p>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 bg-destructive/10 border border-destructive/30 rounded flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-xs text-destructive">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border/50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-md font-medium hover:bg-secondary/80 transition-all duration-200 active:scale-95 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || files.length === 0}
              className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-all duration-200 active:scale-95 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {loading ? "Uploading..." : `Upload (${files.length})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
