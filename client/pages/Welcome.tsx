import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/authContext";
import { useEffect } from "react";
import {
  Cloud,
  Upload,
  Share2,
  Settings,
  ArrowRight,
} from "lucide-react";

export default function Welcome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const steps = [
    {
      icon: Upload,
      title: "Upload Files",
      description: "Start by uploading your files to CloudVault. Support any file type up to 5GB.",
    },
    {
      icon: Share2,
      title: "Share Securely",
      description: "Create time-limited share links for your files with expiry dates.",
    },
    {
      icon: Settings,
      title: "Manage Settings",
      description: "Configure security, tokens, and storage preferences in settings.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-9 h-9 bg-primary/15 rounded">
                <Cloud className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-sm font-bold text-foreground">CloudVault</h1>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip to Dashboard →
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Welcome Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/15 rounded-lg mb-6">
            <Cloud className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome to CloudVault
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your account is ready. Let's get you started with secure cloud
            storage in minutes.
          </p>
          <p className="text-sm text-muted-foreground/60 mt-3">
            Signed in as <span className="font-medium">{user?.email}</span>
          </p>
        </div>

        {/* Quick Start Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="card p-8">
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-lg font-bold text-foreground mb-6">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "End-to-End Encryption",
                description: "All your files are encrypted with 256-bit AES",
              },
              {
                title: "Instant Sharing",
                description: "Create secure links with automatic expiry",
              },
              {
                title: "Smart Storage",
                description: "Monitor and manage your storage usage",
              },
              {
                title: "Account Security",
                description: "Password management and security tokens",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-4 border border-border/50 rounded-lg hover:bg-muted/20 transition-colors"
              >
                <h4 className="text-sm font-semibold text-foreground mb-1">
                  {feature.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Storage Info */}
        <div className="card p-8 bg-muted/20 border-2 border-border/50 mb-12">
          <h3 className="text-sm font-bold text-foreground mb-4">
            Your Storage
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Free plan</p>
              <div className="h-2 bg-muted/40 rounded-full overflow-hidden">
                <div className="h-full w-0 bg-primary rounded-full" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              You have 5 GB of free storage. Upgrade anytime to get more.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-all duration-200 gap-2 text-sm"
          >
            Start Uploading
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-muted-foreground mt-4">
            Learn more in{" "}
            <a href="#" className="text-primary hover:text-primary/80">
              documentation
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
