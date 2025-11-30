import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/authContext";
import {
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Cloud,
  Eye,
  EyeOff,
} from "lucide-react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const passwordsMatch =
    confirmPassword && password === confirmPassword && password.length >= 6;

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
      }

      setError(userFriendlyError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-primary/15 rounded mb-4">
            <Cloud className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground">CloudVault</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Create your account to get started
          </p>
        </div>

        {/* Register Card */}
        <div className="card p-8 mb-8">
          <div className="mb-8">
            <h2 className="text-lg font-bold text-foreground">Sign up</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Create a new account to access cloud storage
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
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

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="••••••••"
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Password strength */}
              {password && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1 rounded-full overflow-hidden bg-muted">
                    <div
                      className={`h-full transition-all ${
                        password.length >= 8
                          ? "bg-green-500/60 w-full"
                          : password.length >= 6
                            ? "bg-yellow-500/60 w-2/3"
                            : "bg-muted w-1/3"
                      }`}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {password.length >= 8
                      ? "Strong"
                      : password.length >= 6
                        ? "Good"
                        : "Weak"}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="••••••••"
                  disabled={loading}
                  autoComplete="new-password"
                />
                {passwordsMatch && (
                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500/60" />
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-xs text-destructive">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !passwordsMatch}
              className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? "Creating account..." : "Create account"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>

        {/* Sign in link */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
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
