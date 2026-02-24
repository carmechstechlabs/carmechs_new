import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Wrench, 
  Car, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  MessageCircle,
  Calendar,
  Users,
  Palette,
  Key,
  UsersRound,
  Shield
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useData } from "@/context/DataContext";
import { toast } from "sonner";

export function AdminLayout() {
  const { isAdminLoggedIn, logoutAdmin, adminRole } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);

  useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate("/admin/login");
    }
  }, [isAdminLoggedIn, navigate]);

  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  if (!isAdminLoggedIn) return null;

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/appointments", label: "Appointments", icon: Calendar },
    { path: "/admin/customers", label: "Customers", icon: UsersRound },
    { path: "/admin/services", label: "Services", icon: Wrench },
    { path: "/admin/brands", label: "Brands", icon: Shield },
    { path: "/admin/cars", label: "Car Data", icon: Car },
    { path: "/admin/users", label: "Users", icon: Users },
    { path: "/admin/ui-settings", label: "UI Settings", icon: Palette },
    { path: "/admin/api-keys", label: "API Keys", icon: Key },
    { path: "/admin/settings", label: "Site Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-slate-900 text-white w-64 fixed h-full transition-all duration-300 z-30 flex flex-col",
          isSidebarOpen ? "translate-x-0" : "-translate-x-64"
        )}
      >
        <div className="p-6 flex items-center justify-between shrink-0">
          <span className="text-xl font-bold">Admin Panel</span>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 hover:bg-slate-800 rounded">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="px-4 space-y-1 mt-4 flex-1 overflow-y-auto pb-24 scrollbar-thin scrollbar-thumb-slate-700">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm",
                location.pathname === item.path 
                  ? "bg-primary text-white" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 shrink-0">
          <button 
            onClick={() => {
              logoutAdmin();
              toast.success("Logged out successfully");
              navigate("/admin/login");
            }}
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white w-full transition-colors text-sm"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "flex-1 transition-all duration-300 min-h-screen flex flex-col",
        isSidebarOpen ? "lg:ml-64" : "ml-0"
      )}>
        <header className="bg-white shadow-sm h-16 flex items-center px-6 justify-between sticky top-0 z-10 shrink-0">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg">
            <Menu className="h-6 w-6 text-slate-600" />
          </button>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium text-slate-900 capitalize">{adminRole === 'admin' ? 'Administrator' : 'Viewer'}</span>
              <span className="text-xs text-slate-500">Online</span>
            </div>
            <div className="h-9 w-9 bg-primary rounded-full flex items-center justify-center text-white font-bold uppercase shadow-sm">
              {adminRole ? adminRole[0] : 'U'}
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
