import { useAuth } from "@/lib/authContext";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  LogOut,
  User,
  Menu,
  X,
  Search,
  HelpCircle,
} from "lucide-react";
import { useState } from "react";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const userInitials = user?.email
    ?.split("@")[0]
    .substring(0, 2)
    .toUpperCase() || "?";

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
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
            <h1 className="text-lg font-bold text-foreground hidden sm:block">
              CloudVault
            </h1>
          </div>

          {/* Center - Search */}
          <div className="hidden md:flex flex-1 max-w-sm mx-8">
            <div className="w-full relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
              <input
                type="text"
                placeholder="Search files..."
                className="input-field pl-10 h-9 text-sm"
              />
            </div>
          </div>

          {/* Right - Actions & Profile */}
          <div className="flex items-center gap-2">
            {/* Search button (mobile) */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="btn-icon md:hidden"
            >
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Help button */}
            <button className="btn-icon hidden sm:flex">
              <HelpCircle className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary/80 to-primary rounded-lg flex items-center justify-center text-xs font-semibold text-primary-foreground">
                  {userInitials}
                </div>
                <Menu className="w-5 h-5 text-muted-foreground md:hidden" />
              </button>

              {/* Dropdown menu */}
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-xl min-w-max overflow-hidden animate-fadeIn">
                  <div className="px-4 py-3 border-b border-border bg-secondary/20">
                    <p className="text-xs text-muted-foreground">Signed in as</p>
                    <p className="text-sm font-semibold text-foreground truncate">
                      {user?.email}
                    </p>
                  </div>

                  <div className="p-2">
                    <button
                      onClick={() => {
                        navigate("/settings");
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <button
                      onClick={() => {
                        navigate("/settings");
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Account
                    </button>
                    <div className="border-t border-border my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile search bar */}
        {showSearch && (
          <div className="pb-4 md:hidden animate-fadeIn">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
              <input
                type="text"
                placeholder="Search files..."
                className="input-field pl-10 h-10 text-sm w-full"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
