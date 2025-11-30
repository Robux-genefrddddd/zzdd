import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { Menu, X } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 border-r border-border bg-card">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          menuOpen={sidebarOpen}
        />

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="fixed left-0 top-16 h-screen w-64 bg-card border-r border-border z-40 lg:hidden overflow-y-auto">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
