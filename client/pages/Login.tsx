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
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-primary/15 rounded mb-4">
            <Cloud className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground">CloudVault</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Enterprise cloud storage
          </p>
        </div>

        {/* Login Card */}
        <div className="card p-8 mb-8">
          <div className="mb-8">
            <h2 className="text-lg font-bold text-foreground">Sign in</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Enter your credentials to continue
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
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  Password
                </label>
                <Link
                  to="/reset-password"
                  className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
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
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
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
              disabled={loading}
              className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>

        {/* Sign up link */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary font-semibold hover:text-primary/80 transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
