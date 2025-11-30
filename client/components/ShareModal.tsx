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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card/95 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-lg">
              <Share2 className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Share File</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* File Info */}
          <div className="p-4 bg-secondary/20 border border-border/50 rounded-lg">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">
              File
            </p>
            <p className="font-semibold text-foreground truncate text-sm">
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ""}
            </p>
          </div>

          {!shareLink ? (
            <>
              {/* Expiry Selection */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Link Expiry
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
                      className="flex items-center gap-3 p-3.5 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors group"
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
                      <span className="text-sm font-medium text-foreground flex-1">
                        {option.label}
                      </span>
                      <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        Recommended
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The share link will expire after{" "}
                  <span className="font-semibold text-foreground">
                    {getExpiryText(expiryHours)}
                  </span>
                  . Anyone with the link can download the file.
                </p>
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreateShare}
                disabled={loading}
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating link..." : "Create Share Link"}
              </button>
            </>
          ) : (
            <>
              {/* Share Link Display */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Your Share Link
                </p>
                <div className="bg-input border border-border rounded-lg p-4 flex items-start gap-3 group">
                  <Link2 className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="bg-transparent text-sm text-foreground font-mono flex-1 outline-none truncate"
                    onClick={(e) => e.currentTarget.select()}
                  />
                </div>
              </div>

              {/* Success Message */}
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-green-400 leading-relaxed">
                  ✓ Share link created successfully. Anyone with this link can
                  download the file.
                </p>
              </div>

              {/* Copy Button */}
              <button
                onClick={copyToClipboard}
                className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold transition-all duration-200 active:scale-95 ${
                  copied
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Copied to clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Link
                  </>
                )}
              </button>

              {/* Done Button */}
              <button
                onClick={onClose}
                className="w-full px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/80 transition-all duration-200 active:scale-95"
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
