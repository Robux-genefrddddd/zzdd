import { File, Download, Trash2, Share2, MoreVertical } from "lucide-react";
import { FileMetadata, formatFileSize, formatDate } from "@/lib/fileUtils";
import { useState } from "react";

interface FileCardProps {
  file: FileMetadata;
  onDelete: (fileId: string) => void;
  onDownload: (file: FileMetadata) => void;
  onShare: (file: FileMetadata) => void;
  loading?: boolean;
}

export function FileCard({
  file,
  onDelete,
  onDownload,
  onShare,
  loading = false,
}: FileCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="card-base p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2 bg-secondary rounded-lg">
            <File className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate text-sm">
              {file.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-secondary rounded transition-colors"
            disabled={loading}
          >
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-10 min-w-max">
              <button
                onClick={() => {
                  onDownload(file);
                  setShowMenu(false);
                }}
                disabled={loading}
                className="w-full px-4 py-2 text-left text-sm hover:bg-secondary transition-colors flex items-center gap-2 text-foreground disabled:opacity-50"
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
                className="w-full px-4 py-2 text-left text-sm hover:bg-secondary transition-colors flex items-center gap-2 text-foreground disabled:opacity-50"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button
                onClick={() => {
                  onDelete(file.id);
                  setShowMenu(false);
                }}
                disabled={loading}
                className="w-full px-4 py-2 text-left text-sm hover:bg-destructive/10 transition-colors flex items-center gap-2 text-destructive disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {file.isShared && (
        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Shared link active
            {file.shareExpiry && ` until ${formatDate(file.shareExpiry)}`}
          </p>
        </div>
      )}
    </div>
  );
}
