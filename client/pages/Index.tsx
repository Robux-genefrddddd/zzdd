import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/authContext";
import { useEffect } from "react";
import { Cloud, Lock, Zap, Shield, Users } from "lucide-react";

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Cloud className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">CloudVault</h1>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#security" className="text-muted-foreground hover:text-foreground transition-colors">
                Security
              </a>
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm py-2 px-4"
                >
                  Sign Up
                </Link>
              </div>
            </nav>

            <div className="md:hidden flex items-center gap-2">
              <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
                Login
              </Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-4">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Your secure cloud storage, simplified
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Upload, share, and manage your files with confidence. Enterprise-grade security, intuitive interface, unlimited potential.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/register" className="btn-primary py-3 px-6 text-base font-medium">
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="btn-secondary py-3 px-6 text-base font-medium"
            >
              Already have an account?
            </Link>
          </div>

          <div className="relative">
            <div className="card-base p-8 border-2 border-border shadow-lg">
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-border flex items-center justify-center">
                <Cloud className="w-16 h-16 text-primary/20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-card border-t border-border py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need
            </h3>
            <p className="text-lg text-muted-foreground">
              Powerful features designed for simplicity and security
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Upload and download files at blazing speeds with optimized infrastructure",
              },
              {
                icon: Shield,
                title: "Bank-Level Security",
                description: "End-to-end encryption and advanced security protocols protect your data",
              },
              {
                icon: Users,
                title: "Easy Sharing",
                description: "Create secure share links with expiration dates and access control",
              },
              {
                icon: Lock,
                title: "Privacy First",
                description: "Your files are yours alone. We never access or share your data",
              },
              {
                icon: Cloud,
                title: "Any Device",
                description: "Access your files from anywhere, anytime, on any device",
              },
              {
                icon: Zap,
                title: "Reliable Uptime",
                description: "99.9% uptime guarantee with automatic backups and redundancy",
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="card-base p-6">
                  <div className="p-3 bg-secondary rounded-lg w-fit mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Security is our priority
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                We implement industry-leading security measures to protect your files and privacy.
              </p>

              <ul className="space-y-4">
                {[
                  "256-bit AES encryption",
                  "Two-factor authentication",
                  "Zero-knowledge architecture",
                  "Regular security audits",
                  "GDPR compliant",
                  "No backdoors or secret access",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-base p-8 border-2 border-border">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Encrypted</h4>
                    <p className="text-sm text-muted-foreground">
                      All data encrypted in transit and at rest
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Protected</h4>
                    <p className="text-sm text-muted-foreground">
                      Advanced access controls and monitoring
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Private</h4>
                    <p className="text-sm text-muted-foreground">
                      Your files are yours alone, completely private
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to secure your files?
          </h3>
          <p className="text-lg opacity-90 mb-8">
            Join thousands of users who trust CloudVault for their data storage needs
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-8 py-3 bg-primary-foreground text-primary font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; 2024 CloudVault. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
