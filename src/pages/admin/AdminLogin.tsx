import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Loader2, Eye, EyeOff, ArrowLeft, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/context/DataContext";
import { motion } from "motion/react";

export function AdminLogin() {
  const navigate = useNavigate();
  const { loginAdmin, isAdminLoggedIn, settings, uiSettings, users } = useData();
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
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const identifier = formData.username.trim().toLowerCase();
      const password = formData.password;

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
        toast.error("Authentication Failed. Invalid Credentials or Insufficient Permissions.");
      }
    } catch (error) {
      toast.error("System Error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans" style={{ backgroundColor: adminUi.loginBgColor }}>
      {/* Technical Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      {/* Atmospheric Glows */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] rounded-full blur-[120px] opacity-30 animate-pulse" style={{ backgroundColor: adminUi.loginAccentColor }} />
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] opacity-20" />

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
            <div className="relative p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent border border-white/5 shadow-2xl">
              <div className="bg-[#0A0A0A] rounded-[1.4rem] p-5 border border-white/5">
                {(adminUi.loginLogoUrl || settings.logoUrl) ? (
                  <img src={adminUi.loginLogoUrl || settings.logoUrl} alt="Logo" className="h-12 w-12 object-contain grayscale brightness-200" />
                ) : (
                  <ShieldCheck className="h-10 w-10 text-white opacity-80" />
                )}
              </div>
              {/* Scanning Line Animation */}
              <motion.div 
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-px blur-[2px] z-20"
                style={{ backgroundColor: adminUi.loginAccentColor }}
              />
            </div>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.05em" }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-4xl font-black text-white uppercase tracking-tighter mb-3"
          >
            {adminUi.loginTitle.split(' ')[0]} <span style={{ color: adminUi.loginAccentColor }}>{adminUi.loginTitle.split(' ').slice(1).join(' ')}</span>
          </motion.h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-white/10" />
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.3em]">
              {adminUi.loginSubtitle}
            </p>
            <div className="h-px w-8 bg-white/10" />
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-8 shadow-2xl backdrop-blur-md relative overflow-hidden group">
          {/* Subtle Corner Accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/10 rounded-tl-[2rem]" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/10 rounded-tr-[2rem]" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/10 rounded-bl-[2rem]" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/10 rounded-br-[2rem]" />

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">User Identifier</label>
                  <span className="text-[8px] font-mono" style={{ color: `${adminUi.loginAccentColor}80` }}>{adminUi.loginTerminalId}</span>
                </div>
                <div className="relative group">
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4 text-white placeholder-slate-700 focus:outline-none transition-all font-mono text-sm"
                    style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                    placeholder="ADMIN_ID"
                    onFocus={(e) => e.target.style.borderColor = adminUi.loginAccentColor}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.05)'}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Access Key</label>
                  <span className="text-[8px] font-mono" style={{ color: `${adminUi.loginAccentColor}80` }}>SEC_AUTH_002</span>
                </div>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4 text-white placeholder-slate-700 focus:outline-none transition-all font-mono text-sm"
                    style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                    placeholder="••••••••"
                    onFocus={(e) => e.target.style.borderColor = adminUi.loginAccentColor}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.05)'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <Button 
              className="w-full h-14 bg-white text-black font-black uppercase tracking-widest rounded-xl transition-all duration-300 shadow-xl shadow-white/5 group"
              style={{ 
                backgroundColor: 'white',
                color: 'black'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = adminUi.loginAccentColor;
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = 'black';
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-xs">Decrypting...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Lock className="h-3.5 w-3.5" />
                  <span className="text-xs">Initialize Session</span>
                </div>
              )}
            </Button>
          </form>
        </div>

        {/* Footer Info */}
        <div className="mt-8 flex flex-col items-center gap-6">
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center">
              <span className="text-[8px] text-slate-600 uppercase font-bold tracking-tighter">Status</span>
              <span className="text-[10px] text-emerald-500 font-mono flex items-center gap-1.5">
                <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                Operational
              </span>
            </div>
            <div className="w-px h-6 bg-white/5" />
            <div className="flex flex-col items-center">
              <span className="text-[8px] text-slate-600 uppercase font-bold tracking-tighter">Encryption</span>
              <span className="text-[10px] text-slate-400 font-mono">AES-256</span>
            </div>
            <div className="w-px h-6 bg-white/5" />
            <div className="flex flex-col items-center">
              <span className="text-[8px] text-slate-600 uppercase font-bold tracking-tighter">Node</span>
              <span className="text-[10px] text-slate-400 font-mono">v18.2.0</span>
            </div>
          </div>

          <Link to="/" className="text-[10px] text-slate-500 hover:text-primary uppercase font-bold tracking-[0.2em] transition-colors flex items-center gap-2 group">
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
            Abort & Return
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
