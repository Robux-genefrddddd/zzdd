import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/authContext";
import { useEffect } from "react";
import {
  Lock,
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
      <header className="sticky top-0 z-50 bg-card/50 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-9 h-9 bg-primary/15 rounded">
                <Cloud className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-sm font-bold text-foreground">CloudVault</h1>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Features
              </a>
              <a
                href="#security"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Security
              </a>
              <div className="flex items-center gap-3 pl-8 border-l border-border">
                <Link
                  to="/login"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2.5 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-all duration-200 text-xs"
                >
                  Get Started
                </Link>
              </div>
            </nav>

            <div className="md:hidden flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs text-muted-foreground hover:text-foreground font-medium"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="px-3 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-all text-xs"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Enterprise cloud storage,
              <span className="text-primary"> simplified</span>
            </h2>

            <p className="text-sm md:text-base text-muted-foreground mb-8 leading-relaxed">
              Upload, share, and manage your files with enterprise-grade
              security. Built for teams and individuals who demand better.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
              <Link
                to="/register"
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="px-6 py-2.5 bg-secondary text-secondary-foreground rounded-md font-medium hover:bg-secondary/80 transition-all duration-200 text-sm"
              >
                Sign In
              </Link>
            </div>

            {/* Placeholder */}
            <div className="relative">
              <div className="card p-2 border-2 border-border">
                <div className="aspect-video bg-muted/20 rounded flex items-center justify-center overflow-hidden relative">
                  <Cloud className="w-16 h-16 text-muted-foreground/20" />
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
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need
            </h3>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
              Purpose-built for cloud storage management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Lock,
                title: "Encrypted",
                description: "End-to-end encryption protects your files",
              },
              {
                icon: Shield,
                title: "Secure",
                description: "Bank-level security and access controls",
              },
              {
                icon: Users,
                title: "Shareable",
                description: "Easy sharing with expiring links and permissions",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card p-8">
                  <div className="p-2.5 bg-primary/10 rounded w-fit mb-4">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-sm font-bold text-foreground mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
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
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Security first
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-8 leading-relaxed">
                We implement industry-leading security measures to protect your
                files and privacy. Every file is encrypted, every connection is
                secure.
              </p>

              <ul className="space-y-3">
                {[
                  "256-bit AES encryption",
                  "Two-factor authentication",
                  "Zero-knowledge architecture",
                  "Regular security audits",
                  "GDPR & privacy compliant",
                  "No backdoors or secret access",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground font-medium">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-8 border-2 border-border/50">
              <div className="space-y-4">
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
                    description: "Your files are yours alone",
                  },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded flex-shrink-0">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-foreground mb-0.5">
                          {item.title}
                        </h5>
                        <p className="text-xs text-muted-foreground">
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
          <div className="card p-12 bg-muted/10 border-2 border-border/50">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to get started?
            </h3>
            <p className="text-sm md:text-base text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of users who trust CloudVault for secure data
              storage
            </p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-all duration-200 gap-2 text-sm"
            >
              Create Free Account
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary/15 rounded flex items-center justify-center">
                <Cloud className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">
                © 2024 CloudVault. All rights reserved.
              </p>
            </div>
            <div className="flex gap-6 text-xs text-muted-foreground">
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
