import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Wrench, Loader2, Mail, Phone, ArrowRight, ShieldCheck, User, KeyRound, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/context/DataContext";
import { getFirebaseAuth, googleProvider, facebookProvider, getFirebaseErrorMessage } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult, signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { motion, AnimatePresence } from "motion/react";
import { Facebook } from "lucide-react";

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

export function Signup() {
  const navigate = useNavigate();
  const { apiKeys, uiSettings, signup } = useData();
  const { userLogin } = uiSettings;
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);
  const [isPhoneLoading, setIsPhoneLoading] = useState(false);
  const [showPhoneOtp, setShowPhoneOtp] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user" as "user" | "mechanic",
    referralCode: "",
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
      if (formData.name && formData.email && formData.password.length >= 6 && formData.phone) {
        await signup(formData.email, formData.password, formData.name, formData.phone, formData.role, formData.referralCode);
        toast.success("Successfully signed up!");
        navigate("/");
      } else {
        toast.error("Please fill all fields correctly (password min 6 characters).");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(getFirebaseErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    if (!apiKeys.firebaseApiKey || !apiKeys.firebaseProjectId) {
      toast.error("Firebase is not configured in Admin Panel.");
      return;
    }
    setIsGoogleLoading(true);
    try {
      const auth = getFirebaseAuth(apiKeys);
      await signInWithPopup(auth, googleProvider);
      toast.success("Successfully verified email with Google!");
      navigate("/");
    } catch (error: any) {
      console.error(error);
      toast.error(getFirebaseErrorMessage(error));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    if (!apiKeys.firebaseApiKey || !apiKeys.firebaseProjectId) {
      toast.error("Firebase is not configured in Admin Panel.");
      return;
    }
    setIsFacebookLoading(true);
    try {
      const auth = getFirebaseAuth(apiKeys);
      await signInWithPopup(auth, facebookProvider);
      toast.success("Successfully signed up with Facebook!");
      navigate("/");
    } catch (error: any) {
      console.error(error);
      toast.error(getFirebaseErrorMessage(error));
    } finally {
      setIsFacebookLoading(false);
    }
  };

  const handlePhoneSignup = async () => {
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
      toast.success("Successfully verified phone number!");
      navigate("/");
    } catch (error: any) {
      console.error(error);
      toast.error(getFirebaseErrorMessage(error));
    } finally {
      setIsPhoneLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4 transition-colors duration-300">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-2 font-bold text-3xl text-foreground mb-8 group">
              <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <span className="tracking-tighter">CarMechs</span>
            </Link>
            <h2 className="text-3xl font-bold text-foreground tracking-tight">Join the Club</h2>
            <p className="mt-3 text-muted-foreground">
              Create your account to start your journey
            </p>
          </div>
          
          <AnimatePresence mode="wait">
            {!showPhoneOtp ? (
              <motion.div
                key="signup-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="flex p-1 bg-accent/50 rounded-2xl mb-8">
                  <button
                    onClick={() => setFormData({ ...formData, role: 'user' })}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${formData.role === 'user' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Car Owner
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, role: 'mechanic' })}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${formData.role === 'mechanic' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Mechanic
                  </button>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-accent/50 border border-border rounded-2xl pl-12 pr-4 py-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="Full Name"
                      />
                    </div>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-accent/50 border border-border rounded-2xl pl-12 pr-4 py-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="Email address"
                      />
                    </div>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-accent/50 border border-border rounded-2xl pl-12 pr-4 py-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="Phone Number"
                      />
                    </div>
                    <div className="relative group">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full bg-accent/50 border border-border rounded-2xl pl-12 pr-4 py-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="Create Password"
                      />
                    </div>
                    <div className="relative group">
                      <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <input
                        type="text"
                        value={formData.referralCode}
                        onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                        className="w-full bg-accent/50 border border-border rounded-2xl pl-12 pr-4 py-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="Referral Code (Optional)"
                      />
                    </div>
                  </div>

                  <Button 
                    className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-lg shadow-primary/20 group"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        Create Account
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </Button>
                </form>

                <div className="mt-10">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <span className="relative px-4 bg-card text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      Quick Verification
                    </span>
                  </div>

                  <div className="mt-8 space-y-4">
                    {userLogin.showGoogleLogin && (
                      <Button 
                        variant="outline" 
                        onClick={handleGoogleSignup}
                        disabled={isGoogleLoading}
                        className="w-full h-14 rounded-2xl bg-card border-border hover:bg-accent text-foreground font-bold"
                      >
                        {isGoogleLoading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <div className="flex items-center justify-center gap-3">
                            <Mail className="h-5 w-5 text-primary" />
                            Verify with Google
                          </div>
                        )}
                      </Button>
                    )}

                    {userLogin.showFacebookLogin && (
                      <Button 
                        variant="outline" 
                        onClick={handleFacebookLogin}
                        disabled={isFacebookLoading}
                        className="w-full h-14 rounded-2xl bg-[#1877F2] border-[#1877F2] hover:opacity-90 text-white font-bold"
                      >
                        {isFacebookLoading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <div className="flex items-center justify-center gap-3">
                            <Facebook className="h-5 w-5 fill-white" />
                            Verify with Facebook
                          </div>
                        )}
                      </Button>
                    )}
                    
                    {userLogin.showPhoneLogin && (
                      <div className="flex gap-3">
                        <input
                          type="tel"
                          placeholder="+1 234 567 890"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="flex-1 bg-accent/50 border border-border rounded-2xl px-4 py-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                        <Button 
                          variant="outline" 
                          onClick={handlePhoneSignup}
                          disabled={isPhoneLoading || !phoneNumber}
                          className="h-14 px-6 rounded-2xl bg-card border-border hover:bg-accent text-foreground"
                        >
                          {isPhoneLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Phone className="h-5 w-5 text-emerald-500" />
                          )}
                        </Button>
                      </div>
                    )}
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
                  <h3 className="text-xl font-bold text-foreground mb-2">Verify Phone</h3>
                  <p className="text-muted-foreground text-sm">
                    Enter the code sent to <span className="text-foreground font-mono">{phoneNumber}</span>
                  </p>
                </div>

                <div className="space-y-6">
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full bg-accent/50 border border-border rounded-2xl px-4 py-6 text-center text-3xl font-mono tracking-[0.5em] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
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
                      "Verify & Join"
                    )}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full h-12 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent"
                    onClick={() => setShowPhoneOtp(false)}
                  >
                    Back to Sign up
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="mt-12 text-center">
            <p className="text-muted-foreground font-medium">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-bold hover:opacity-80 transition-colors">
                Sign In
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
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-bold text-sm uppercase tracking-widest">
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
