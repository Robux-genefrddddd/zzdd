import { useAuth } from "@/lib/authContext";
import { useNavigate } from "react-router-dom";
import { Cloud, LogOut, Settings } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Cloud className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">CloudVault</h1>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{user?.email}</p>
                <p className="text-xs text-muted-foreground">Pro</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/50 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">
                  {user?.email?.[0].toUpperCase()}
                </span>
              </div>
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-2 bg-card border border-border rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    navigate("/settings");
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-secondary transition-colors flex items-center gap-2 text-foreground"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-destructive/10 transition-colors flex items-center gap-2 text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
