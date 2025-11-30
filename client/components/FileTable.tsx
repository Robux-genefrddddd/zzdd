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

interface FileTableProps {
  files: FileMetadata[];
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

export function FileTable({
  files,
  onDelete,
  onDownload,
  onShare,
  loading = false,
}: FileTableProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  if (files.length === 0) {
    return (
      <div className="card p-16 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-muted/30 rounded-lg">
            <File className="w-8 h-8 text-muted-foreground" />
          </div>
        </div>
        <p className="text-foreground font-medium mb-1">No files</p>
        <p className="text-sm text-muted-foreground">
          Upload your first file to get started
        </p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead>
            <tr className="border-b border-border/50 bg-muted/20">
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {files.map((file) => {
              const FileIcon = getFileIcon(file.mimeType);
              const isMenuOpen = activeMenu === file.id;

              return (
                <tr
                  key={file.id}
                  className="border-b border-border/50 hover:bg-muted/20 transition-colors duration-150"
                >
                  {/* Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <FileIcon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="text-sm text-foreground font-medium truncate max-w-xs">
                        {file.name}
                      </span>
                    </div>
                  </td>

                  {/* Size */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">
                      {formatFileSize(file.size)}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(file.uploadedAt)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    {file.isShared ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                        Shared
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Private
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="relative inline-block">
                      <button
                        onClick={() =>
                          setActiveMenu(isMenuOpen ? null : file.id)
                        }
                        className="p-2 rounded hover:bg-muted/40 transition-colors text-muted-foreground hover:text-foreground"
                        disabled={loading}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Context Menu */}
                      {isMenuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-44 bg-card border border-border rounded-lg shadow-lg overflow-hidden animate-fadeIn z-20">
                          <button
                            onClick={() => {
                              onDownload(file);
                              setActiveMenu(null);
                            }}
                            disabled={loading}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-muted/40 transition-colors flex items-center gap-3 text-foreground disabled:opacity-50"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                          <button
                            onClick={() => {
                              onShare(file);
                              setActiveMenu(null);
                            }}
                            disabled={loading}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-muted/40 transition-colors flex items-center gap-3 text-foreground disabled:opacity-50"
                          >
                            <Share2 className="w-4 h-4" />
                            Share
                          </button>
                          <div className="border-t border-border/50" />
                          <button
                            onClick={() => {
                              onDelete(file.id);
                              setActiveMenu(null);
                            }}
                            disabled={loading}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-destructive/10 transition-colors flex items-center gap-3 text-destructive disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
