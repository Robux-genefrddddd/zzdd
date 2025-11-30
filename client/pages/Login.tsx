import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/authContext";
import { ArrowRight, AlertCircle, Cloud, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email || !password) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      const errorCode = err.code || "";
      const errorMessage = err.message || "";

      let userFriendlyError = "Failed to login. Please try again.";

      if (
        errorCode.includes("user-not-found") ||
        errorMessage.includes("USER_NOT_FOUND") ||
        errorMessage.includes("user-not-found")
      ) {
        userFriendlyError =
          "Email not found. Please check or register a new account.";
      } else if (
        errorCode.includes("wrong-password") ||
        errorMessage.includes("INVALID_PASSWORD") ||
        errorMessage.includes("wrong-password")
      ) {
        userFriendlyError = "Incorrect password. Please try again.";
      } else if (
        errorCode.includes("invalid-email") ||
        errorMessage.includes("INVALID_EMAIL")
      ) {
        userFriendlyError = "Please enter a valid email address.";
      } else if (
        errorCode.includes("too-many-requests") ||
        errorMessage.includes("TOO_MANY_ATTEMPTS_TRY_LATER")
      ) {
        userFriendlyError =
          "Too many failed login attempts. Please try again later.";
      } else if (
        errorMessage.includes("INVALID_LOGIN_CREDENTIALS") ||
        errorMessage.includes("INVALID_EMAIL_OR_PASSWORD")
      ) {
        userFriendlyError = "Email or password is incorrect.";
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
            Secure cloud storage for teams and individuals
          </p>
        </div>

        {/* Login Card */}
        <div className="card p-8 mb-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Sign in
            </h2>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your account
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
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-foreground">
                  Password
                </label>
                <Link
                  to="/reset-password"
                  className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 transition-all duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 pr-10"
                  placeholder="••••••••"
                  disabled={loading}
                  autoComplete="current-password"
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
              disabled={loading}
              className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>

        {/* Sign up link */}
        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary font-semibold hover:text-primary/80 transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border/30 text-center text-xs text-muted-foreground">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
}
