import { useAuth } from "@/lib/authContext";
import { useNavigate } from "react-router-dom";
import { Menu, Settings, LogOut, User, Bell, HelpCircle } from "lucide-react";
import { useState } from "react";

interface TopBarProps {
  onMenuClick: () => void;
  menuOpen: boolean;
}

export function TopBar({ onMenuClick, menuOpen }: TopBarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const userInitials =
    user?.email?.split("@")[0].substring(0, 2).toUpperCase() || "?";

  return (
    <header className="sticky top-0 z-30 h-16 bg-card border-b border-border">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left - Menu button (mobile) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Center - Spacer */}
        <div className="flex-1 hidden sm:block" />

        {/* Right - Actions */}
        <div className="flex items-center gap-3">
          {/* Help button */}
          <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hidden sm:block">
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Notifications button */}
          <button className="relative p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary/80 to-primary rounded-lg flex items-center justify-center text-xs font-semibold text-white">
                {userInitials}
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block">
                {user?.email?.split("@")[0]}
              </span>
            </button>

            {/* Profile Menu */}
            {showProfile && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-lg shadow-xl overflow-hidden animate-fadeIn z-40">
                <div className="px-4 py-4 border-b border-border/50 bg-secondary/10">
                  <p className="text-xs text-muted-foreground font-medium">
                    SIGNED IN AS
                  </p>
                  <p className="text-sm font-semibold text-foreground mt-1 break-all">
                    {user?.email}
                  </p>
                </div>

                <div className="p-2">
                  <button
                    onClick={() => {
                      navigate("/settings");
                      setShowProfile(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Account Settings
                  </button>
                  <button
                    onClick={() => {
                      navigate("/settings");
                      setShowProfile(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Preferences
                  </button>
                  <div className="border-t border-border/50 my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
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
    </header>
  );
}
