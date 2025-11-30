import { useEffect, useState, useRef } from "react";
import { Layout } from "@/components/Layout";
import { FileTable } from "@/components/FileTable";
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

    const interval = setInterval(() => {
      refreshUserData();
    }, 5000);

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
        setUploadProgress(
          Math.round(((i + 1) / droppedFiles.length) * 100)
        );
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

  const sharedFiles = files.filter((f) => f.isShared);

  return (
    <Layout>
      <div className="h-full flex flex-col bg-background">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Files</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage your cloud storage
                </p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-all duration-200 active:scale-95 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Upload
              </button>
            </div>

            {/* Mobile Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="sm:hidden w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Upload Files
            </button>

            {/* Stats Grid */}
            {userData && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Storage Card */}
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                        Storage Used
                      </p>
                      <p className="text-2xl font-bold text-foreground mt-2">
                        {formatFileSize(userData.storageUsed)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        of {formatFileSize(userData.storageLimit)}
                      </p>
                    </div>
                    <HardDrive className="w-5 h-5 text-muted-foreground/40 flex-shrink-0" />
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(storageUsedPercent, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Files Count Card */}
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                        Total Files
                      </p>
                      <p className="text-2xl font-bold text-foreground mt-2">
                        {files.length}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {sharedFiles.length} shared
                      </p>
                    </div>
                    <Files className="w-5 h-5 text-muted-foreground/40 flex-shrink-0" />
                  </div>
                </div>

                {/* Upload Status Card */}
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                        Status
                      </p>
                      <p className="text-2xl font-bold text-foreground mt-2">
                        {loading ? "Uploading..." : "Ready"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {loading ? `${uploadProgress}%` : "No uploads"}
                      </p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-muted-foreground/40 flex-shrink-0" />
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3 animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-destructive">
                    Error
                  </p>
                  <p className="text-sm text-destructive/80">{error}</p>
                </div>
              </div>
            )}

            {/* Upload Area */}
            <div
              className={`card p-12 text-center border-2 transition-all duration-300 cursor-pointer ${
                isDragging
                  ? "border-primary/50 bg-primary/5"
                  : "border-border hover:border-border/80"
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
                  className={`p-3 rounded-lg mb-4 transition-all ${
                    isDragging ? "bg-primary/20" : "bg-muted/40"
                  }`}
                >
                  <Upload
                    className={`w-6 h-6 transition-colors ${
                      isDragging ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  {isDragging
                    ? "Drop your files here"
                    : "Drag and drop files or click to upload"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Any file type, up to 5GB
                </p>

                {uploadProgress > 0 && (
                  <div className="w-full max-w-xs mt-6">
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-2">
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

            {/* Files Table */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Files
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  {files.length} file{files.length !== 1 ? "s" : ""}
                </p>
              </div>

              <FileTable
                files={files}
                onDelete={handleDelete}
                onDownload={handleDownload}
                onShare={handleShare}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>

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
    </Layout>
  );
}
