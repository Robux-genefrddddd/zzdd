import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/authContext";
import { ArrowLeft, AlertCircle, CheckCircle, Cloud } from "lucide-react";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email) {
        setError("Please enter your email");
        setLoading(false);
        return;
      }

      await resetPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(
        err.message.includes("user-not-found")
          ? "Email not found"
          : "Failed to send reset email. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-12 text-xs font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>

        {/* Logo */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-primary/15 rounded mb-4">
            <Cloud className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground">CloudVault</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Reset your password
          </p>
        </div>

        {/* Reset Card */}
        <div className="card p-8">
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Enter your email address and we'll send you a secure link to
                reset your password.
              </p>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="you@example.com"
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              {error && (
                <div className="p-3.5 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-destructive">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-all duration-200 active:scale-95 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-3 bg-green-500/10 rounded">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              </div>

              <div>
                <h2 className="text-sm font-bold text-foreground mb-2">
                  Check your email
                </h2>
                <p className="text-xs text-muted-foreground">
                  We've sent a password reset link to your email. Click the link
                  to set a new password.
                </p>
              </div>

              <div className="p-3 bg-primary/10 border border-primary/30 rounded">
                <p className="text-xs text-muted-foreground">
                  Link expires in 1 hour
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
