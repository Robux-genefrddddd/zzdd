import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  HardDrive,
  LogOut,
  Cloud,
  Share2,
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose?.();
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      label: "Files",
      icon: HardDrive,
      path: "/dashboard",
    },
    {
      label: "Shared",
      icon: Share2,
      path: "/dashboard",
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-9 h-9 bg-primary/10 rounded">
            <Cloud className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-sm text-foreground">CloudVault</h2>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded transition-all duration-200 text-sm font-medium",
                isActive
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-6 border-t border-border/50 space-y-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sign out
        </button>
      </div>
    </div>
  );
}
