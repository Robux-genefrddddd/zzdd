import { useEffect, useState, useRef } from "react";
import { Header } from "@/components/Header";
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
import { Upload, AlertCircle } from "lucide-react";

export default function Dashboard() {
  const { user, userData } = useAuth();
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<FileMetadata | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      loadFiles();
    }
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

  const handleDelete = async (fileId: string) => {
    if (!user || !window.confirm("Are you sure you want to delete this file?")) {
      return;
    }

    setLoading(true);
    try {
      const file = files.find((f) => f.id === fileId);
      if (file) {
        await deleteFile(user.uid, fileId, file.storagePath || "");
        await loadFiles();
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
      await downloadFile(
        user.uid,
        file.storagePath || "",
        file.name
      );
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Welcome back
          </h2>
          <p className="text-muted-foreground">
            Manage your files and secure storage
          </p>
        </div>

        {/* Storage Usage */}
        {userData && (
          <div className="card-base p-6 mb-8">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-foreground">Storage used</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(userData.storageUsed)} /{" "}
                  {formatFileSize(userData.storageLimit)}
                </p>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all"
                  style={{ width: `${Math.min(storageUsedPercent, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div className="card-base p-8 mb-8 text-center border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
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
            <div className="p-3 bg-secondary rounded-lg mb-4">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <p className="text-lg font-medium text-foreground mb-1">
              Drop files here or click to upload
            </p>
            <p className="text-sm text-muted-foreground">
              PNG, JPG, PDF, DOC, or any other file up to 5GB
            </p>

            {uploadProgress > 0 && (
              <div className="mt-4 w-full max-w-xs">
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {uploadProgress}% complete
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">Error</p>
              <p className="text-sm text-destructive/80">{error}</p>
            </div>
          </div>
        )}

        {/* Files Section */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Your Files ({files.length})
          </h3>

          {files.length === 0 ? (
            <div className="card-base p-12 text-center">
              <p className="text-muted-foreground">No files yet. Upload your first file to get started.</p>
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
