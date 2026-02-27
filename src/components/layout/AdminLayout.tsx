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
      navigate("/admin");
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
          "bg-[#1e1b18] text-white w-64 fixed h-full transition-all duration-300 z-30 flex flex-col border-r border-white/5",
          isSidebarOpen ? "translate-x-0" : "-translate-x-64"
        )}
      >
        <div className="p-6 flex items-center justify-between shrink-0 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight uppercase">Admin</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 hover:bg-white/10 rounded">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="px-4 space-y-1 mt-6 flex-1 overflow-y-auto pb-24 scrollbar-thin scrollbar-thumb-white/10">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium",
                location.pathname === item.path 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn("h-4 w-4 shrink-0", location.pathname === item.path ? "text-white" : "text-slate-500")} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 shrink-0 bg-[#1e1b18]">
          <button 
            onClick={() => {
              logoutAdmin();
              toast.success("Logged out successfully");
              navigate("/admin");
            }}
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 w-full transition-all rounded-xl text-sm font-bold"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "flex-1 transition-all duration-300 min-h-screen flex flex-col bg-[#fdfcfb]",
        isSidebarOpen ? "lg:ml-64" : "ml-0"
      )}>
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-6 justify-between sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Menu className="h-6 w-6 text-slate-600" />
            </button>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
              {navItems.find(item => item.path === location.pathname)?.label || "Overview"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-[#3b2c1f] capitalize">{adminRole === 'admin' ? 'Administrator' : 'Viewer'}</span>
              <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter flex items-center gap-1">
                <span className="h-1 w-1 bg-emerald-500 rounded-full animate-pulse" />
                System Active
              </span>
            </div>
            <div className="h-10 w-10 bg-[#1e1b18] rounded-xl flex items-center justify-center text-primary font-black uppercase shadow-inner border border-white/5">
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
