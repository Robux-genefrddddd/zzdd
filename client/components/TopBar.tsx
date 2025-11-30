import { useAuth } from "@/lib/authContext";
import { useNavigate } from "react-router-dom";
import { Menu, Settings, LogOut, User, Bell } from "lucide-react";
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
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left - Menu button (mobile) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded hover:bg-muted/40 transition-colors text-muted-foreground"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Center - Spacer */}
        <div className="flex-1 hidden sm:block" />

        {/* Right - Actions */}
        <div className="flex items-center gap-1">
          {/* Notifications button */}
          <button className="relative p-2 rounded hover:bg-muted/40 transition-colors text-muted-foreground">
            <Bell className="w-5 h-5" />
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-border/50 mx-1" />

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/40 transition-colors"
            >
              <div className="w-7 h-7 bg-primary/15 text-primary rounded text-xs font-semibold flex items-center justify-center border border-primary/30">
                {userInitials}
              </div>
              <span className="text-sm text-foreground hidden sm:block">
                {user?.email?.split("@")[0]}
              </span>
            </button>

            {/* Profile Menu */}
            {showProfile && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-xl overflow-hidden animate-fadeIn z-40">
                <div className="px-4 py-3 border-b border-border/50 bg-muted/20">
                  <p className="text-xs text-muted-foreground font-semibold">
                    ACCOUNT
                  </p>
                  <p className="text-sm text-foreground mt-1 break-all truncate">
                    {user?.email}
                  </p>
                </div>

                <div className="py-2">
                  <button
                    onClick={() => {
                      navigate("/settings");
                      setShowProfile(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted/40 transition-colors flex items-center gap-3"
                  >
                    <User className="w-4 h-4" />
                    Account
                  </button>
                  <button
                    onClick={() => {
                      navigate("/settings");
                      setShowProfile(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted/40 transition-colors flex items-center gap-3"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <div className="border-t border-border/50 my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-3"
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
