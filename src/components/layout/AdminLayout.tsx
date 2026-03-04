import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Wrench, 
  Car, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Calendar,
  Users,
  Palette,
  Key,
  UsersRound,
  Shield,
  Activity,
  Cpu,
  Terminal,
  MapPin,
  Package,
  LayoutGrid,
  Ticket,
  Star,
  Bell
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useData } from "@/context/DataContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export function AdminLayout() {
  const { isAdminLoggedIn, logoutAdmin, adminRole, uiSettings, settings } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate("/admin");
    }
  }, [isAdminLoggedIn, navigate]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  if (!isAdminLoggedIn) return null;

  const navItems = [
    { path: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
    { path: "/admin/appointments", label: "Bookings", icon: Calendar },
    { path: "/admin/customers", label: "Customers", icon: UsersRound },
    { path: "/admin/services", label: "Catalog", icon: Wrench },
    { path: "/admin/service-packages", label: "Bundles", icon: Package },
    { path: "/admin/categories", label: "Categories", icon: LayoutGrid },
    { path: "/admin/inventory", label: "Inventory", icon: Package },
    { path: "/admin/coupons", label: "Coupons", icon: Ticket },
    { path: "/admin/reviews", label: "Reviews", icon: Star },
    { path: "/admin/brands", label: "Brands", icon: Shield },
    { path: "/admin/locations", label: "Cities", icon: MapPin },
    { path: "/admin/cars", label: "Car DB", icon: Car },
    { path: "/admin/users", label: "Staff", icon: Users },
    { path: "/admin/ui-settings", label: "Interface", icon: Palette },
    { path: "/admin/api-keys", label: "Integrations", icon: Key },
    { path: "/admin/settings", label: "System", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex relative font-sans text-slate-900 selection:bg-primary/20">
      {/* Subtle Grid Background */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0 bg-grid-pattern" />

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" 
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white w-72 fixed h-full transition-all duration-500 z-50 flex flex-col border-r border-slate-200 shadow-2xl",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
        )}
      >
        {/* Sidebar Header */}
        <div className="p-6 flex items-center justify-between shrink-0 border-b border-slate-100 h-20">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className={cn(
              "rounded-xl flex items-center justify-center transition-all shrink-0",
              settings.logoUrl ? "h-12 w-auto" : "h-10 w-10 bg-primary shadow-lg shadow-primary/20"
            )}>
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.logoText} className="h-full w-auto object-contain" />
              ) : (
                <Terminal className="h-5 w-5 text-white" />
              )}
            </div>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col"
              >
                <span className="text-lg font-black tracking-tighter uppercase leading-none text-slate-900">
                  {settings.logoText || "Admin"}
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Management Hub</span>
              </motion.div>
            )}
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="px-3 py-6 space-y-1 flex-1 overflow-y-auto scrollbar-none">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative overflow-hidden",
                  isActive 
                    ? "bg-[#e31e24] text-white shadow-lg shadow-red-500/20" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-slate-400")} />
                {isSidebarOpen && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-bold uppercase tracking-widest"
                  >
                    {item.label}
                  </motion.span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 shrink-0 bg-white">
          <button 
            onClick={() => {
              logoutAdmin();
              toast.success("Logged out successfully");
              navigate("/admin");
            }}
            className="flex items-center gap-4 px-4 py-4 text-slate-400 hover:text-red-600 hover:bg-red-50 w-full transition-all rounded-2xl text-xs font-black uppercase tracking-widest group"
          >
            <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={cn(
        "flex-1 transition-all duration-500 min-h-screen flex flex-col relative z-10",
        isSidebarOpen ? "lg:ml-72" : "lg:ml-20"
      )}>
        {/* Top Header */}
        <header 
          className={cn(
            "h-20 flex items-center px-8 justify-between sticky top-0 z-40 transition-all duration-300",
            scrolled ? "bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm" : "bg-transparent"
          )}
        >
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="p-2.5 bg-white hover:bg-slate-50 rounded-xl transition-all border border-slate-200 group shadow-sm"
            >
              <Menu className="h-5 w-5 text-slate-400 group-hover:text-red-600" />
            </button>
            <div className="hidden sm:flex flex-col">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">
                {navItems.find(item => item.path === location.pathname)?.label || "Overview"}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Online</span>
                <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{adminRole === 'admin' ? 'Administrator' : 'Staff'}</span>
                <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-tighter flex items-center gap-1.5">
                  <span className="h-1 w-1 bg-emerald-500 rounded-full" />
                  Live
                </span>
              </div>
              <div className="h-10 w-10 bg-[#e31e24] rounded-xl flex items-center justify-center text-white font-black uppercase shadow-md shadow-red-500/20">
                {adminRole ? adminRole[0] : 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 lg:p-10 flex-1">
          <Outlet />
        </main>

        {/* Footer Info Bar */}
        <footer className="h-12 border-t border-slate-100 flex items-center px-8 justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-6">
            <span>© {new Date().getFullYear()} CARMECHS MANAGEMENT</span>
            <span className="hidden sm:inline">SECURE SESSION ACTIVE</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-600">SYSTEM STABLE</span>
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </div>
        </footer>
      </div>
    </div>
  );
}
