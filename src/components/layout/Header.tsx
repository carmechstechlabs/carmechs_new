import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wrench, Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useData } from "@/context/DataContext";
import { toast } from "sonner";

export function Header() {
  const { settings, currentUser, logout, uiSettings } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const publishedPages = uiSettings.pages.filter(p => p.isPublished && p.slug !== 'home');

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <header 
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled ? "glass py-3 shadow-lg" : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt={settings.logoText} className="h-6 w-6 object-contain brightness-0 invert" />
            ) : (
              <Wrench className="h-5 w-5 text-white" />
            )}
          </div>
          <span className={cn(
            "font-black text-xl uppercase tracking-tighter transition-colors",
            scrolled ? "text-slate-900" : "text-white"
          )}>
            {settings.logoText}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={cn(
          "hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest",
          scrolled ? "text-slate-600" : "text-white/80"
        )}>
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="/services" className="hover:text-primary transition-colors">Services</Link>
          {publishedPages.map(page => (
            <Link key={page.id} to={`/p/${page.slug}`} className="hover:text-primary transition-colors">
              {page.title}
            </Link>
          ))}
          <Link to="/about" className="hover:text-primary transition-colors">About</Link>
          <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <Link to="/profile">
                <Button variant="ghost" size="sm" className={cn(
                  "flex items-center gap-2 rounded-xl font-bold border-none",
                  scrolled ? "text-slate-700 hover:bg-slate-100" : "text-white hover:bg-white/10"
                )}>
                  <div className="h-6 w-6 bg-primary/20 rounded-lg flex items-center justify-center">
                    <User className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-xs">{currentUser.displayName || currentUser.email?.split('@')[0] || "User"}</span>
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                className={cn(
                  "rounded-xl h-8 w-8",
                  scrolled ? "text-slate-400 hover:text-red-500" : "text-white/60 hover:text-white"
                )}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="sm" className={cn(
                "rounded-xl font-bold text-xs uppercase tracking-widest px-6",
                scrolled ? "text-slate-700" : "text-white hover:bg-white/10"
              )}>
                Log in
              </Button>
            </Link>
          )}
          <Link to="/book">
            <Button size="sm" className="rounded-xl font-black uppercase tracking-widest text-[10px] px-6 h-10 shadow-lg shadow-primary/20">
              Book Now
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={cn(
            "md:hidden p-2 rounded-xl transition-colors",
            scrolled ? "text-slate-900 hover:bg-slate-100" : "text-white hover:bg-white/10"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 w-full glass shadow-2xl overflow-hidden"
          >
            <div className="container mx-auto flex flex-col gap-1 p-4">
              {[
                { to: "/", label: "Home" },
                { to: "/services", label: "Services" },
                ...publishedPages.map(p => ({ to: `/p/${p.slug}`, label: p.title })),
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact" }
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col gap-3">
                {currentUser ? (
                  <>
                    <Link
                      to="/profile"
                      className="px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-600 hover:text-primary rounded-xl flex items-center gap-3"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-4 w-4" /> My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-3 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-xl flex items-center gap-3 text-left"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full rounded-xl font-bold uppercase tracking-widest text-xs h-12">
                      Log in
                    </Button>
                  </Link>
                )}
                <Link to="/book" onClick={() => setIsOpen(false)}>
                  <Button className="w-full rounded-xl font-black uppercase tracking-widest text-xs h-12 shadow-xl shadow-primary/20">
                    Book Service
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

import { useEffect } from "react";
import { cn } from "@/lib/utils";
