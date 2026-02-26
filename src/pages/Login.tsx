import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Wrench, Loader2, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/context/DataContext";
import { getFirebaseAuth, googleProvider, getFirebaseErrorMessage } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult, signInWithPopup } from "firebase/auth";

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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl text-primary mb-6">
            <Wrench className="h-8 w-8" />
            <span>CarMechs</span>
          </Link>
          <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-600">
            Please sign in to your account
          </p>
        </div>
        
        {!showPhoneOtp ? (
          <>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email-address" className="sr-only">Email address</label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="Password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-primary hover:text-primary/80">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <Button className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button 
                  variant="outline" 
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading}
                  className="w-full"
                >
                  {isGoogleLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4 text-red-500" />
                      Google
                    </>
                  )}
                </Button>
                
                <div className="flex gap-2">
                  <input
                    type="tel"
                    placeholder="+1234567890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                  <Button 
                    variant="outline" 
                    onClick={handlePhoneLogin}
                    disabled={isPhoneLoading || !phoneNumber}
                  >
                    {isPhoneLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Phone className="mr-2 h-4 w-4 text-green-500" />
                        Send OTP
                      </>
                    )}
                  </Button>
                </div>
                <div id="recaptcha-container"></div>
              </div>
            </div>
          </>
        ) : (
          <div className="mt-8 space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-slate-700 mb-1">
                Enter OTP sent to {phoneNumber}
              </label>
              <input
                id="otp"
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="123456"
              />
            </div>
            <Button 
              className="w-full" 
              onClick={handleVerifyOtp}
              disabled={isPhoneLoading || !otpCode}
            >
              {isPhoneLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </Button>
            <Button 
              variant="ghost" 
              className="w-full" 
              onClick={() => setShowPhoneOtp(false)}
            >
              Back to Login
            </Button>
          </div>
        )}
        
        <div className="text-center text-sm text-slate-600 mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-primary hover:text-primary/80">
            Sign up
          </Link>
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
            &larr; Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
