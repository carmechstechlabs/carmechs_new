import { useState } from "react";
import { useData, UiSettings } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Loader2, Palette } from "lucide-react";
import { toast } from "sonner";

export function UiSettingsPage() {
  const { uiSettings, updateUiSettings, adminRole } = useData();
  const [formData, setFormData] = useState<UiSettings>(uiSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to update UI settings.");
      return;
    }
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateUiSettings(formData);
      toast.success("UI Settings updated successfully");
    } catch (error) {
      toast.error("Failed to update UI settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">UI Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Hero Section
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Hero Title</label>
              <Input 
                value={formData.heroTitle} 
                onChange={(e) => setFormData({...formData, heroTitle: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hero Subtitle</label>
              <Textarea 
                value={formData.heroSubtitle} 
                onChange={(e) => setFormData({...formData, heroSubtitle: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Primary Color (Hex)</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={formData.primaryColor} 
                  onChange={(e) => setFormData({...formData, primaryColor: e.target.value})}
                  className="h-10 w-10 rounded border border-slate-200"
                />
                <Input 
                  value={formData.primaryColor} 
                  onChange={(e) => setFormData({...formData, primaryColor: e.target.value})}
                  className="w-32"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
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
    </div>
  );
}
