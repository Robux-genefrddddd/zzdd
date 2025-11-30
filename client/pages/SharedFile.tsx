import { useParams } from "react-router-dom";
import {
  Download,
  AlertCircle,
  FileText,
  Image,
  Archive,
  Music,
  Video,
  File,
  Cloud,
} from "lucide-react";
import { useState, useEffect } from "react";
import { downloadFile, formatFileSize, formatDate } from "@/lib/fileUtils";

interface SharedFileData {
  userId: string;
  fileId: string;
  name: string;
  size: number;
  uploadedAt: string;
  storagePath: string;
  mimeType?: string;
}

function getFileIcon(mimeType: string) {
  if (mimeType?.startsWith("image/")) {
    return Image;
  } else if (mimeType?.startsWith("video/")) {
    return Video;
  } else if (mimeType?.startsWith("audio/")) {
    return Music;
  } else if (
    mimeType?.includes("zip") ||
    mimeType?.includes("rar") ||
    mimeType?.includes("7z")
  ) {
    return Archive;
  } else if (
    mimeType?.includes("pdf") ||
    mimeType?.includes("word") ||
    mimeType?.includes("document")
  ) {
    return FileText;
  }
  return File;
}

export default function SharedFile() {
  const { token } = useParams<{ token: string }>();
  const [file, setFile] = useState<SharedFileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchSharedFile = async () => {
      if (!token) {
        setError("Invalid share link");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("Share link functionality requires backend implementation");
      } catch (err) {
        setError("Failed to load shared file");
      } finally {
        setLoading(false);
      }
    };

    fetchSharedFile();
  }, [token]);

  const handleDownload = async () => {
    if (!file) return;
    setDownloading(true);

    try {
      await downloadFile(file.userId, file.storagePath, file.name);
    } catch (err) {
      setError("Failed to download file");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-border border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs text-muted-foreground font-medium">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  const FileIcon = file ? getFileIcon(file.mimeType || "") : File;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 h-16">
            <div className="inline-flex items-center justify-center w-9 h-9 bg-primary/15 rounded">
              <Cloud className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-sm font-bold text-foreground">CloudVault</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        {error ? (
          <div className="w-full max-w-md">
            <div className="card p-8">
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-destructive/10 rounded">
                  <AlertCircle className="w-6 h-6 text-destructive" />
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-sm font-bold text-foreground mb-2">
                  Unable to Load File
                </h2>
                <p className="text-xs text-muted-foreground">{error}</p>
              </div>
            </div>
          </div>
        ) : file ? (
          <div className="w-full max-w-md">
            <div className="card p-8">
              {/* File Icon */}
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-primary/10 rounded">
                  <FileIcon className="w-6 h-6 text-primary" />
                </div>
              </div>

              {/* File Name */}
              <div className="text-center mb-8 space-y-2">
                <h2 className="text-lg font-bold text-foreground break-all">
                  {file.name}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Shared via CloudVault
                </p>
              </div>

              {/* File Details */}
              <div className="bg-muted/20 border border-border/50 rounded p-4 mb-8 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Size</span>
                  <span className="text-foreground font-medium">
                    {formatFileSize(file.size)}
                  </span>
                </div>
                <div className="border-t border-border/50" />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Uploaded</span>
                  <span className="text-foreground font-medium">
                    {formatDate(file.uploadedAt)}
                  </span>
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-all duration-200 active:scale-95 disabled:opacity-50 mb-4"
              >
                <Download className="w-4 h-4" />
                {downloading ? "Downloading..." : "Download"}
              </button>

              {/* Info Box */}
              <div className="p-3 bg-primary/10 border border-primary/30 rounded text-center">
                <p className="text-xs text-muted-foreground">
                  Download to keep a copy
                </p>
              </div>
            </div>

            {/* Footer Message */}
            <div className="text-center mt-8">
              <p className="text-xs text-muted-foreground">
                Need to share files?{" "}
                <a
                  href="/"
                  className="text-primary font-medium hover:text-primary/80 transition-colors"
                >
                  Sign up for CloudVault
                </a>
              </p>
            </div>
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-muted-foreground">
          <p>© 2024 CloudVault</p>
        </div>
      </footer>
    </div>
  );
}
