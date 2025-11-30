import { useState } from "react";
import { X, Copy, CheckCircle } from "lucide-react";
import { createShareLink } from "@/lib/fileUtils";
import { FileMetadata } from "@/lib/fileUtils";
import { useAuth } from "@/lib/authContext";

interface ShareModalProps {
  file: FileMetadata;
  onClose: () => void;
}

export function ShareModal({ file, onClose }: ShareModalProps) {
  const [loading, setLoading] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [expiryHours, setExpiryHours] = useState(24);
  const { user } = useAuth();

  const handleCreateShare = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const result = await createShareLink(
        user.uid,
        file.id,
        expiryHours
      );
      setShareLink(result.url);
    } catch (error) {
      console.error("Failed to create share link:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-lg shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Share File</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">File</p>
            <p className="font-medium text-foreground truncate">{file.name}</p>
          </div>

          {!shareLink ? (
            <>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Link Expiry
                </label>
                <select
                  value={expiryHours}
                  onChange={(e) => setExpiryHours(parseInt(e.target.value))}
                  className="input-field"
                  disabled={loading}
                >
                  <option value={1}>1 hour</option>
                  <option value={24}>1 day</option>
                  <option value={168}>1 week</option>
                  <option value={730}>1 month</option>
                </select>
              </div>

              <button
                onClick={handleCreateShare}
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? "Creating link..." : "Create Share Link"}
              </button>
            </>
          ) : (
            <>
              <div className="bg-secondary/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-2">Share link</p>
                <p className="text-sm text-foreground font-mono break-all">
                  {shareLink}
                </p>
              </div>

              <button
                onClick={copyToClipboard}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Link
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
