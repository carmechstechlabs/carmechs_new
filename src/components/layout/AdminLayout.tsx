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
  Globe,
  Key,
  UsersRound,
  Shield,
  Activity,
  Cpu,
  Zap,
  Terminal,
  MapPin,
  Package,
  LayoutGrid,
  Ticket,
  Star,
  Bell,
  CheckCircle2,
  CheckSquare,
  Navigation
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useData } from "@/context/DataContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export function AdminLayout() {
  const { isAdminLoggedIn, logoutAdmin, adminRole, uiSettings, settings, notifications, updateNotifications, navigationItems } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('adminSidebarOpen');
    if (saved !== null) return saved === 'true';
    return window.innerWidth > 1024;
  });
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    localStorage.setItem('adminSidebarOpen', String(isSidebarOpen));
  }, [isSidebarOpen]);
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

  const iconMap: { [key: string]: any } = {
    "Overview": LayoutDashboard,
    "Workshop": Activity,
    "Bookings": Calendar,
    "Inventory": Package,
    "Services": Wrench,
    "Bundles": Package,
    "Categories": LayoutGrid,
    "Brands": Shield,
    "Car DB": Car,
    "Vehicle Config": Settings,
    "Smart Diagnostic": Zap,
    "Customers": UsersRound,
    "Testimonials": Star,
    "Reviews": Star,
    "Coupons": Ticket,
    "Tasks": CheckSquare,
    "FAQs": Globe,
    "Cities": MapPin,
    "Navigation": Navigation,
    "Staff": Users,
    "Interface": Palette,
    "SEO Engine": Globe,
    "Integrations": Key,
    "System": Settings,
  };

  const dynamicAdminItems = navigationItems
    .filter(item => item.isActive && item.adminOnly)
    .sort((a, b) => a.order - b.order)
    .map(item => ({
      path: item.path,
      label: item.label,
      icon: iconMap[item.label] || LayoutGrid,
      adminOnly: true // They are already filtered by adminOnly
    }));

  const navGroups = [
    {
      title: "Menu",
      items: dynamicAdminItems
    }
  ].filter(group => group.items.length > 0);

  return (
    <div className="min-h-screen bg-background flex relative font-sans text-foreground selection:bg-primary/20">
      {/* Subtle Grid Background */}
      <div className="fixed inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none z-0 bg-grid-pattern" />

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-40 lg:hidden" 
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-card w-72 fixed h-full transition-all duration-500 z-50 flex flex-col border-r border-border shadow-2xl",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
        )}
      >
        {/* Sidebar Header */}
        <div className="p-6 flex items-center justify-between shrink-0 border-b border-border h-20">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className={cn(
              "rounded-xl flex items-center justify-center transition-all shrink-0",
              settings.logoUrl ? "h-12 w-auto" : "h-10 w-10 bg-primary shadow-lg shadow-primary/20"
            )}>
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.logoText} className="h-full w-auto object-contain" />
              ) : (
                <Terminal className="h-5 w-5 text-primary-foreground" />
              )}
            </div>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col"
              >
                <span className="text-lg font-black tracking-tighter uppercase leading-none text-foreground">
                  {settings.logoText || "Admin"}
                </span>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Management Hub</span>
              </motion.div>
            )}
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 hover:bg-accent rounded-xl transition-colors text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="px-3 py-6 space-y-8 flex-1 overflow-y-auto scrollbar-none">
          {navGroups.map((group, gIndex) => (
            <div key={gIndex} className="space-y-2">
              {isSidebarOpen && (
                <h3 className="px-4 text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-4">
                  {group.title}
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group relative overflow-hidden",
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <item.icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-110", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                      {isSidebarOpen && (
                        <motion.span 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs font-bold uppercase tracking-widest"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border shrink-0 bg-card">
          <button 
            onClick={() => {
              logoutAdmin();
              toast.success("Logged out successfully");
              navigate("/admin");
            }}
            className="flex items-center gap-4 px-4 py-4 text-muted-foreground hover:text-primary hover:bg-primary/5 w-full transition-all rounded-2xl text-xs font-black uppercase tracking-widest group"
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
            scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm" : "bg-transparent"
          )}
        >
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="p-2.5 bg-card hover:bg-accent rounded-xl transition-all border border-border group shadow-sm"
            >
              <Menu className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
            </button>
            <div className="hidden sm:flex flex-col">
              <h2 className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em]">
                {navGroups.flatMap(g => g.items).find(item => item.path === location.pathname)?.label || "Overview"}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">System Online</span>
                <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2.5 bg-card hover:bg-accent rounded-xl transition-all border border-border group shadow-sm relative"
              >
                <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full border-2 border-background" />
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-80 bg-card rounded-3xl shadow-2xl border border-border z-50 overflow-hidden"
                    >
                      <div className="p-6 border-b border-border flex justify-between items-center bg-accent/50">
                        <h3 className="text-xs font-black text-foreground uppercase tracking-widest">Notifications</h3>
                        {unreadCount > 0 && (
                          <button 
                            onClick={() => {
                              const updated = notifications.map(n => ({ ...n, read: true }));
                              updateNotifications(updated);
                            }}
                            className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-[400px] overflow-y-auto scrollbar-none">
                        {notifications.length === 0 ? (
                          <div className="p-12 text-center">
                            <Bell className="h-8 w-8 text-muted mx-auto mb-4" />
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">No notifications</p>
                          </div>
                        ) : (
                          notifications.map((notif, i) => (
                            <div 
                              key={notif.id} 
                              className={cn(
                                "p-6 border-b border-border hover:bg-accent transition-colors cursor-pointer group",
                                !notif.read && "bg-primary/5 border-l-4 border-l-primary"
                              )}
                              onClick={() => {
                                const updated = notifications.map(n => n.id === notif.id ? { ...n, read: true } : n);
                                updateNotifications(updated);
                              }}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-black text-foreground uppercase tracking-tight">{notif.title}</span>
                                <span className="text-[8px] font-bold text-muted-foreground uppercase">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">{notif.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="p-4 bg-accent border-t border-border text-center">
                        <Link to="/admin/dashboard" className="text-[9px] font-black text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors">View All Activity</Link>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-card rounded-2xl border border-border shadow-sm">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-foreground uppercase tracking-widest">{adminRole === 'admin' ? 'Administrator' : 'Staff'}</span>
                <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-tighter flex items-center gap-1.5">
                  <span className="h-1 w-1 bg-emerald-500 rounded-full" />
                  Live
                </span>
              </div>
              <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-black uppercase shadow-md shadow-primary/20">
                {adminRole ? adminRole[0] : 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 lg:p-10 flex-1">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </main>

        {/* Footer Info Bar */}
        <footer className="h-12 border-t border-border flex items-center px-8 justify-between text-[9px] font-bold text-muted-foreground uppercase tracking-widest bg-card/50 backdrop-blur-sm">
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
