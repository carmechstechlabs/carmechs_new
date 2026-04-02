import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Loader2, Eye, EyeOff, ArrowLeft, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/context/DataContext";
import { motion } from "motion/react";

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
    loginTitle: "Admin Portal",
    loginSubtitle: "CarMechs Management System",
    loginBgColor: "#f8fafc",
    loginAccentColor: "#e31e24",
    loginTerminalId: "ADMIN_MAIN"
  };

  // Redirect if already logged in
  useEffect(() => {
    if (isAdminLoggedIn) {
      navigate("/admin/dashboard");
    }
  }, [isAdminLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleSubmit triggered", formData);
    setIsLoading(true);

    try {
      // Check if data is still loading
      if (isDataLoading) {
        console.log("System still initializing, current users count:", users.length);
      }

      const identifier = formData.username.trim().toLowerCase();
      const password = formData.password;

      // Log for debugging
      console.log("Login attempt details:", { identifier, passwordLength: password.length });
      console.log("Available users list:", users.map(u => ({ email: u.email, role: u.role })));

      // Find user in the users list who is an admin or viewer
      const user = users.find(u => 
        (u.email.toLowerCase() === identifier || u.name.toLowerCase() === identifier) && 
        u.password === password &&
        (u.role === 'admin' || u.role === 'viewer')
      );

      if (user) {
        if (user.blocked) {
          toast.error("Authentication Failed: This administrative account has been suspended.");
          setIsLoading(false);
          return;
        }
        if (user.role === 'admin' || user.role === 'viewer') {
          loginAdmin(user.role);
          toast.success(`Identity Verified: ${user.name}. Access Granted.`);
          navigate("/admin/dashboard");
        }
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

  const [isResetMode, setIsResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate reset process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const user = users.find(u => u.email.toLowerCase() === resetEmail.trim().toLowerCase() && (u.role === 'admin' || u.role === 'viewer'));
      
      if (user) {
        toast.success("Password reset link sent to your email.");
        setIsResetMode(false);
      } else {
        toast.error("No administrative account found with this email.");
      }
    } catch (error) {
      toast.error("Failed to process request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isDarkBg = adminUi.loginBgColor === '#050505' || adminUi.loginBgColor === '#000000';

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans" style={{ backgroundColor: adminUi.loginBgColor }}>
      {/* Subtle Grid Background */}
      <div className={`absolute inset-0 opacity-[0.05] pointer-events-none ${isDarkBg ? 'invert-0' : 'invert'}`} 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full relative z-10"
      >
        {/* Header Section */}
        <div className="mb-10 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className={`relative p-1 rounded-3xl ${isDarkBg ? 'bg-white/5 border-white/10' : 'bg-slate-200/50 border-slate-200'} border shadow-2xl`}>
              <div className={`${isDarkBg ? 'bg-white/10 border-white/5' : 'bg-white border-slate-100'} rounded-[1.4rem] p-5 border shadow-inner`}>
                {(adminUi.loginLogoUrl || settings.logoUrl) ? (
                  <img src={adminUi.loginLogoUrl || settings.logoUrl} alt="Logo" className="h-12 w-12 object-contain" />
                ) : (
                  <ShieldCheck className="h-10 w-10" style={{ color: adminUi.loginAccentColor }} />
                )}
              </div>
            </div>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.02em" }}
            transition={{ delay: 0.4, duration: 1 }}
            className={`text-4xl font-display font-black uppercase tracking-tight mb-3 ${isDarkBg ? 'text-white' : 'text-slate-900'}`}
          >
            {isResetMode ? "Reset Password" : (adminUi.loginTitle || "Admin Portal").split(' ')[0]} 
            {!isResetMode && <span style={{ color: adminUi.loginAccentColor }}> {(adminUi.loginTitle || "Admin Portal").split(' ').slice(1).join(' ') || 'Portal'}</span>}
          </motion.h2>
          
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center gap-3">
              <div className={`h-px w-8 ${isDarkBg ? 'bg-white/10' : 'bg-slate-200'}`} />
              <p className={`text-[10px] uppercase font-bold tracking-[0.3em] ${isDarkBg ? 'text-white/40' : 'text-slate-400'}`}>
                {isResetMode ? "Enter your email to receive a reset link" : adminUi.loginSubtitle}
              </p>
              <div className={`h-px w-8 ${isDarkBg ? 'bg-white/10' : 'bg-slate-200'}`} />
            </div>
            
            {/* Connection Status Badge */}
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border bg-emerald-500/10 border-emerald-500/20 text-emerald-500`}>
              <div className={`h-1.5 w-1.5 rounded-full animate-pulse bg-emerald-500`} />
              <span className="text-[8px] font-black uppercase tracking-widest">
                Terminal: {adminUi.loginTerminalId} | System: Online
              </span>
            </div>
          </div>
        </div>

        {/* Login/Reset Card */}
        <div className={`${isDarkBg ? 'bg-white/5 border-white/10 backdrop-blur-xl' : 'bg-white border-slate-200 shadow-xl'} border rounded-[2rem] p-8 relative overflow-hidden group`}>
          {!isResetMode ? (
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className={`text-[9px] font-black uppercase tracking-widest px-1 ${isDarkBg ? 'text-white/40' : 'text-slate-400'}`}>Username / Email</label>
                  <div className="relative group">
                    <input
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className={`w-full border rounded-xl px-5 py-4 transition-all font-bold text-sm ${isDarkBg ? 'bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-white/30' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary/30 focus:bg-white'}`}
                      placeholder="Enter your username"
                    />
                  </div>
                </div>
   
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <label className={`text-[9px] font-black uppercase tracking-widest ${isDarkBg ? 'text-white/40' : 'text-slate-400'}`}>Password</label>
                    <button 
                      type="button"
                      onClick={() => setIsResetMode(true)}
                      className="text-[9px] font-black uppercase tracking-widest hover:underline"
                      style={{ color: adminUi.loginAccentColor }}
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
                      className={`w-full border rounded-xl px-5 py-4 transition-all font-bold text-sm ${isDarkBg ? 'bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-white/30' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary/30 focus:bg-white'}`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${isDarkBg ? 'text-white/20 hover:text-white' : 'text-slate-300 hover:text-slate-600'}`}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
   
              <Button 
                type="submit"
                className="w-full h-14 text-white font-black uppercase tracking-widest rounded-xl transition-all duration-300 shadow-lg border-none"
                style={{ backgroundColor: adminUi.loginAccentColor }}
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
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6 relative z-10">
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className={`text-[9px] font-black uppercase tracking-widest px-1 ${isDarkBg ? 'text-white/40' : 'text-slate-400'}`}>Email Address</label>
                  <div className="relative group">
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className={`w-full border rounded-xl px-5 py-4 transition-all font-bold text-sm ${isDarkBg ? 'bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-white/30' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary/30 focus:bg-white'}`}
                      placeholder="Enter your admin email"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  type="submit"
                  className="w-full h-14 text-white font-black uppercase tracking-widest rounded-xl transition-all duration-300 shadow-lg border-none"
                  style={{ backgroundColor: adminUi.loginAccentColor }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-xs">Processing...</span>
                    </div>
                  ) : (
                    <span className="text-xs">Send Reset Link</span>
                  )}
                </Button>
                
                <button 
                  type="button"
                  onClick={() => setIsResetMode(false)}
                  className={`w-full text-[10px] uppercase font-bold tracking-widest ${isDarkBg ? 'text-white/40 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 flex flex-col items-center gap-6">
          <div className={`${isDarkBg ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'} border rounded-2xl p-4 text-center max-w-xs`}>
            <p className={`text-[9px] font-black uppercase tracking-widest mb-2 ${isDarkBg ? 'text-white/20' : 'text-slate-400'}`}>Default Credentials</p>
            <p className={`text-[10px] font-bold ${isDarkBg ? 'text-white/60' : 'text-slate-600'}`}>carmechstechlabs@gmail.com / Admin@270389</p>
          </div>
          <Link to="/" className={`text-[10px] uppercase font-bold tracking-[0.2em] transition-colors flex items-center gap-2 group ${isDarkBg ? 'text-white/40 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
            Back to Website
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
