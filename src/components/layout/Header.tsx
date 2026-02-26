import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wrench, Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useData } from "@/context/DataContext";
import { toast } from "sonner";

export function Header() {
  const { settings, currentUser, logout } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

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
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt={settings.logoText} className="h-8 w-auto object-contain" />
          ) : (
            <Wrench className="h-6 w-6" />
          )}
          <span>{settings.logoText}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="transition-colors hover:text-primary">
            Home
          </Link>
          <Link to="/services" className="transition-colors hover:text-primary">
            Services
          </Link>
          <Link to="/about" className="transition-colors hover:text-primary">
            About Us
          </Link>
          <Link to="/contact" className="transition-colors hover:text-primary">
            Contact
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{currentUser.displayName || currentUser.email?.split('@')[0] || "User"}</span>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} title="Logout">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
          )}
          <Link to="/book">
            <Button size="sm">Book Service</Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-white"
          >
            <div className="container mx-auto flex flex-col gap-4 p-4">
              <Link
                to="/"
                className="text-sm font-medium hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/services"
                className="text-sm font-medium hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/about"
                className="text-sm font-medium hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="text-sm font-medium hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              {currentUser && (
                <>
                  <Link
                    to="/profile"
                    className="text-sm font-medium hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-left hover:text-primary flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              )}
              <div className="flex flex-col gap-2 pt-4 border-t">
                {!currentUser && (
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Log in
                    </Button>
                  </Link>
                )}
                <Link to="/book" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">Book Service</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
