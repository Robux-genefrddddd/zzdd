import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/authContext";
import { useEffect } from "react";
import {
  Lock,
  Zap,
  Shield,
  Users,
  CheckCircle,
  ArrowRight,
  Cloud,
} from "lucide-react";

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg">
                <svg
                  className="w-5 h-5 text-primary-foreground"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-foreground">CloudVault</h1>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Features
              </a>
              <a
                href="#security"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Security
              </a>
              <div className="flex items-center gap-3 pl-8 border-l border-border">
                <Link
                  to="/login"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  Sign in
                </Link>
                <Link to="/register" className="btn-primary py-2 px-4 text-sm">
                  Get Started
                </Link>
              </div>
            </nav>

            <div className="md:hidden flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm text-muted-foreground hover:text-foreground font-medium"
              >
                Sign in
              </Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-4">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/4 w-full h-full bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-primary">
                Trusted by thousands
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Your secure cloud storage,
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {" "}
                simplified
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl">
              Upload, share, and manage your files with confidence.
              Enterprise-grade security, intuitive interface, unlimited
              potential.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                to="/register"
                className="btn-primary py-3 px-8 text-base font-semibold flex items-center justify-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="btn-secondary py-3 px-8 text-base font-semibold"
              >
                Sign In
              </Link>
            </div>

            {/* Hero Image Placeholder */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="card p-2 border-2 border-border">
                <div className="aspect-video bg-gradient-to-br from-primary/20 via-secondary to-background rounded-lg flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                  <Cloud className="w-24 h-24 text-primary/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Everything you need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed for simplicity, security, and
              collaboration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description:
                  "Upload and download files at blazing speeds with optimized infrastructure",
              },
              {
                icon: Shield,
                title: "Bank-Level Security",
                description:
                  "End-to-end encryption and advanced security protocols protect your data",
              },
              {
                icon: Users,
                title: "Easy Sharing",
                description:
                  "Create secure share links with expiration dates and granular access control",
              },
              {
                icon: Lock,
                title: "Privacy First",
                description:
                  "Your files are yours alone. We never access or share your data",
              },
              {
                icon: Cloud,
                title: "Any Device",
                description:
                  "Access your files from anywhere, anytime, on any device",
              },
              {
                icon: CheckCircle,
                title: "Reliable Uptime",
                description:
                  "99.9% uptime guarantee with automatic backups and redundancy",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card-interactive p-8">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Security is our priority
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We implement industry-leading security measures to protect your
                files and privacy. Every file is encrypted, every connection is
                secure.
              </p>

              <ul className="space-y-4">
                {[
                  "256-bit AES encryption",
                  "Two-factor authentication",
                  "Zero-knowledge architecture",
                  "Regular security audits",
                  "GDPR & privacy compliant",
                  "No backdoors or secret access",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="space-y-6">
                {[
                  {
                    icon: Lock,
                    title: "Encrypted",
                    description: "All data encrypted in transit and at rest",
                  },
                  {
                    icon: Shield,
                    title: "Protected",
                    description: "Advanced access controls and monitoring",
                  },
                  {
                    icon: Users,
                    title: "Private",
                    description:
                      "Your files are yours alone, completely private",
                  },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">
                          {item.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card p-12 bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Ready to secure your files?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust CloudVault for their data
              storage needs
            </p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all duration-200 gap-2"
            >
              Create Free Account
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Cloud className="w-4 h-4 text-primary-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                © 2024 CloudVault. All rights reserved.
              </p>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
