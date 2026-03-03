import { useState } from "react";
import { useData, Settings } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Save, Loader2, Globe, Mail, Phone, MapPin, MessageSquare, Gift, Facebook, Instagram, Twitter, Layout, Upload, Image as ImageIcon, X, Shield, Zap, Activity, ArrowRight, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ImageUpload";
import { motion } from "motion/react";

export function SettingsPage() {
  const { settings, updateSettings, adminRole } = useData();
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
          <div className="flex items-center gap-2 text-red-600 font-bold text-[10px] uppercase tracking-[0.3em]">
            <SettingsIcon className="h-3 w-3" /> Configuration
          </div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">System Settings</h1>
          <p className="text-slate-500 text-sm font-medium">Manage global parameters and business identity.</p>
        </div>
        
        <Button 
          size="lg" 
          onClick={handleSave} 
          disabled={isSaving || adminRole !== 'admin'}
          className="h-14 px-10 bg-[#e31e24] hover:bg-[#c4191f] text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-red-500/20 group"
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
          <div className="absolute top-0 left-0 w-full h-1 bg-red-600 opacity-50" />
          <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center border border-red-100">
                <Globe className="h-5 w-5 text-red-600" />
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
                    className="h-14 bg-slate-50 border-slate-100 text-slate-900 rounded-2xl focus:ring-red-600/20 focus:border-red-600/50 font-black text-sm uppercase tracking-widest"
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
                  <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover/preview:opacity-100 transition-opacity" />
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
                  <Mail className="h-3 w-3 text-red-600" />
                  Support Email
                </label>
                <Input 
                  type="email"
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="support@carmechs.com"
                  className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-red-600/20 focus:border-red-600/50 font-bold text-xs uppercase tracking-widest"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                  <Phone className="h-3 w-3 text-red-600" />
                  Phone Number
                </label>
                <Input 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+91 98765 43210"
                  className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-red-600/20 focus:border-red-600/50 font-bold text-xs uppercase tracking-widest"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                <MapPin className="h-3 w-3 text-red-600" />
                Physical Address
              </label>
              <Input 
                value={formData.address} 
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="123, Auto Plaza, Sector 18, Gurgaon"
                className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-red-600/20 focus:border-red-600/50 font-bold text-xs uppercase tracking-widest"
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
                  className="h-11 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-red-600/20 focus:border-red-600/50 font-bold text-[10px] uppercase tracking-widest"
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
                  className="h-11 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-red-600/20 focus:border-red-600/50 font-bold text-[10px] uppercase tracking-widest"
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
                  className="h-11 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-red-600/20 focus:border-red-600/50 font-bold text-[10px] uppercase tracking-widest"
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
                className="bg-slate-50 border-slate-100 text-slate-900 rounded-2xl focus:ring-red-600/20 focus:border-red-600/50 font-medium text-sm"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Privacy Policy URL</label>
                <Input 
                  value={formData.privacyPolicyUrl || ""} 
                  onChange={(e) => setFormData({...formData, privacyPolicyUrl: e.target.value})}
                  placeholder="/privacy"
                  className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-red-600/20 focus:border-red-600/50 font-bold text-xs uppercase tracking-widest"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Terms of Service URL</label>
                <Input 
                  value={formData.termsOfServiceUrl || ""} 
                  onChange={(e) => setFormData({...formData, termsOfServiceUrl: e.target.value})}
                  placeholder="/terms"
                  className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-red-600/20 focus:border-red-600/50 font-bold text-xs uppercase tracking-widest"
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
                className="h-14 bg-slate-50 border-slate-100 text-slate-900 rounded-2xl focus:ring-red-600/20 focus:border-red-600/50 font-black text-xl uppercase tracking-widest"
              />
              <p className="text-[9px] text-slate-400 px-1 font-bold uppercase tracking-widest">
                Amount credited to referrer's wallet upon successful user sign-up.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
