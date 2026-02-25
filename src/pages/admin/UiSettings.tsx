import { useState } from "react";
import { useData, UiSettings } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Loader2, Palette, Image as ImageIcon, Sliders, CheckCircle2, Star, Plus, Trash2, Wrench, ShieldCheck, Clock, IndianRupee } from "lucide-react";
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">UI Settings</h1>
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
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Hero Section Customization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Hero Title</label>
                <Input 
                  value={formData.heroTitle} 
                  onChange={(e) => setFormData({...formData, heroTitle: e.target.value})}
                  placeholder="Expert Car Care At Your Doorstep"
                />
                <p className="text-xs text-slate-500 mt-1">Use \n for line breaks in the title.</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hero Subtitle</label>
                <Textarea 
                  value={formData.heroSubtitle} 
                  onChange={(e) => setFormData({...formData, heroSubtitle: e.target.value})}
                  placeholder="Experience hassle-free car service with free pickup and drop."
                  rows={4}
                />
              </div>
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                  <ImageIcon className="h-4 w-4" />
                  Background Image
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-500">Background Image URL</label>
                  <Input 
                    value={formData.heroBgImage || ""} 
                    onChange={(e) => setFormData({...formData, heroBgImage: e.target.value})}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-medium text-slate-500 flex items-center gap-1">
                      <Sliders className="h-3 w-3" />
                      Overlay Opacity
                    </label>
                    <span className="text-xs font-mono font-bold text-primary">{Math.round((formData.heroBgOpacity || 0.5) * 100)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05"
                    value={formData.heroBgOpacity || 0.5}
                    onChange={(e) => setFormData({...formData, heroBgOpacity: parseFloat(e.target.value)})}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Theme Primary Color</label>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input 
                      type="color" 
                      value={formData.primaryColor} 
                      onChange={(e) => setFormData({...formData, primaryColor: e.target.value})}
                      className="h-12 w-12 rounded-lg border border-slate-200 cursor-pointer p-1"
                    />
                  </div>
                  <div className="flex-1">
                    <Input 
                      value={formData.primaryColor} 
                      onChange={(e) => setFormData({...formData, primaryColor: e.target.value})}
                      placeholder="#0f172a"
                      className="font-mono"
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1">This color will be used for the hero background and primary buttons.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                "Why Choose Us" Section
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">Section Title</label>
                <Input 
                  value={formData.whyChooseTitle} 
                  onChange={(e) => setFormData({...formData, whyChooseTitle: e.target.value})}
                  placeholder="Why Choose CarMechs?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea 
                  value={formData.whyChooseDescription} 
                  onChange={(e) => setFormData({...formData, whyChooseDescription: e.target.value})}
                  placeholder="Tell customers why they should choose you."
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Section Image URL</label>
                <Input 
                  value={formData.whyChooseImage} 
                  onChange={(e) => setFormData({...formData, whyChooseImage: e.target.value})}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold">Features (Max 4)</label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      if (formData.features.length < 4) {
                        setFormData({
                          ...formData,
                          features: [...formData.features, { title: "New Feature", description: "Description here", iconName: "Wrench" }]
                        });
                      }
                    }}
                    disabled={formData.features.length >= 4}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Feature
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {formData.features.map((feature, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3 relative group">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-2 right-2 h-7 w-7 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          const newFeatures = [...formData.features];
                          newFeatures.splice(idx, 1);
                          setFormData({...formData, features: newFeatures});
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-slate-500">Icon</label>
                          <select 
                            className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm"
                            value={feature.iconName}
                            onChange={(e) => {
                              const newFeatures = [...formData.features];
                              newFeatures[idx].iconName = e.target.value;
                              setFormData({...formData, features: newFeatures});
                            }}
                          >
                            <option value="Wrench">Wrench</option>
                            <option value="ShieldCheck">Shield</option>
                            <option value="Clock">Clock</option>
                            <option value="IndianRupee">Rupee</option>
                            <option value="Star">Star</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-slate-500">Title</label>
                          <Input 
                            value={feature.title}
                            onChange={(e) => {
                              const newFeatures = [...formData.features];
                              newFeatures[idx].title = e.target.value;
                              setFormData({...formData, features: newFeatures});
                            }}
                            className="h-9"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-500">Description</label>
                        <Input 
                          value={feature.description}
                          onChange={(e) => {
                            const newFeatures = [...formData.features];
                            newFeatures[idx].description = e.target.value;
                            setFormData({...formData, features: newFeatures});
                          }}
                          className="h-9"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <label className="text-sm font-bold">Testimonial Card</label>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-slate-500">Testimonial Text</label>
                    <Textarea 
                      value={formData.testimonialText} 
                      onChange={(e) => setFormData({...formData, testimonialText: e.target.value})}
                      placeholder="Customer feedback..."
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-slate-500">Author</label>
                      <Input 
                        value={formData.testimonialAuthor} 
                        onChange={(e) => setFormData({...formData, testimonialAuthor: e.target.value})}
                        placeholder="Alex Johnson"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-slate-500">Rating (0-5)</label>
                      <Input 
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={formData.testimonialRating} 
                        onChange={(e) => setFormData({...formData, testimonialRating: parseFloat(e.target.value)})}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="overflow-hidden border-none shadow-xl">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500">Live Preview</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div 
                className="relative p-8 min-h-[300px] flex items-center text-white overflow-hidden"
                style={{ backgroundColor: formData.primaryColor || '#0f172a' }}
              >
                <div className="absolute inset-0 z-0">
                  {formData.heroBgImage ? (
                    <img 
                      src={formData.heroBgImage} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      style={{ opacity: formData.heroBgOpacity || 0.5 }}
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-800 opacity-20"></div>
                  )}
                  <div 
                    className="absolute inset-0"
                    style={{ 
                      background: `linear-gradient(to right, ${formData.primaryColor || '#0f172a'}, ${formData.primaryColor || '#0f172a'}CC, transparent)` 
                    }}
                  ></div>
                </div>
                
                <div className="relative z-10 max-w-md">
                  <h3 className="text-2xl font-bold mb-3 leading-tight">
                    {formData.heroTitle ? (
                      <span dangerouslySetInnerHTML={{ __html: formData.heroTitle.replace(/\\n/g, '<br />') }} />
                    ) : (
                      "Expert Car Care At Your Doorstep"
                    )}
                  </h3>
                  <p className="text-sm text-slate-300 mb-6 line-clamp-3">
                    {formData.heroSubtitle || "Experience hassle-free car service with free pickup and drop. Trusted by thousands of car owners."}
                  </p>
                  <div className="flex gap-3">
                    <div className="h-8 w-24 bg-white rounded flex items-center justify-center text-[10px] font-bold text-slate-900">
                      BOOK NOW
                    </div>
                    <div className="h-8 w-24 border border-white rounded flex items-center justify-center text-[10px] font-bold">
                      SERVICES
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white border-t">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: formData.primaryColor }}>
                    <Palette className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Primary Button Style</p>
                    <p className="text-xs text-slate-500">Buttons across the site will use this theme.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
