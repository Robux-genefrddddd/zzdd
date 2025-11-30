import { useState } from "react";
import { X, Copy, CheckCircle, Share2, Calendar, Link2 } from "lucide-react";
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
      const result = await createShareLink(user.uid, file.id, expiryHours);
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

  const getExpiryText = (hours: number) => {
    if (hours === 1) return "1 hour";
    if (hours === 24) return "1 day";
    if (hours === 168) return "1 week";
    if (hours === 730) return "1 month";
    return `${hours} hours`;
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50 sticky top-0 bg-card/95 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Share2 className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground">Share</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-muted/40 transition-colors text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* File Info */}
          <div className="p-3.5 bg-muted/20 border border-border/50 rounded">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">
              File
            </p>
            <p className="text-sm text-foreground font-medium truncate">
              {file.name}
            </p>
          </div>

          {!shareLink ? (
            <>
              {/* Expiry Selection */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">
                  Expiry
                </label>
                <div className="space-y-2">
                  {[
                    { value: 1, label: "1 hour" },
                    { value: 24, label: "1 day" },
                    { value: 168, label: "1 week" },
                    { value: 730, label: "1 month" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 p-2.5 rounded border border-border/50 hover:bg-muted/30 cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        name="expiry"
                        value={option.value}
                        checked={expiryHours === option.value}
                        onChange={(e) =>
                          setExpiryHours(parseInt(e.target.value))
                        }
                        className="w-4 h-4 text-primary cursor-pointer"
                      />
                      <span className="text-xs font-medium text-foreground flex-1">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Info Box */}
              <div className="p-3.5 bg-primary/10 border border-primary/30 rounded">
                <p className="text-xs text-muted-foreground">
                  Link expires after{" "}
                  <span className="font-semibold text-foreground">
                    {getExpiryText(expiryHours)}
                  </span>
                </p>
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreateShare}
                disabled={loading}
                className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-all duration-200 active:scale-95 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Link"}
              </button>
            </>
          ) : (
            <>
              {/* Share Link Display */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Link
                </p>
                <div className="bg-muted/20 border border-border/50 rounded p-3 flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="bg-transparent text-xs text-foreground font-mono flex-1 outline-none truncate"
                  />
                </div>
              </div>

              {/* Success Message */}
              <div className="p-3.5 bg-green-500/10 border border-green-500/30 rounded flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-green-400">Link created</p>
              </div>

              {/* Copy Button */}
              <button
                onClick={copyToClipboard}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md font-medium transition-all duration-200 active:scale-95 ${
                  copied
                    ? "bg-green-500/10 text-green-400 border border-green-500/30"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>

              {/* Done Button */}
              <button
                onClick={onClose}
                className="w-full px-4 py-2.5 bg-secondary text-secondary-foreground rounded-md font-medium hover:bg-secondary/80 transition-all duration-200 active:scale-95"
              >
                Done
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
