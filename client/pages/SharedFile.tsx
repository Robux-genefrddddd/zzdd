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
  Calendar,
  Cloud,
  HardDrive,
} from "lucide-react";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
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
          <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">Loading file...</p>
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
            <div className="inline-flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-foreground">CloudVault</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        {error ? (
          <div className="w-full max-w-md">
            <div className="card p-8 border-destructive/20 bg-destructive/5">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-destructive/10 rounded-lg">
                  <AlertCircle className="w-8 h-8 text-destructive" />
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-lg font-bold text-foreground mb-2">
                  Unable to Load File
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  {error}
                </p>

                {error.includes("backend") && (
                  <div className="p-4 bg-background/50 border border-border rounded-lg text-xs text-muted-foreground">
                    This feature requires backend endpoint implementation for
                    secure token resolution.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : file ? (
          <div className="w-full max-w-md">
            <div className="card p-8">
              {/* File Icon */}
              <div className="flex justify-center mb-8">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <FileIcon className="w-12 h-12 text-primary" />
                </div>
              </div>

              {/* File Name */}
              <div className="text-center mb-8 space-y-2">
                <h2 className="text-2xl font-bold text-foreground break-all">
                  {file.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Shared with you via CloudVault
                </p>
              </div>

              {/* File Details */}
              <div className="bg-secondary/30 border border-border rounded-lg p-6 mb-8 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Size</span>
                  <span className="text-sm font-semibold text-foreground">
                    {formatFileSize(file.size)}
                  </span>
                </div>
                <div className="border-t border-border/50" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Uploaded</span>
                  <span className="text-sm font-semibold text-foreground">
                    {formatDate(file.uploadedAt)}
                  </span>
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                <Download className="w-5 h-5" />
                {downloading ? "Downloading..." : "Download File"}
              </button>

              {/* Info Box */}
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg text-center">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This file was securely shared with you. Download it now to
                  keep a copy.
                </p>
              </div>
            </div>

            {/* Footer Message */}
            <div className="text-center mt-8">
              <p className="text-sm text-muted-foreground">
                Need to share files?{" "}
                <a
                  href="/"
                  className="text-primary font-semibold hover:text-primary/80 transition-colors"
                >
                  Sign up for CloudVault
                </a>
              </p>
            </div>
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-muted-foreground">
          <p>© 2024 CloudVault. Secure file sharing for everyone.</p>
        </div>
      </footer>
    </div>
  );
}
