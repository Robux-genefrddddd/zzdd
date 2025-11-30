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
  User,
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
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) {
    return Image;
  } else if (mimeType.startsWith("video/")) {
    return Video;
  } else if (mimeType.startsWith("audio/")) {
    return Music;
  } else if (
    mimeType.includes("zip") ||
    mimeType.includes("rar") ||
    mimeType.includes("7z")
  ) {
    return Archive;
  } else if (
    mimeType.includes("pdf") ||
    mimeType.includes("word") ||
    mimeType.includes("document")
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
          <p className="text-muted-foreground font-medium">
            Loading file...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 h-16">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg">
              <svg
                className="w-5 h-5 text-primary-foreground"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-foreground">CloudVault</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground">Shared File</h2>
          <p className="text-muted-foreground mt-2">
            Download the file shared with you
          </p>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-8 p-6 bg-destructive/10 border border-destructive/20 rounded-lg animate-fadeIn">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-destructive">
                  Unable to load file
                </p>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
                {error.includes("backend") && (
                  <p className="text-xs text-muted-foreground mt-2">
                    This feature requires backend endpoint implementation for
                    secure token resolution.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {file && (
          <div className="max-w-md mx-auto">
            <div className="card p-8">
              {/* File Icon */}
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl">
                  <File className="w-12 h-12 text-primary" />
                </div>
              </div>

              {/* File Info */}
              <div className="text-center mb-8">
                <h3 className="text-lg font-semibold text-foreground break-all mb-3">
                  {file.name}
                </h3>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    {formatFileSize(file.size)}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {formatDate(file.uploadedAt)}
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="btn-primary w-full flex items-center justify-center gap-2 mb-4"
              >
                <Download className="w-4 h-4" />
                {downloading ? "Downloading..." : "Download File"}
              </button>

              {/* Info Box */}
              <div className="p-4 bg-secondary/30 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground text-center">
                  This file was shared with you. You can download it once by
                  clicking the button above.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
