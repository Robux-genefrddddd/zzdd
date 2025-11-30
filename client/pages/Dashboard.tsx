import { useEffect, useState, useRef } from "react";
import { Layout } from "@/components/Layout";
import { FileCard } from "@/components/FileCard";
import { ShareModal } from "@/components/ShareModal";
import { useAuth } from "@/lib/authContext";
import {
  uploadFile,
  listUserFiles,
  deleteFile,
  downloadFile,
  FileMetadata,
  formatFileSize,
} from "@/lib/fileUtils";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Upload,
  AlertCircle,
  HardDrive,
  Files,
  Clock,
  ArrowUpRight,
  Plus,
} from "lucide-react";

export default function Dashboard() {
  const { user, userData } = useAuth();
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<FileMetadata | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (user) {
      loadFiles();
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    // Auto-refresh user data periodically or when storage changes
    const interval = setInterval(() => {
      refreshUserData();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [user]);

  const loadFiles = async () => {
    if (!user) return;
    try {
      const userFiles = await listUserFiles(user.uid);
      setFiles(userFiles);
      setError("");
    } catch (err) {
      console.error("Failed to load files:", err);
      setError("Failed to load files");
    }
  };

  const refreshUserData = async () => {
    if (!user) return;
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        // Force parent component to update by calling a refresh
        // The userData will be updated automatically when Firestore changes
        console.log("[Dashboard] User data refreshed");
      }
    } catch (err) {
      console.error("Failed to refresh user data:", err);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || !user) return;

    setLoading(true);
    setError("");

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        setUploadProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
        await uploadFile(user.uid, file);
      }

      await loadFiles();
      await refreshUserData();
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload file");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (!droppedFiles || !user) return;

    setLoading(true);
    setError("");

    try {
      for (let i = 0; i < droppedFiles.length; i++) {
        const file = droppedFiles[i];
        setUploadProgress(Math.round(((i + 1) / droppedFiles.length) * 100));
        await uploadFile(user.uid, file);
      }

      await loadFiles();
      await refreshUserData();
      setUploadProgress(0);
    } catch (err: any) {
      setError(err.message || "Failed to upload file");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (fileId: string) => {
    if (
      !user ||
      !window.confirm("Are you sure you want to delete this file?")
    ) {
      return;
    }

    setLoading(true);
    try {
      const file = files.find((f) => f.id === fileId);
      if (file) {
        await deleteFile(user.uid, fileId, file.storagePath || "");
        await loadFiles();
        await refreshUserData();
      }
    } catch (err) {
      setError("Failed to delete file");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (file: FileMetadata) => {
    if (!user) return;

    try {
      await downloadFile(user.uid, file.storagePath || "", file.name);
    } catch (err) {
      setError("Failed to download file");
      console.error(err);
    }
  };

  const handleShare = (file: FileMetadata) => {
    setSelectedFile(file);
    setShowShareModal(true);
  };

  const storageUsedPercent = userData
    ? Math.round((userData.storageUsed / userData.storageLimit) * 100)
    : 0;

  const recentFiles = files.slice(0, 5);
  const sharedFiles = files.filter((f) => f.isShared);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
          <p className="text-muted-foreground">
            Manage your files and secure storage
          </p>
        </div>

        {/* Stats Grid */}
        {userData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Storage Card */}
            <div className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Storage Used
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {formatFileSize(userData.storageUsed)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    of {formatFileSize(userData.storageLimit)}
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <HardDrive className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(storageUsedPercent, 100)}%` }}
                />
              </div>
            </div>

            {/* Files Count Card */}
            <div className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Total Files
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {files.length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {sharedFiles.length} shared
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Files className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                  style={{
                    width: `${Math.min((sharedFiles.length / files.length) * 100 || 0, 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Last Upload Card */}
            <div className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Last Upload
                  </p>
                  <p className="text-lg font-bold text-foreground mt-1">
                    {recentFiles.length > 0
                      ? recentFiles[0].name.substring(0, 20)
                      : "No uploads"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {recentFiles.length > 0
                      ? new Date(recentFiles[0].uploadedAt).toLocaleDateString()
                      : ""}
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <ArrowUpRight className="w-5 h-5 text-primary" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div
          className={`card p-8 text-center border-2 transition-all duration-300 cursor-pointer ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/30"
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
            <div
              className={`p-4 rounded-lg mb-4 transition-all ${
                isDragging ? "bg-primary/20" : "bg-secondary"
              }`}
            >
              <Upload
                className={`w-8 h-8 transition-colors ${
                  isDragging ? "text-primary" : "text-primary"
                }`}
              />
            </div>
            <p className="text-lg font-semibold text-foreground mb-1">
              {isDragging
                ? "Drop files here"
                : "Drop files here or click to upload"}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              PNG, JPG, PDF, DOC, or any other file up to 5GB
            </p>

            {uploadProgress > 0 && (
              <div className="w-full max-w-xs">
                <div className="h-2 bg-secondary rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {uploadProgress}% complete
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3 animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-destructive">Error</p>
              <p className="text-sm text-destructive/80">{error}</p>
            </div>
          </div>
        )}

        {/* Files Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                Your Files
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {files.length} file{files.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {files.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Files className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-foreground font-medium">No files yet</p>
              <p className="text-muted-foreground text-sm mt-1">
                Upload your first file to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  onDelete={handleDelete}
                  onDownload={handleDownload}
                  onShare={handleShare}
                  loading={loading}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Share Modal */}
      {showShareModal && selectedFile && (
        <ShareModal
          file={selectedFile}
          onClose={() => {
            setShowShareModal(false);
            setSelectedFile(null);
          }}
        />
      )}
    </div>
  );
}
