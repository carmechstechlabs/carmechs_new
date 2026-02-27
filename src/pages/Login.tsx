import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Wrench, Loader2, Mail, Phone, ArrowRight, ShieldCheck, Sparkles, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/context/DataContext";
import { getFirebaseAuth, googleProvider, getFirebaseErrorMessage } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult, signInWithPopup } from "firebase/auth";
import { motion, AnimatePresence } from "motion/react";

export function Login() {
  const navigate = useNavigate();
  const { apiKeys } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isPhoneLoading, setIsPhoneLoading] = useState(false);
  const [showPhoneOtp, setShowPhoneOtp] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (apiKeys.firebaseApiKey && apiKeys.firebaseProjectId && !window.recaptchaVerifier) {
      try {
        const auth = getFirebaseAuth(apiKeys);
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
          'callback': () => {
            // reCAPTCHA solved
          }
        });
      } catch (e) {
        console.error("Failed to initialize recaptcha", e);
      }
    }
  }, [apiKeys]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      if (formData.email && formData.password.length >= 6) {
        toast.success("Successfully signed in!");
        navigate("/");
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!apiKeys.firebaseApiKey || !apiKeys.firebaseProjectId) {
      toast.error("Firebase is not configured in Admin Panel.");
      return;
    }
    setIsGoogleLoading(true);
    try {
      const auth = getFirebaseAuth(apiKeys);
      await signInWithPopup(auth, googleProvider);
      toast.success("Successfully signed in with Google!");
      navigate("/");
    } catch (error: any) {
      console.error(error);
      toast.error(getFirebaseErrorMessage(error));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handlePhoneLogin = async () => {
    if (!apiKeys.firebaseApiKey || !apiKeys.firebaseProjectId) {
      toast.error("Firebase is not configured in Admin Panel.");
      return;
    }
    
    if (!phoneNumber) {
      toast.error("Please enter a phone number");
      return;
    }

    setIsPhoneLoading(true);
    try {
      const auth = getFirebaseAuth(apiKeys);
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setShowPhoneOtp(true);
      toast.success("OTP sent to your phone!");
    } catch (error: any) {
      console.error(error);
      toast.error(getFirebaseErrorMessage(error));
    } finally {
      setIsPhoneLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || !confirmationResult) return;
    
    setIsPhoneLoading(true);
    try {
      await confirmationResult.confirm(otpCode);
      toast.success("Successfully signed in with Phone!");
      navigate("/");
    } catch (error: any) {
      console.error(error);
      toast.error(getFirebaseErrorMessage(error));
    } finally {
      setIsPhoneLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden px-4">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="glass-dark border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-2 font-black text-3xl text-white mb-8 group">
              <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <span className="tracking-tighter">CarMechs</span>
            </Link>
            <h2 className="text-3xl font-bold text-white tracking-tight">Welcome back</h2>
            <p className="mt-3 text-slate-400">
              Enter your details to access your terminal
            </p>
          </div>
          
          <AnimatePresence mode="wait">
            {!showPhoneOtp ? (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        placeholder="Email address"
                      />
                    </div>
                    <div className="relative group">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                      <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        placeholder="Password"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary" />
                      <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
                    </label>
                    <a href="#" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">
                      Forgot password?
                    </a>
                  </div>

                  <Button 
                    className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-lg shadow-primary/20 group"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        Sign In
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </Button>
                </form>

                <div className="mt-10">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10" />
                    </div>
                    <span className="relative px-4 bg-[#0d0d0d] text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Secure Access
                    </span>
                  </div>

                  <div className="mt-8 space-y-4">
                    <Button 
                      variant="outline" 
                      onClick={handleGoogleLogin}
                      disabled={isGoogleLoading}
                      className="w-full h-14 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold"
                    >
                      {isGoogleLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <div className="flex items-center justify-center gap-3">
                          <Mail className="h-5 w-5 text-red-500" />
                          Continue with Google
                        </div>
                      )}
                    </Button>
                    
                    <div className="flex gap-3">
                      <input
                        type="tel"
                        placeholder="+1 234 567 890"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      />
                      <Button 
                        variant="outline" 
                        onClick={handlePhoneLogin}
                        disabled={isPhoneLoading || !phoneNumber}
                        className="h-14 px-6 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 text-white"
                      >
                        {isPhoneLoading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Phone className="h-5 w-5 text-emerald-500" />
                        )}
                      </Button>
                    </div>
                    <div id="recaptcha-container"></div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="otp-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <div className="h-16 w-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck className="h-8 w-8 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Verify Identity</h3>
                  <p className="text-slate-400 text-sm">
                    Enter the code sent to <span className="text-white font-mono">{phoneNumber}</span>
                  </p>
                </div>

                <div className="space-y-6">
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-6 text-center text-3xl font-mono tracking-[0.5em] text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="000000"
                    maxLength={6}
                  />
                  
                  <Button 
                    className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-lg shadow-primary/20"
                    onClick={handleVerifyOtp}
                    disabled={isPhoneLoading || !otpCode}
                  >
                    {isPhoneLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Verify & Access"
                    )}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full h-12 rounded-xl text-slate-400 hover:text-white hover:bg-white/5"
                    onClick={() => setShowPhoneOtp(false)}
                  >
                    Back to login
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="mt-12 text-center">
            <p className="text-slate-500 font-medium">
              New to CarMechs?{" "}
              <Link to="/signup" className="text-primary font-bold hover:text-primary/80 transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors font-bold text-sm uppercase tracking-widest">
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
