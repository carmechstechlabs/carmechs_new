import { useState } from "react";
import { useData, Settings } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Save, Loader2, Globe, Mail, Phone, MapPin, MessageSquare, Gift, Facebook, Instagram, Twitter, Layout, Upload, Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner";

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Site Settings</h1>
          <p className="text-slate-500">Manage your business information and global configurations.</p>
        </div>
        <Button size="lg" onClick={handleSave} disabled={isSaving || adminRole !== 'admin'}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Branding & Identity
            </CardTitle>
            <CardDescription>Customize your brand's visual identity across the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Logo Text</label>
                  <Input 
                    value={formData.logoText} 
                    onChange={(e) => setFormData({...formData, logoText: e.target.value})}
                    placeholder="CarMechs"
                    className="h-11"
                  />
                  <p className="text-xs text-slate-500">This text will appear next to the logo icon.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Logo URL</label>
                  <div className="flex gap-2">
                    <Input 
                      value={formData.logoUrl || ""} 
                      onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                      placeholder="https://example.com/logo.png"
                      className="h-11"
                    />
                  </div>
                  <p className="text-xs text-slate-500">Provide a direct link to your logo image (PNG or SVG recommended).</p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-semibold text-slate-700">Logo Preview</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 relative min-h-[200px]">
                  {formData.logoUrl ? (
                    <>
                      <img 
                        src={formData.logoUrl} 
                        alt="Logo Preview" 
                        className="max-h-24 object-contain mb-4"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+URL';
                        }}
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                        onClick={() => setFormData({...formData, logoUrl: ""})}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <ImageIcon className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-sm text-slate-500">No logo uploaded yet</p>
                    </div>
                  )}
                </div>
                <div className="flex justify-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => {
                      const url = prompt("Enter Image URL:");
                      if (url) setFormData({...formData, logoUrl: url});
                    }}
                  >
                    <Upload className="h-4 w-4" />
                    Upload via URL
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Contact Information
            </CardTitle>
            <CardDescription>Primary contact details for customer support.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" />
                  Support Email
                </label>
                <Input 
                  type="email"
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="support@carmechs.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" />
                  Phone Number
                </label>
                <Input 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" />
                Office Address
              </label>
              <Input 
                value={formData.address} 
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="123, Auto Plaza, Sector 18, Gurgaon"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-emerald-500" />
              Messaging & Social
            </CardTitle>
            <CardDescription>Connect with customers on their favorite platforms.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5" />
                WhatsApp Number
              </label>
              <Input 
                value={formData.whatsapp} 
                onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                placeholder="+919876543210"
              />
              <p className="text-[11px] text-slate-500">
                Include country code without spaces or symbols (e.g., +919876543210).
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Facebook className="h-3.5 w-3.5" />
                  Facebook
                </label>
                <Input 
                  value={formData.facebook || ""} 
                  onChange={(e) => setFormData({...formData, facebook: e.target.value})}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Instagram className="h-3.5 w-3.5" />
                  Instagram
                </label>
                <Input 
                  value={formData.instagram || ""} 
                  onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Twitter className="h-3.5 w-3.5" />
                  Twitter
                </label>
                <Input 
                  value={formData.twitter || ""} 
                  onChange={(e) => setFormData({...formData, twitter: e.target.value})}
                  placeholder="https://twitter.com/..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout className="h-5 w-5 text-blue-500" />
              Footer Settings
            </CardTitle>
            <CardDescription>Manage the content displayed in the site footer.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Footer Description</label>
              <Textarea 
                value={formData.footerDescription || ""} 
                onChange={(e) => setFormData({...formData, footerDescription: e.target.value})}
                placeholder="Brief description of your business for the footer."
                rows={4}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Privacy Policy URL</label>
                <Input 
                  value={formData.privacyPolicyUrl || ""} 
                  onChange={(e) => setFormData({...formData, privacyPolicyUrl: e.target.value})}
                  placeholder="/privacy"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Terms of Service URL</label>
                <Input 
                  value={formData.termsOfServiceUrl || ""} 
                  onChange={(e) => setFormData({...formData, termsOfServiceUrl: e.target.value})}
                  placeholder="/terms"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-amber-500" />
              Referral Program
            </CardTitle>
            <CardDescription>Configure rewards for your referral system.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Gift className="h-3.5 w-3.5" />
                Referral Reward Amount (₹)
              </label>
              <Input 
                type="number"
                value={formData.referralRewardAmount} 
                onChange={(e) => setFormData({...formData, referralRewardAmount: Number(e.target.value)})}
                placeholder="500"
              />
              <p className="text-[11px] text-slate-500">
                This amount will be credited to the referrer's wallet upon a successful sign-up.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
