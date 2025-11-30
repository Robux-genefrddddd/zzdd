import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/authContext";
import { ArrowRight, AlertCircle, CheckCircle } from "lucide-react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const passwordStrength =
    password.length >= 8 ? "strong" : password.length >= 6 ? "medium" : "weak";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email || !password || !confirmPassword) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      await register(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      const errorCode = err.code || "";
      const errorMessage = err.message || "";

      let userFriendlyError = "Failed to register. Please try again.";

      if (
        errorCode.includes("email-already-in-use") ||
        errorMessage.includes("EMAIL_EXISTS")
      ) {
        userFriendlyError =
          "This email is already registered. Please login or use a different email.";
      } else if (
        errorCode.includes("invalid-email") ||
        errorMessage.includes("INVALID_EMAIL")
      ) {
        userFriendlyError = "Please enter a valid email address.";
      } else if (
        errorCode.includes("weak-password") ||
        errorMessage.includes("WEAK_PASSWORD")
      ) {
        userFriendlyError = "Password is too weak. Use at least 6 characters.";
      } else if (
        errorCode.includes("operation-not-allowed") ||
        errorMessage.includes("OPERATION_NOT_ALLOWED")
      ) {
        userFriendlyError =
          "Registration is currently disabled. Please try again later.";
      } else if (
        errorMessage.includes("EMAIL_EXISTS") ||
        errorMessage.includes("email-already-in-use")
      ) {
        userFriendlyError =
          "This email is already registered. Please login or use a different email.";
      }

      setError(userFriendlyError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
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
            Create your account to get started
          </p>
        </div>

        {/* Register Card */}
        <div className="card p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Email address
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

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                disabled={loading}
                autoComplete="new-password"
              />
              <div className="flex items-center gap-2 mt-2">
                <div
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    passwordStrength === "strong"
                      ? "bg-green-500"
                      : passwordStrength === "medium"
                        ? "bg-yellow-500"
                        : "bg-muted"
                  }`}
                />
                <p className="text-xs text-muted-foreground">
                  {password.length >= 6 ? "At least 6 characters" : ""}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                  disabled={loading}
                  autoComplete="new-password"
                />
                {confirmPassword &&
                  password === confirmPassword &&
                  password.length >= 6 && (
                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
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
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? "Creating account..." : "Create account"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>

        {/* Sign in link */}
        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-semibold hover:text-primary/80 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
