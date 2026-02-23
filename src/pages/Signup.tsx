import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Wrench, Loader2, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/context/DataContext";

export function Signup() {
  const navigate = useNavigate();
  const { apiKeys } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isPhoneLoading, setIsPhoneLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      if (formData.name && formData.email && formData.password.length >= 6) {
        toast.success("Successfully signed up!");
        navigate("/");
      } else {
        toast.error("Please fill all fields correctly.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    if (!apiKeys.googleClientId) {
      toast.error("Google Client ID is not configured in Admin Panel.");
      return;
    }
    setIsGoogleLoading(true);
    try {
      // Simulate Google OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Successfully verified email with Google!");
      navigate("/");
    } catch (error) {
      toast.error("Google authentication failed.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handlePhoneSignup = async () => {
    if (!apiKeys.firebaseApiKey) {
      toast.error("Firebase API Key is not configured in Admin Panel.");
      return;
    }
    setIsPhoneLoading(true);
    try {
      // Simulate Firebase Phone Auth flow
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Successfully verified phone number!");
      navigate("/");
    } catch (error) {
      toast.error("Phone verification failed.");
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
          <h2 className="text-3xl font-bold text-slate-900">Create an account</h2>
          <p className="mt-2 text-sm text-slate-600">
            Sign up to book and manage your services
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Full Name"
              />
            </div>
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <Button className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing up...
                </>
              ) : (
                "Sign up"
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

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              onClick={handleGoogleSignup}
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
            <Button 
              variant="outline" 
              onClick={handlePhoneSignup}
              disabled={isPhoneLoading}
              className="w-full"
            >
              {isPhoneLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Phone className="mr-2 h-4 w-4 text-green-500" />
                  Phone
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="text-center text-sm text-slate-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:text-primary/80">
            Sign in
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
