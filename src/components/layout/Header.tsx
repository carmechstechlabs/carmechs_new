import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wrench, Menu, X, User, LogOut, Shield, Zap, MapPin, Search, Check, ChevronDown, Phone, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useData } from "@/context/DataContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Header() {
  const { settings, currentUser, logout, uiSettings, locations } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (locations.length > 0 && !selectedLocation) {
      const popular = locations.find(l => l.isPopular);
      setSelectedLocation(popular ? popular.city : locations[0].city);
    }
  }, [locations, selectedLocation]);

  const filteredLocations = (locations || []).filter(loc => 
    loc.name.toLowerCase().includes(locationSearch.toLowerCase()) ||
    loc.city.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const popularLocations = (locations || []).filter(loc => loc.isPopular);
  const otherLocations = (locations || []).filter(loc => !loc.isPopular);

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
        scrolled ? "bg-white py-2 border-b border-slate-100 shadow-sm" : "bg-white py-4 border-b border-slate-50"
      )}
    >
      {/* Top Bar for Contact Info */}
      {!scrolled && (
        <div className="hidden lg:block bg-slate-900 py-2 text-white border-b border-white/5">
          <div className="container mx-auto px-8 flex justify-between items-center">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 text-primary" />
                <span className="text-[9px] font-black uppercase tracking-widest">{settings.phone || "+91 98765 43210"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-primary" />
                <span className="text-[9px] font-black uppercase tracking-widest lowercase">{settings.email || "support@carmechs.com"}</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 text-primary" />
                <span className="text-[9px] font-black uppercase tracking-widest">{settings.address || "New Delhi, India"}</span>
              </div>
              <div className="h-3 w-px bg-white/10" />
              <div className="flex items-center gap-3">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40">Follow Us</span>
                <div className="flex gap-2">
                  <div className="h-4 w-4 rounded bg-white/5 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                    <Zap className="h-2 w-2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="container mx-auto flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className={cn(
              "rounded-lg flex items-center justify-center transition-transform group-hover:scale-105",
              settings.logoUrl ? "h-12 w-auto" : "h-10 w-10 bg-primary shadow-lg shadow-primary/20"
            )}>
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.logoText} className="h-full w-auto object-contain" />
              ) : (
                <Wrench className="h-5 w-5 text-white" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl uppercase tracking-tighter leading-none text-slate-900">
                {settings.logoText || "CarMechs"}
              </span>
              <span className="text-[7px] font-bold text-primary uppercase tracking-[0.2em] mt-0.5">Automotive Excellence</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/services" className="hover:text-primary transition-colors">Services</Link>
            <a href="#brands" className="hover:text-primary transition-colors">Brands</a>
            <a href="#locations" className="hover:text-primary transition-colors">Locations</a>
            {publishedPages.map(page => (
              <Link key={page.id} to={`/p/${page.slug}`} className="hover:text-primary transition-colors">
                {page.title}
              </Link>
            ))}
            <Link to="/about" className="hover:text-primary transition-colors">About</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100 mr-2 hover:bg-slate-100 transition-colors group">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider group-hover:text-primary transition-colors">{selectedLocation || "Select City"}</span>
                <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-primary transition-colors" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 rounded-2xl shadow-2xl border-slate-100" align="end">
              <div className="p-4 border-b border-slate-50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search your city" 
                    className="w-full h-10 pl-10 pr-4 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                  />
                </div>
              </div>
              <ScrollArea className="h-[300px]">
                <div className="p-2">
                  {locationSearch === "" && popularLocations.length > 0 && (
                    <>
                      <div className="px-3 py-2 text-[9px] font-black uppercase tracking-widest text-slate-400">Popular Cities</div>
                      <div className="grid grid-cols-2 gap-1 mb-4">
                        {popularLocations.map((loc) => (
                          <button
                            key={loc.id}
                            onClick={() => {
                              setSelectedLocation(loc.city);
                              setLocationSearch("");
                            }}
                            className={cn(
                              "flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-bold transition-all text-left",
                              selectedLocation === loc.city ? "bg-primary/10 text-primary" : "hover:bg-slate-50 text-slate-600"
                            )}
                          >
                            {loc.city}
                            {selectedLocation === loc.city && <Check className="h-3 w-3" />}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                  
                  <div className="px-3 py-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                    {locationSearch === "" ? "Other Cities" : "Search Results"}
                  </div>
                  <div className="space-y-1">
                    {(locationSearch === "" ? otherLocations : filteredLocations).map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => {
                          setSelectedLocation(loc.city);
                          setLocationSearch("");
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-bold transition-all text-left",
                          selectedLocation === loc.city ? "bg-primary/10 text-primary" : "hover:bg-slate-50 text-slate-600"
                        )}
                      >
                        <div className="flex flex-col">
                          <span>{loc.city}</span>
                          <span className="text-[8px] opacity-50">{loc.name}</span>
                        </div>
                        {selectedLocation === loc.city && <Check className="h-3 w-3" />}
                      </button>
                    ))}
                    {filteredLocations.length === 0 && (
                      <div className="px-3 py-8 text-center text-slate-400 text-xs font-bold">No cities found</div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>

          {currentUser ? (
            <div className="flex items-center gap-3">
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="flex items-center gap-2 rounded-xl font-bold bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-100 h-10">
                  <User className="h-4 w-4 text-slate-400" />
                  <span className="text-xs">{currentUser.displayName || currentUser.email?.split('@')[0] || "User"}</span>
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                className="rounded-xl h-10 w-10 text-slate-400 hover:text-primary hover:bg-primary/10"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="sm" className="rounded-xl font-bold text-xs px-6 h-10 text-slate-600 hover:text-primary hover:bg-primary/10">
                Login
              </Button>
            </Link>
          )}
          <Link to="/book">
            <Button size="sm" className="rounded-xl font-bold uppercase tracking-wider text-[10px] px-6 h-10 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 transition-all text-white border-none">
              Book Now
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-xl transition-all border border-slate-100 bg-slate-50 text-slate-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl overflow-hidden"
          >
            <div className="container mx-auto flex flex-col gap-1 p-4">
              {[
                { to: "/", label: "Home" },
                { to: "/services", label: "Services" },
                { to: "/#brands", label: "Brands" },
                { to: "/#locations", label: "Locations" },
                ...publishedPages.map(p => ({ to: `/p/${p.slug}`, label: p.title })),
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact" }
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3">
                {currentUser ? (
                  <>
                    <Link
                      to="/profile"
                      className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-primary rounded-xl flex items-center gap-3"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-4 w-4" /> My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary/10 rounded-xl flex items-center gap-3 text-left"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full rounded-xl font-bold uppercase tracking-wider text-[10px] h-12 bg-slate-50 text-slate-600 border-slate-100">
                      Login
                    </Button>
                  </Link>
                )}
                <Link to="/book" onClick={() => setIsOpen(false)}>
                  <Button className="w-full rounded-xl font-bold uppercase tracking-wider text-[10px] h-12 shadow-lg shadow-primary/20 bg-primary text-white border-none">
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
