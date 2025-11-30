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
    <div className="card-interactive group p-4 transition-all duration-300">
      <div className="flex items-start gap-4">
        {/* File Icon */}
        <div className="p-2.5 bg-secondary rounded-lg flex-shrink-0 group-hover:bg-primary/10 transition-colors">
          <FileIcon className="w-5 h-5 text-primary" />
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground truncate text-sm leading-snug">
            {file.name}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-xs text-muted-foreground">
              {formatFileSize(file.size)}
            </p>
            <span className="text-xs text-muted-foreground/40">•</span>
            <p className="text-xs text-muted-foreground">
              {formatDate(file.uploadedAt)}
            </p>
          </div>

          {/* Share Status */}
          {file.isShared && (
            <div className="mt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M12.586 4.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM9.414 9.414a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM3 3a1 1 0 000 2h2.197A7 7 0 1015.803 5H14a1 1 0 100-2h3V0h-3a1 1 0 000 2h.197A9 9 0 003 3z" />
                </svg>
                Shared
              </span>
            </div>
          )}
        </div>

        {/* Menu Button */}
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
            <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-xl min-w-max overflow-hidden z-10 animate-fadeIn">
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
    </div>
  );
}
