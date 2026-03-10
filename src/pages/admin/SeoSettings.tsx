import { useState } from "react";
import { useData, UiSettings } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Save, Loader2, Globe, Settings2, FileText, Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ImageUpload";

export function SeoSettingsPage() {
  const { uiSettings, updateUiSettings, adminRole } = useData();
  const [formData, setFormData] = useState<UiSettings>(uiSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to update SEO settings.");
      return;
    }
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateUiSettings(formData);
      toast.success("SEO Settings updated successfully");
    } catch (error) {
      toast.error("Failed to update SEO settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight uppercase">SEO Engine</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Optimize your platform for search engines and social sharing.</p>
        </div>
        
        <Button size="lg" onClick={handleSave} disabled={isSaving || adminRole !== 'admin'} className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-xl shadow-primary/10">
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Deploy SEO Config
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-[2rem] border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" /> Meta Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Global Meta Title</label>
              <Input 
                value={formData.seo?.metaTitle} 
                onChange={(e) => setFormData({
                  ...formData,
                  seo: { ...formData.seo, metaTitle: e.target.value }
                })}
                className="h-12 rounded-xl font-bold"
                placeholder="e.g. CarMechs | Premium Automotive Care"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Global Meta Description</label>
              <Textarea 
                value={formData.seo?.metaDescription} 
                onChange={(e) => setFormData({
                  ...formData,
                  seo: { ...formData.seo, metaDescription: e.target.value }
                })}
                className="rounded-2xl min-h-[100px]"
                placeholder="Describe your platform for search results..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Keywords (Comma Separated)</label>
              <Input 
                value={formData.seo?.keywords} 
                onChange={(e) => setFormData({
                  ...formData,
                  seo: { ...formData.seo, keywords: e.target.value }
                })}
                className="h-12 rounded-xl"
                placeholder="car service, repair, maintenance..."
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-primary" /> Advanced SEO Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="space-y-0.5">
                  <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Search Engine Indexing</label>
                  <p className="text-[10px] text-slate-500 font-medium">Allow search engines to crawl and index your site.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={formData.seo?.enableIndexing}
                  onChange={(e) => setFormData({
                    ...formData,
                    seo: { ...formData.seo, enableIndexing: e.target.checked }
                  })}
                  className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Social Share (OG) Image</label>
                <ImageUpload 
                  value={formData.seo?.ogImage || ""}
                  onChange={(url) => setFormData({
                    ...formData,
                    seo: { ...formData.seo, ogImage: url }
                  })}
                />
              </div>

              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest mb-1">SEO Optimization Tip</p>
                    <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
                      Ensure your meta title is between 50-60 characters and description is between 150-160 characters for optimal search engine visibility.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
