import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/context/DataContext";

export function AdminLogin() {
  const navigate = useNavigate();
  const { loginAdmin } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock validation (admin/admin)
      if (formData.username === "admin" && formData.password === "admin") {
        loginAdmin('admin');
        toast.success("Welcome back, Admin!");
        navigate("/admin/dashboard");
      } else if (formData.username === "viewer" && formData.password === "viewer") {
        loginAdmin('viewer');
        toast.success("Welcome back, Viewer!");
        navigate("/admin/dashboard");
      } else {
        toast.error("Invalid credentials.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-800">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-6">
            <Lock className="h-8 w-8 text-slate-900" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Admin Portal</h2>
          <p className="mt-2 text-sm text-slate-600">
            Secure access for site management
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-t-md focus:outline-none focus:ring-slate-900 focus:border-slate-900 focus:z-10 sm:text-sm"
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-b-md focus:outline-none focus:ring-slate-900 focus:border-slate-900 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <Button className="w-full bg-slate-900 hover:bg-slate-800" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Access Dashboard"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
