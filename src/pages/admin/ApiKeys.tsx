import { useState } from "react";
import { useData } from "@/context/DataContext";
import { ApiKeys } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Loader2, Key, CreditCard, ShieldCheck, Database, Smartphone, Globe, Lock, Info } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function ApiKeysPage() {
  const { apiKeys, updateApiKeys, adminRole } = useData();
  const [formData, setFormData] = useState<ApiKeys>(apiKeys);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to update API keys.");
      return;
    }
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateApiKeys(formData);
      toast.success("API Keys updated successfully");
    } catch (error) {
      toast.error("Failed to update API keys");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
            <Lock className="h-3 w-3" /> Security
          </div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Infrastructure Keys</h1>
          <p className="text-slate-400 text-sm font-medium">Manage external service integrations and authentication secrets.</p>
        </div>
        
        <Button 
          size="lg" 
          onClick={handleSave} 
          disabled={isSaving || adminRole !== 'admin'}
          className="bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 h-14 px-8 transition-all active:scale-95"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <Save className="mr-2 h-5 w-5" />
              Commit Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Google Auth */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-[#0A0A0A] border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden group hover:border-primary/30 transition-all duration-500">
            <CardHeader className="p-8 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-[#0A0A0A] border border-white/5 flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform duration-500">
                  <Globe className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black text-white uppercase tracking-tighter">Google Auth</CardTitle>
                  <CardDescription className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">OAuth 2.0 Credentials</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">Client ID</label>
                <div className="relative">
                  <Input 
                    type="password"
                    value={formData.googleClientId} 
                    onChange={(e) => setFormData({...formData, googleClientId: e.target.value})}
                    placeholder="Enter Google Client ID"
                    className="h-12 bg-white/5 border-white/5 text-white rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs tracking-widest"
                  />
                </div>
                <div className="flex items-start gap-2 p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 mt-2">
                  <Info className="h-3.5 w-3.5 text-blue-500 mt-0.5" />
                  <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest leading-relaxed">
                    Required for Google Sign-In integration. Ensure redirect URIs match production environment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Firebase Config */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-[#0A0A0A] border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden group hover:border-primary/30 transition-all duration-500">
            <CardHeader className="p-8 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-[#0A0A0A] border border-white/5 flex items-center justify-center text-amber-500 shadow-sm group-hover:scale-110 transition-transform duration-500">
                  <Smartphone className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black text-white uppercase tracking-tighter">Firebase Core</CardTitle>
                  <CardDescription className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Auth & Cloud Infrastructure</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">API Key</label>
                  <Input 
                    type="password"
                    value={formData.firebaseApiKey} 
                    onChange={(e) => setFormData({...formData, firebaseApiKey: e.target.value})}
                    placeholder="Firebase API Key"
                    className="h-12 bg-white/5 border-white/5 text-white rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs tracking-widest"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">Auth Domain</label>
                  <Input 
                    value={formData.firebaseAuthDomain} 
                    onChange={(e) => setFormData({...formData, firebaseAuthDomain: e.target.value})}
                    placeholder="your-project.firebaseapp.com"
                    className="h-12 bg-white/5 border-white/5 text-white rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs tracking-widest"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">Project ID</label>
                  <Input 
                    value={formData.firebaseProjectId} 
                    onChange={(e) => setFormData({...formData, firebaseProjectId: e.target.value})}
                    placeholder="your-project-id"
                    className="h-12 bg-white/5 border-white/5 text-white rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs tracking-widest"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">Storage Bucket</label>
                  <Input 
                    value={formData.firebaseStorageBucket} 
                    onChange={(e) => setFormData({...formData, firebaseStorageBucket: e.target.value})}
                    placeholder="your-project.appspot.com"
                    className="h-12 bg-white/5 border-white/5 text-white rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs tracking-widest"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">Messaging ID</label>
                  <Input 
                    value={formData.firebaseMessagingSenderId} 
                    onChange={(e) => setFormData({...formData, firebaseMessagingSenderId: e.target.value})}
                    placeholder="1234567890"
                    className="h-12 bg-white/5 border-white/5 text-white rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs tracking-widest"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">App ID</label>
                  <Input 
                    value={formData.firebaseAppId} 
                    onChange={(e) => setFormData({...formData, firebaseAppId: e.target.value})}
                    placeholder="1:1234567890:web:abcdef"
                    className="h-12 bg-white/5 border-white/5 text-white rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs tracking-widest"
                  />
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-500 mt-0.5" />
                <p className="text-[9px] font-bold text-amber-400 uppercase tracking-widest leading-relaxed">
                  Required for Phone Verification and Database operations. Handle with extreme caution.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Razorpay Integration */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-[#0A0A0A] border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden group hover:border-primary/30 transition-all duration-500">
            <CardHeader className="p-8 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-[#0A0A0A] border border-white/5 flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform duration-500">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black text-white uppercase tracking-tighter">Razorpay</CardTitle>
                  <CardDescription className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Payment Gateway Secrets</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">Key ID</label>
                  <Input 
                    type="password"
                    value={formData.razorpayKeyId || ""} 
                    onChange={(e) => setFormData({...formData, razorpayKeyId: e.target.value})}
                    placeholder="rzp_live_..."
                    className="h-12 bg-white/5 border-white/5 text-white rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs tracking-widest"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">Key Secret</label>
                  <Input 
                    type="password"
                    value={formData.razorpayKeySecret || ""} 
                    onChange={(e) => setFormData({...formData, razorpayKeySecret: e.target.value})}
                    placeholder="Enter Secret Key"
                    className="h-12 bg-white/5 border-white/5 text-white rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs tracking-widest"
                  />
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                <Info className="h-3.5 w-3.5 text-indigo-500 mt-0.5" />
                <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest leading-relaxed">
                  Used for processing real-time transactions. Ensure keys match the current environment (Test/Live).
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Paytm Integration */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-[#0A0A0A] border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden group hover:border-primary/30 transition-all duration-500">
            <CardHeader className="p-8 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-[#0A0A0A] border border-white/5 flex items-center justify-center text-blue-500 shadow-sm group-hover:scale-110 transition-transform duration-500">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black text-white uppercase tracking-tighter">Paytm</CardTitle>
                  <CardDescription className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Merchant Credentials</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">Merchant ID (MID)</label>
                  <Input 
                    type="password"
                    value={formData.paytmMid || ""} 
                    onChange={(e) => setFormData({...formData, paytmMid: e.target.value})}
                    placeholder="Enter Paytm MID"
                    className="h-12 bg-white/5 border-white/5 text-white rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs tracking-widest"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">Merchant Key</label>
                  <Input 
                    type="password"
                    value={formData.paytmMerchantKey || ""} 
                    onChange={(e) => setFormData({...formData, paytmMerchantKey: e.target.value})}
                    placeholder="Enter Merchant Key"
                    className="h-12 bg-white/5 border-white/5 text-white rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs tracking-widest"
                  />
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <Info className="h-3.5 w-3.5 text-blue-500 mt-0.5" />
                <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest leading-relaxed">
                  Alternative payment processing channel. Verify merchant status in Paytm Dashboard.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
