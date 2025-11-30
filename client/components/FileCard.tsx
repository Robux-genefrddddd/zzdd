import {
  File,
  Download,
  Trash2,
  Share2,
  MoreVertical,
  FileText,
  Image,
  Archive,
  Music,
  Video,
} from "lucide-react";
import { FileMetadata, formatFileSize, formatDate } from "@/lib/fileUtils";
import { useState } from "react";

interface FileCardProps {
  file: FileMetadata;
  onDelete: (fileId: string) => void;
  onDownload: (file: FileMetadata) => void;
  onShare: (file: FileMetadata) => void;
  loading?: boolean;
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

export function FileCard({
  file,
  onDelete,
  onDownload,
  onShare,
  loading = false,
}: FileCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const FileIcon = getFileIcon(file.mimeType);

  return (
    <div className="group card rounded-xl border border-border hover:border-primary/30 transition-all duration-300 overflow-hidden">
      <div className="p-5 space-y-4">
        {/* Header with Icon and Menu */}
        <div className="flex items-start justify-between gap-3">
          <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0 group-hover:bg-primary/15 transition-colors">
            <FileIcon className="w-5 h-5 text-primary" />
          </div>

          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-muted transition-all duration-200"
              disabled={loading}
            >
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Context Menu */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 bg-card border border-border rounded-lg shadow-xl min-w-max overflow-hidden z-10 animate-fadeIn">
                <button
                  onClick={() => {
                    onDownload(file);
                    setShowMenu(false);
                  }}
                  disabled={loading}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-muted transition-colors flex items-center gap-3 text-foreground disabled:opacity-50 whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={() => {
                    onShare(file);
                    setShowMenu(false);
                  }}
                  disabled={loading}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-muted transition-colors flex items-center gap-3 text-foreground disabled:opacity-50 whitespace-nowrap"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <div className="border-t border-border" />
                <button
                  onClick={() => {
                    onDelete(file.id);
                    setShowMenu(false);
                  }}
                  disabled={loading}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-destructive/10 transition-colors flex items-center gap-3 text-destructive disabled:opacity-50 whitespace-nowrap"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* File Info */}
        <div className="space-y-1.5 min-w-0">
          <h3 className="font-semibold text-foreground truncate text-sm leading-snug">
            {file.name}
          </h3>
          <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
            <span>{formatFileSize(file.size)}</span>
            <span className="text-muted-foreground/40">•</span>
            <span>{formatDate(file.uploadedAt)}</span>
          </div>
        </div>

        {/* Share Badge */}
        {file.isShared && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-semibold">
            <Share2 className="w-3 h-3" />
            Shared
          </div>
        )}

        {/* Action Buttons (mobile) */}
        <div className="sm:hidden flex gap-2">
          <button
            onClick={() => onDownload(file)}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50"
          >
            <Download className="w-3 h-3" />
            Download
          </button>
          <button
            onClick={() => onShare(file)}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50"
          >
            <Share2 className="w-3 h-3" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
