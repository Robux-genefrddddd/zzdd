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

  const passwordStrength =
    password.length >= 8 ? "strong" : password.length >= 6 ? "medium" : "weak";

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
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Branding */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-lg mb-6">
            <Cloud className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">CloudVault</h1>
          <p className="text-muted-foreground mt-2 text-sm font-medium">
            Create your account to get started
          </p>
        </div>

        {/* Register Card */}
        <div className="card p-8 mb-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Sign up
            </h2>
            <p className="text-sm text-muted-foreground">
              Create a new account to access secure cloud storage
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 transition-all duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="you@example.com"
                disabled={loading}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 transition-all duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 pr-10"
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
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex-1 h-1 rounded-full overflow-hidden bg-secondary">
                    <div
                      className={`h-full transition-all ${
                        passwordStrength === "strong"
                          ? "bg-green-500 w-full"
                          : passwordStrength === "medium"
                            ? "bg-yellow-500 w-2/3"
                            : "bg-muted w-1/3"
                      }`}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {passwordStrength === "strong"
                      ? "Strong"
                      : passwordStrength === "medium"
                        ? "Good"
                        : "Weak"}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 transition-all duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 pr-10"
                  placeholder="••••••••"
                  disabled={loading}
                  autoComplete="new-password"
                />
                {passwordsMatch && (
                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3 animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !passwordsMatch}
              className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border/30 text-center text-xs text-muted-foreground">
          <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
}
