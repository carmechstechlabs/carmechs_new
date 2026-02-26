import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Loader2, Eye, EyeOff, ArrowLeft, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/context/DataContext";
import { motion } from "motion/react";

export function AdminLogin() {
  const navigate = useNavigate();
  const { loginAdmin, isAdminLoggedIn, settings } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // Redirect if already logged in
  useEffect(() => {
    if (isAdminLoggedIn) {
      navigate("/admin/dashboard");
    }
  }, [isAdminLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call with a bit more delay for realism
      await new Promise((resolve) => setTimeout(resolve, 1200));
      
      // Mock validation (admin/admin or viewer/viewer)
      const username = formData.username.trim().toLowerCase();
      const password = formData.password;

      if (username === "admin" && password === "admin") {
        loginAdmin('admin');
        toast.success("Access granted. Welcome, Administrator.");
        navigate("/admin/dashboard");
      } else if (username === "viewer" && password === "viewer") {
        loginAdmin('viewer');
        toast.success("Access granted. Welcome, Viewer.");
        navigate("/admin/dashboard");
      } else {
        toast.error("Invalid credentials. Access denied.");
      }
    } catch (error) {
      toast.error("An error occurred during authentication.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-slate-800 relative z-10"
      >
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Website
          </Link>
          
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 mb-6 group">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="h-12 w-12 object-contain" />
            ) : (
              <ShieldCheck className="h-10 w-10 text-primary group-hover:scale-110 transition-transform" />
            )}
          </div>
          
          <h2 className="text-3xl font-bold text-white tracking-tight">Admin Portal</h2>
          <p className="mt-2 text-sm text-slate-400">
            Enter your credentials to manage {settings.logoText || "CarMechs"}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="username" className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="block w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all sm:text-sm"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all sm:text-sm"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button 
              className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]" 
              size="lg" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Secure Login
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="text-center pt-4 space-y-4">
          <div className="p-3 bg-slate-800/30 rounded-xl border border-slate-700/50">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Demo Credentials</p>
            <p className="text-xs text-slate-400">User: <span className="text-primary font-mono">admin</span> / Pass: <span className="text-primary font-mono">admin</span></p>
          </div>
          <p className="text-xs text-slate-500">
            Authorized access only. All activities are logged.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
