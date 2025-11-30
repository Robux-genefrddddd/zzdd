import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/lib/authContext";
import {
  AlertCircle,
  CheckCircle,
  Copy,
  Key,
  Lock,
  Trash2,
  Eye,
  EyeOff,
  HardDrive,
  Shield,
} from "lucide-react";

export default function Settings() {
  const { userData, changePassword, regenerateShareToken, deleteAccount } =
    useAuth();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [shareToken, setShareToken] = useState(userData?.shareToken || "");
  const [tokenCopied, setTokenCopied] = useState(false);
  const [tokenLoading, setTokenLoading] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    setPasswordLoading(true);

    try {
      if (!newPassword || !confirmPassword) {
        setPasswordError("Please fill in all fields");
        setPasswordLoading(false);
        return;
      }

      if (newPassword.length < 6) {
        setPasswordError("Password must be at least 6 characters");
        setPasswordLoading(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        setPasswordError("Passwords do not match");
        setPasswordLoading(false);
        return;
      }

      await changePassword(newPassword);
      setPasswordSuccess("Password changed successfully");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordError(err.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleRegenerateToken = async () => {
    setTokenLoading(true);
    try {
      const newToken = await regenerateShareToken();
      setShareToken(newToken);
    } catch (err) {
      console.error("Failed to regenerate token:", err);
    } finally {
      setTokenLoading(false);
    }
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(shareToken);
    setTokenCopied(true);
    setTimeout(() => setTokenCopied(false), 2000);
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirm) return;
    setDeleteLoading(true);

    try {
      await deleteAccount();
    } catch (err) {
      console.error("Failed to delete account:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Layout>
      <div className="h-full flex flex-col bg-background">
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Page Header */}
            <div>
              <h1 className="text-4xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground mt-2">
                Manage your account, security, and preferences
              </p>
            </div>

            {/* Account Security Section */}
            <section className="card p-8">
              <div className="flex items-start gap-4 mb-8">
                <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Account Security
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Secure your account with a strong password
                  </p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 transition-all duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="••••••••"
                        disabled={passwordLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      Confirm Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 transition-all duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="••••••••"
                      disabled={passwordLoading}
                    />
                  </div>
                </div>

                {passwordError && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive">{passwordError}</p>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-400">{passwordSuccess}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all duration-200 active:scale-95 disabled:opacity-50"
                >
                  {passwordLoading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </section>

            {/* Share Token Section */}
            <section className="card p-8">
              <div className="flex items-start gap-4 mb-8">
                <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                  <Key className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Share Token
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your unique token for creating shared links. Keep this private.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-secondary/30 rounded-lg p-4 border border-border/50 flex items-center justify-between group">
                  <code className="text-sm font-mono text-muted-foreground/80 truncate flex-1 select-all">
                    {shareToken}
                  </code>
                  <button
                    onClick={handleCopyToken}
                    disabled={tokenLoading}
                    className="ml-3 p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
                  >
                    {tokenCopied ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                </div>

                <button
                  onClick={handleRegenerateToken}
                  disabled={tokenLoading}
                  className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-all duration-200 active:scale-95 disabled:opacity-50"
                >
                  {tokenLoading ? "Regenerating..." : "Regenerate Token"}
                </button>
              </div>
            </section>

            {/* Storage Section */}
            {userData && (
              <section className="card p-8">
                <div className="flex items-start gap-4 mb-8">
                  <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                    <HardDrive className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      Storage
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Monitor your storage usage
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-foreground">
                        Used Capacity
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {(
                          (userData.storageUsed / userData.storageLimit) *
                          100
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            (userData.storageUsed / userData.storageLimit) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t border-border/50">
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">
                        Used
                      </p>
                      <p className="text-xl font-bold text-foreground">
                        {(userData.storageUsed / (1024 * 1024 * 1024)).toFixed(
                          1
                        )}{" "}
                        GB
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">
                        Limit
                      </p>
                      <p className="text-xl font-bold text-foreground">
                        {(userData.storageLimit / (1024 * 1024 * 1024)).toFixed(
                          0
                        )}{" "}
                        GB
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">
                        Available
                      </p>
                      <p className="text-xl font-bold text-foreground">
                        {(
                          (userData.storageLimit - userData.storageUsed) /
                          (1024 * 1024 * 1024)
                        ).toFixed(1)}{" "}
                        GB
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Danger Zone */}
            <section className="card p-8 border-destructive/20 bg-destructive/5">
              <div className="flex items-start gap-4 mb-8">
                <div className="p-3 bg-destructive/10 rounded-lg flex-shrink-0">
                  <Trash2 className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-destructive">
                    Danger Zone
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Irreversible actions
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-6">
                Once you delete your account, there is no going back. All your
                files will be permanently deleted.
              </p>

              {!deleteConfirm ? (
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="px-6 py-3 bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90 transition-all duration-200 active:scale-95 disabled:opacity-50"
                >
                  Delete Account
                </button>
              ) : (
                <div className="space-y-4 p-6 bg-background/50 border border-destructive/20 rounded-lg">
                  <p className="text-sm font-semibold text-destructive">
                    Are you absolutely sure? This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleteLoading}
                      className="flex-1 px-6 py-3 bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90 transition-all duration-200 disabled:opacity-50"
                    >
                      {deleteLoading ? "Deleting..." : "Yes, delete my account"}
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(false)}
                      className="flex-1 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
