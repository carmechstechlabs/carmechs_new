import { useState } from "react";
import { useData, Settings } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Save, Loader2, Globe, Mail, Phone, MapPin, MessageSquare, Gift, Facebook, Instagram, Twitter, Layout, Upload, Image as ImageIcon, X, Shield, Zap, Activity, ArrowRight, Settings as SettingsIcon, Key, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ImageUpload";
import { motion } from "motion/react";

export function SettingsPage() {
  const { settings, updateSettings, adminRole, users, updateUsers } = useData();
  const [formData, setFormData] = useState<Settings>(settings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to update settings.");
      return;
    }
    setIsSaving(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateSettings(formData);
      toast.success("Settings updated successfully");
    } catch (error) {
      toast.error("Failed to update settings");
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
            <SettingsIcon className="h-3 w-3" /> Configuration
          </div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">System Settings</h1>
          <p className="text-slate-500 text-sm font-medium">Manage global parameters and business identity.</p>
        </div>
        
        <Button 
          size="lg" 
          onClick={handleSave} 
          disabled={isSaving || adminRole !== 'admin'}
          className="h-14 px-10 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary/20 group"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Branding Section */}
        <Card className="bg-white border-slate-200 shadow-sm lg:col-span-2 rounded-[2.5rem] overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary opacity-50" />
          <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Branding & Identity</CardTitle>
                <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Customize your visual identity across the platform.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Logo Text</label>
                  <Input 
                    value={formData.logoText} 
                    onChange={(e) => setFormData({...formData, logoText: e.target.value})}
                    placeholder="CarMechs"
                    className="h-14 bg-slate-50 border-slate-100 text-slate-900 rounded-2xl focus:ring-primary/20 focus:border-primary/50 font-black text-sm uppercase tracking-widest"
                  />
                  <p className="text-[9px] text-slate-400 px-1 font-bold uppercase tracking-widest">Primary text identifier for the navigation interface.</p>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Logo Image</label>
                  <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-4">
                    <ImageUpload 
                      value={formData.logoUrl || ""}
                      onChange={(url) => setFormData({...formData, logoUrl: url})}
                    />
                  </div>
                  <p className="text-[9px] text-slate-400 px-1 font-bold uppercase tracking-widest mt-2">Recommended: PNG or SVG with transparent background.</p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Logo Preview</label>
                <div className="border-2 border-dashed border-slate-100 rounded-[2.5rem] p-12 flex flex-col items-center justify-center bg-slate-50 relative min-h-[280px] group/preview overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/preview:opacity-100 transition-opacity" />
                  {formData.logoUrl ? (
                    <motion.img 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      src={formData.logoUrl} 
                      alt="Logo Preview" 
                      className="max-h-32 object-contain relative z-10 drop-shadow-sm"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+URL';
                      }}
                    />
                  ) : (
                    <div className="text-center relative z-10">
                      <div className="h-20 w-20 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
                        <ImageIcon className="h-10 w-10 text-slate-300" />
                      </div>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Logo Uploaded</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="bg-white border-slate-200 shadow-sm rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Contact Information</CardTitle>
                <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Primary contact details for support channels.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                  <Mail className="h-3 w-3 text-primary" />
                  Support Email
                </label>
                <Input 
                  type="email"
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="support@carmechs.com"
                  className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs uppercase tracking-widest"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                  <Phone className="h-3 w-3 text-primary" />
                  Phone Number
                </label>
                <Input 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+91 98765 43210"
                  className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs uppercase tracking-widest"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                <MapPin className="h-3 w-3 text-primary" />
                Physical Address
              </label>
              <Input 
                value={formData.address} 
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="123, Auto Plaza, Sector 18, Gurgaon"
                className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs uppercase tracking-widest"
              />
            </div>
          </CardContent>
        </Card>

        {/* Messaging Section */}
        <Card className="bg-white border-slate-200 shadow-sm rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                <MessageSquare className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Social Media</CardTitle>
                <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Connect with users on external platforms.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                <MessageSquare className="h-3 w-3 text-emerald-600" />
                WhatsApp Number
              </label>
              <Input 
                value={formData.whatsapp} 
                onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                placeholder="+919876543210"
                className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-emerald-600/20 focus:border-emerald-600/50 font-bold text-xs uppercase tracking-widest"
              />
              <p className="text-[9px] text-slate-400 px-1 font-bold uppercase tracking-widest">
                Include country code without symbols (e.g. 919876543210).
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                  <Facebook className="h-3 w-3 text-blue-600" />
                  FB
                </label>
                <Input 
                  value={formData.facebook || ""} 
                  onChange={(e) => setFormData({...formData, facebook: e.target.value})}
                  placeholder="URL"
                  className="h-11 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-[10px] uppercase tracking-widest"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                  <Instagram className="h-3 w-3 text-pink-500" />
                  IG
                </label>
                <Input 
                  value={formData.instagram || ""} 
                  onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                  placeholder="URL"
                  className="h-11 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-[10px] uppercase tracking-widest"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                  <Twitter className="h-3 w-3 text-sky-500" />
                  TW
                </label>
                <Input 
                  value={formData.twitter || ""} 
                  onChange={(e) => setFormData({...formData, twitter: e.target.value})}
                  placeholder="URL"
                  className="h-11 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-[10px] uppercase tracking-widest"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Section */}
        <Card className="bg-white border-slate-200 shadow-sm rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-violet-50 flex items-center justify-center border border-violet-100">
                <Layout className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Footer Content</CardTitle>
                <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage content displayed in the site footer.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Footer Description</label>
              <Textarea 
                value={formData.footerDescription || ""} 
                onChange={(e) => setFormData({...formData, footerDescription: e.target.value})}
                placeholder="Brief description of your business for the footer."
                rows={4}
                className="bg-slate-50 border-slate-100 text-slate-900 rounded-2xl focus:ring-primary/20 focus:border-primary/50 font-medium text-sm"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Privacy Policy URL</label>
                <Input 
                  value={formData.privacyPolicyUrl || ""} 
                  onChange={(e) => setFormData({...formData, privacyPolicyUrl: e.target.value})}
                  placeholder="/privacy"
                  className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs uppercase tracking-widest"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Terms of Service URL</label>
                <Input 
                  value={formData.termsOfServiceUrl || ""} 
                  onChange={(e) => setFormData({...formData, termsOfServiceUrl: e.target.value})}
                  placeholder="/terms"
                  className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs uppercase tracking-widest"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referral Section */}
        <Card className="bg-white border-slate-200 shadow-sm rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100">
                <Gift className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Referral Program</CardTitle>
                <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Configure rewards for your referral system.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                <Zap className="h-3 w-3 text-amber-600" />
                Referral Reward (₹)
              </label>
              <Input 
                type="number"
                value={formData.referralRewardAmount} 
                onChange={(e) => setFormData({...formData, referralRewardAmount: Number(e.target.value)})}
                placeholder="500"
                className="h-14 bg-slate-50 border-slate-100 text-slate-900 rounded-2xl focus:ring-primary/20 focus:border-primary/50 font-black text-xl uppercase tracking-widest"
              />
              <p className="text-[9px] text-slate-400 px-1 font-bold uppercase tracking-widest">
                Amount credited to referrer's wallet upon successful user sign-up.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card className="bg-white border-slate-200 shadow-sm rounded-[2.5rem] overflow-hidden lg:col-span-2">
          <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Security & Access</CardTitle>
                <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Update your administrative credentials.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Change Admin Password</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">New Password</label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                      <Input 
                        type="password"
                        placeholder="Enter new password"
                        id="new-admin-password"
                        className="h-12 pl-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs uppercase tracking-widest"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Confirm Password</label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                      <Input 
                        type="password"
                        placeholder="Confirm new password"
                        id="confirm-admin-password"
                        className="h-12 pl-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs uppercase tracking-widest"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={() => {
                      const newPass = (document.getElementById('new-admin-password') as HTMLInputElement).value;
                      const confirmPass = (document.getElementById('confirm-admin-password') as HTMLInputElement).value;
                      if (!newPass) {
                        toast.error("Password cannot be empty");
                        return;
                      }
                      if (newPass !== confirmPass) {
                        toast.error("Passwords do not match");
                        return;
                      }
                      // In a real app, this would call an API. 
                      // Here we update the admin user in the users list.
                      const adminUser = users.find(u => u.role === 'admin');
                      if (adminUser) {
                        const updatedUsers = users.map(u => u.id === adminUser.id ? { ...u, password: newPass } : u);
                        updateUsers(updatedUsers);
                        toast.success("Admin password updated successfully");
                        (document.getElementById('new-admin-password') as HTMLInputElement).value = "";
                        (document.getElementById('confirm-admin-password') as HTMLInputElement).value = "";
                      }
                    }}
                    className="h-12 px-8 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest rounded-xl transition-all"
                  >
                    Update Password
                  </Button>
                </div>
              </div>
              <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm mb-4">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Security Recommendation</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                  Use at least 8 characters with a mix of letters, numbers, and symbols to ensure maximum security for your administrative portal.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
