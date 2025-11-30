import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/authContext";
import { ArrowLeft, AlertCircle, CheckCircle, Mail } from "lucide-react";

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
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Link */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>

        {/* Logo & Branding */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-xl mb-6 shadow-lg shadow-primary/20">
            <svg
              className="w-7 h-7 text-primary-foreground"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground">CloudVault</h1>
          <p className="text-muted-foreground mt-2 text-sm font-medium">
            Reset your password
          </p>
        </div>

        {/* Reset Card */}
        <div className="card p-8 mb-6">
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Enter your email address and we'll send you a secure link to
                reset your password.
              </p>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="you@example.com"
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3.5 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-3 bg-green-500/10 rounded-full">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  Check your email
                </h2>
                <p className="text-sm text-muted-foreground">
                  We've sent a password reset link to your email address. Click
                  the link to set a new password.
                </p>
              </div>

              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  The reset link will expire in 1 hour.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
