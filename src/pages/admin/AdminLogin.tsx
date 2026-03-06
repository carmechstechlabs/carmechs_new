import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Loader2, Eye, EyeOff, ArrowLeft, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/context/DataContext";
import { motion } from "motion/react";
import { supabase } from "@/services/supabaseService";

export function AdminLogin() {
  const navigate = useNavigate();
  const { loginAdmin, isAdminLoggedIn, settings, uiSettings, users, isLoading: isDataLoading } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const adminUi = uiSettings.adminLogin || {
    loginTitle: "Terminal 01",
    loginSubtitle: "Security Clearance Required",
    loginBgColor: "#050505",
    loginAccentColor: "#fc9c0a",
    loginTerminalId: "ID_REQ_001"
  };

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
      // Check if data is still loading
      if (isDataLoading) {
        toast.error("System is still initializing. Please wait a few seconds and try again.");
        setIsLoading(false);
        return;
      }

      // Check if Supabase is initialized
      if (!supabase) {
        toast.error("Database Error: Supabase client is not initialized. Please check your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables in Vercel.");
        setIsLoading(false);
        return;
      }

      // Simulate network delay for security
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const identifier = formData.username.trim().toLowerCase();
      const password = formData.password;

      // Check if users are loaded
      if (users.length === 0) {
        toast.error("Database Connection Error: No users found. Please check your Supabase configuration and ensure you've run the migration.");
        setIsLoading(false);
        return;
      }

      // Find user in the users list who is an admin or viewer
      const user = users.find(u => 
        (u.email.toLowerCase() === identifier || u.name.toLowerCase() === identifier) && 
        u.password === password &&
        (u.role === 'admin' || u.role === 'viewer')
      );

      if (user) {
        loginAdmin(user.role);
        toast.success(`Identity Verified: ${user.name}. Access Granted.`);
        navigate("/admin/dashboard");
      } else {
        // Check if it's a password mismatch or role issue
        const foundUser = users.find(u => u.email.toLowerCase() === identifier || u.name.toLowerCase() === identifier);
        if (foundUser) {
          if (foundUser.password !== password) {
            toast.error("Authentication Failed: Invalid password.");
          } else if (foundUser.role === 'user') {
            toast.error("Authentication Failed: Insufficient permissions. This account is not an administrator.");
          } else {
            toast.error("Authentication Failed: Invalid credentials.");
          }
        } else {
          toast.error("Authentication Failed: User not found.");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("System Error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans bg-white">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full relative z-10"
      >
        {/* Header Section */}
        <div className="mb-12 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="relative p-1 rounded-3xl bg-slate-50 border border-slate-100 shadow-2xl">
              <div className="bg-white rounded-[1.4rem] p-5 border border-slate-50 shadow-inner">
                {(adminUi.loginLogoUrl || settings.logoUrl) ? (
                  <img src={adminUi.loginLogoUrl || settings.logoUrl} alt="Logo" className="h-12 w-12 object-contain" />
                ) : (
                  <ShieldCheck className="h-10 w-10 text-primary" />
                )}
              </div>
            </div>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.05em" }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-3"
          >
            Admin <span className="text-primary">Portal</span>
          </motion.h2>
          
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-slate-100" />
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.3em]">
                Authorized Personnel Only
              </p>
              <div className="h-px w-8 bg-slate-100" />
            </div>
            
            {/* Connection Status Badge */}
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${supabase ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-primary/5 border-primary/10 text-primary'}`}>
              <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${supabase ? 'bg-emerald-500' : 'bg-primary'}`} />
              <span className="text-[8px] font-black uppercase tracking-widest">
                Database: {supabase ? 'Connected' : 'Configuration Missing'}
              </span>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Username / Email</label>
                <div className="relative group">
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary/50 transition-all font-bold text-sm"
                    placeholder="Enter your username"
                  />
                </div>
              </div>
 
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                  <button 
                    type="button"
                    onClick={() => toast.info("Please contact the system administrator to reset your password.")}
                    className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary/50 transition-all font-bold text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
 
            <Button 
              className="w-full h-14 bg-primary text-white font-black uppercase tracking-widest rounded-xl transition-all duration-300 shadow-lg shadow-primary/20 hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-xs">Verifying...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Lock className="h-3.5 w-3.5" />
                  <span className="text-xs">Login to Dashboard</span>
                </div>
              )}
            </Button>
          </form>
        </div>

        {/* Footer Info */}
        <div className="mt-8 flex flex-col items-center gap-6">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center max-w-xs">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Default Credentials</p>
            <p className="text-[10px] text-slate-600 font-bold">admin@carmechs.in / admin</p>
          </div>
          <Link to="/" className="text-[10px] text-slate-400 hover:text-primary uppercase font-bold tracking-[0.2em] transition-colors flex items-center gap-2 group">
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
            Back to Website
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
