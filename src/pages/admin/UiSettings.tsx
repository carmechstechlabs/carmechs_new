import { useState, useMemo } from "react";
import { useData, UiSettings, Page, PageSection, AdminUiSettings } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Save, Loader2, Palette, Image as ImageIcon, Sliders, CheckCircle2, 
  Star, Plus, Trash2, Wrench, ShieldCheck, Clock, IndianRupee, 
  Layout, Monitor, Smartphone, Eye, Settings2, FileText, 
  ChevronRight, MoveUp, MoveDown, Globe, Lock, Terminal, Upload
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "motion/react";
import { ImageUpload } from "@/components/ImageUpload";

export function UiSettingsPage() {
  const { uiSettings, updateUiSettings, adminRole } = useData();
  const [formData, setFormData] = useState<UiSettings>(uiSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("global");
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

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

  const editingPage = useMemo(() => 
    formData.pages?.find(p => p.id === editingPageId), 
    [formData.pages, editingPageId]
  );

  const updatePage = (pageId: string, updates: Partial<Page>) => {
    setFormData({
      ...formData,
      pages: (formData.pages || []).map(p => p.id === pageId ? { ...p, ...updates } : p)
    });
  };

  const addPage = () => {
    const newId = `page_${Date.now()}`;
    const pages = formData.pages || [];
    const newPage: Page = {
      id: newId,
      slug: `new-page-${pages.length}`,
      title: "New Page",
      isPublished: false,
      sections: [
        { id: `s_${Date.now()}`, type: 'hero', title: 'New Page Hero', subtitle: 'Welcome to your new page' }
      ]
    };
    setFormData({ ...formData, pages: [...pages, newPage] });
    setEditingPageId(newId);
  };

  const deletePage = (id: string) => {
    if (id === 'home') {
      toast.error("Cannot delete the home page.");
      return;
    }
    setFormData({ ...formData, pages: (formData.pages || []).filter(p => p.id !== id) });
    if (editingPageId === id) setEditingPageId(null);
  };

  const addSection = (pageId: string) => {
    const newSection: PageSection = {
      id: `sec_${Date.now()}`,
      type: 'content',
      title: 'New Section',
      content: 'Enter your content here...'
    };
    const page = formData.pages?.find(p => p.id === pageId);
    if (page) {
      updatePage(pageId, { sections: [...page.sections, newSection] });
    }
  };

  const removeSection = (pageId: string, sectionId: string) => {
    const page = formData.pages?.find(p => p.id === pageId);
    if (page) {
      updatePage(pageId, { sections: page.sections.filter(s => s.id !== sectionId) });
    }
  };

  const moveSection = (pageId: string, sectionId: string, direction: 'up' | 'down') => {
    const page = formData.pages?.find(p => p.id === pageId);
    if (!page) return;
    const idx = page.sections.findIndex(s => s.id === sectionId);
    if (idx === -1) return;
    const newSections = [...page.sections];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= newSections.length) return;
    [newSections[idx], newSections[targetIdx]] = [newSections[targetIdx], newSections[idx]];
    updatePage(pageId, { sections: newSections });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#3b2c1f] tracking-tight uppercase">UI & Experience Engine</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Design, build, and deploy custom interfaces across your platform.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {editingPageId && (
            <Button variant="outline" onClick={() => setEditingPageId(null)} className="rounded-xl border-slate-200">
              Exit Editor
            </Button>
          )}
          <Button size="lg" onClick={handleSave} disabled={isSaving || adminRole !== 'admin'} className="bg-[#1e1b18] hover:bg-primary text-white font-bold rounded-xl shadow-xl shadow-black/5">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Deploy Changes
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!editingPageId ? (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="bg-white border border-slate-200 p-1 rounded-2xl h-14">
                <TabsTrigger value="global" className="rounded-xl px-6 data-[state=active]:bg-[#1e1b18] data-[state=active]:text-white">
                  <Palette className="h-4 w-4 mr-2" /> Global Theme
                </TabsTrigger>
                <TabsTrigger value="pages" className="rounded-xl px-6 data-[state=active]:bg-[#1e1b18] data-[state=active]:text-white">
                  <Layout className="h-4 w-4 mr-2" /> Page Builder
                </TabsTrigger>
                <TabsTrigger value="admin" className="rounded-xl px-6 data-[state=active]:bg-[#1e1b18] data-[state=active]:text-white">
                  <Lock className="h-4 w-4 mr-2" /> Admin Security UI
                </TabsTrigger>
              </TabsList>

              <TabsContent value="global" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="rounded-[2rem] border-slate-200 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                        <Palette className="h-5 w-5 text-primary" /> Brand Identity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Brand Color</label>
                        <div className="flex items-center gap-4">
                          <input 
                            type="color" 
                            value={formData.primaryColor} 
                            onChange={(e) => setFormData({...formData, primaryColor: e.target.value})}
                            className="h-14 w-14 rounded-2xl border-none cursor-pointer shadow-inner"
                          />
                          <Input 
                            value={formData.primaryColor} 
                            onChange={(e) => setFormData({...formData, primaryColor: e.target.value})}
                            className="h-14 rounded-xl font-mono text-lg"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-[#3b2c1f] font-bold text-sm uppercase tracking-tight">
                          <ImageIcon className="h-4 w-4" /> Global Hero Assets
                        </div>
                        <ImageUpload 
                          label="Default Hero Image"
                          value={formData.heroBgImage || ""}
                          onChange={(url) => setFormData({...formData, heroBgImage: url})}
                        />
                        <ImageUpload 
                          label="Why Choose Us Image"
                          value={formData.whyChooseImage || ""}
                          onChange={(url) => setFormData({...formData, whyChooseImage: url})}
                        />
                        <div className="space-y-2">
                          <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Overlay Intensity</label>
                            <span className="text-xs font-black text-primary">{Math.round((formData.heroBgOpacity || 0.5) * 100)}%</span>
                          </div>
                          <input 
                            type="range" min="0" max="1" step="0.05"
                            value={formData.heroBgOpacity || 0.5}
                            onChange={(e) => setFormData({...formData, heroBgOpacity: parseFloat(e.target.value)})}
                            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-[2rem] border-slate-200 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" /> Social Proof & Trust
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Featured Testimonial</label>
                        <Textarea 
                          value={formData.testimonialText} 
                          onChange={(e) => setFormData({...formData, testimonialText: e.target.value})}
                          className="rounded-2xl min-h-[100px]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Author Name</label>
                          <Input 
                            value={formData.testimonialAuthor} 
                            onChange={(e) => setFormData({...formData, testimonialAuthor: e.target.value})}
                            className="h-12 rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rating Value</label>
                          <Input 
                            type="number" step="0.1" min="0" max="5"
                            value={formData.testimonialRating} 
                            onChange={(e) => setFormData({...formData, testimonialRating: parseFloat(e.target.value)})}
                            className="h-12 rounded-xl font-mono"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="pages" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-black text-[#3b2c1f] uppercase tracking-tight">Active Pages</h2>
                  <Button onClick={addPage} className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl">
                    <Plus className="h-4 w-4 mr-2" /> Create New Page
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(formData.pages || []).map((page) => (
                    <Card key={page.id} className="rounded-[2rem] border-slate-200 hover:border-primary/30 transition-all hover:shadow-xl group overflow-hidden">
                      <div className="h-32 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                        <Layout className="h-12 w-12 text-slate-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
                        <div className="absolute top-4 right-4">
                          <span className={cn(
                            "text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest",
                            page.isPublished ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-500"
                          )}>
                            {page.isPublished ? "Live" : "Draft"}
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="font-black text-[#3b2c1f] text-xl uppercase tracking-tight mb-1">{page.title}</h3>
                        <p className="text-xs text-slate-400 font-mono mb-6">/{page.slug}</p>
                        
                        <div className="flex items-center justify-between">
                          <Button 
                            variant="outline" 
                            onClick={() => setEditingPageId(page.id)}
                            className="rounded-xl border-slate-200 font-bold text-xs uppercase tracking-widest hover:bg-[#1e1b18] hover:text-white transition-all"
                          >
                            Launch Editor <ChevronRight className="h-3 w-3 ml-2" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => deletePage(page.id)}
                            className="text-slate-300 hover:text-red-500 rounded-xl"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="admin" className="space-y-6">
                <Card className="rounded-[2rem] border-slate-200 shadow-sm overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="p-8 space-y-8 border-r border-slate-100">
                      <div>
                        <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2 mb-6">
                          <ShieldCheck className="h-5 w-5 text-primary" /> Admin Login Customization
                        </h3>
                        
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Terminal Title</label>
                              <Input 
                                value={formData.adminLogin.loginTitle} 
                                onChange={(e) => setFormData({
                                  ...formData, 
                                  adminLogin: { ...formData.adminLogin, loginTitle: e.target.value }
                                })}
                                className="h-12 rounded-xl"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Terminal ID</label>
                              <Input 
                                value={formData.adminLogin.loginTerminalId} 
                                onChange={(e) => setFormData({
                                  ...formData, 
                                  adminLogin: { ...formData.adminLogin, loginTerminalId: e.target.value }
                                })}
                                className="h-12 rounded-xl font-mono"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Subtitle</label>
                            <Input 
                              value={formData.adminLogin.loginSubtitle} 
                              onChange={(e) => setFormData({
                                ...formData, 
                                adminLogin: { ...formData.adminLogin, loginSubtitle: e.target.value }
                              })}
                              className="h-12 rounded-xl"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Background Color</label>
                              <div className="flex items-center gap-3">
                                <input 
                                  type="color" 
                                  value={formData.adminLogin.loginBgColor} 
                                  onChange={(e) => setFormData({
                                    ...formData, 
                                    adminLogin: { ...formData.adminLogin, loginBgColor: e.target.value }
                                  })}
                                  className="h-12 w-12 rounded-xl border-none cursor-pointer"
                                />
                                <Input 
                                  value={formData.adminLogin.loginBgColor} 
                                  onChange={(e) => setFormData({
                                    ...formData, 
                                    adminLogin: { ...formData.adminLogin, loginBgColor: e.target.value }
                                  })}
                                  className="h-12 rounded-xl font-mono text-xs"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Accent Glow Color</label>
                              <div className="flex items-center gap-3">
                                <input 
                                  type="color" 
                                  value={formData.adminLogin.loginAccentColor} 
                                  onChange={(e) => setFormData({
                                    ...formData, 
                                    adminLogin: { ...formData.adminLogin, loginAccentColor: e.target.value }
                                  })}
                                  className="h-12 w-12 rounded-xl border-none cursor-pointer"
                                />
                                <Input 
                                  value={formData.adminLogin.loginAccentColor} 
                                  onChange={(e) => setFormData({
                                    ...formData, 
                                    adminLogin: { ...formData.adminLogin, loginAccentColor: e.target.value }
                                  })}
                                  className="h-12 rounded-xl font-mono text-xs"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Custom Security Logo URL</label>
                            <ImageUpload 
                              value={formData.adminLogin.loginLogoUrl || ""}
                              onChange={(url) => setFormData({
                                ...formData, 
                                adminLogin: { ...formData.adminLogin, loginLogoUrl: url }
                              })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-8 flex items-center justify-center relative overflow-hidden">
                      {/* Mini Preview of Admin Login */}
                      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                      <div className="max-w-[280px] w-full bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-6 shadow-2xl relative z-10 scale-90">
                        <div className="text-center mb-6">
                          <div className="h-10 w-10 bg-white/5 rounded-xl mx-auto mb-4 flex items-center justify-center border border-white/5">
                            <ShieldCheck className="h-5 w-5 text-white/40" />
                          </div>
                          <h4 className="text-white font-black uppercase tracking-tighter text-sm">
                            {formData.adminLogin.loginTitle.split(' ')[0]} <span style={{ color: formData.adminLogin.loginAccentColor }}>{formData.adminLogin.loginTitle.split(' ').slice(1).join(' ')}</span>
                          </h4>
                          <p className="text-[7px] text-slate-500 uppercase tracking-[0.2em] mt-1">{formData.adminLogin.loginSubtitle}</p>
                        </div>
                        <div className="space-y-3">
                          <div className="h-8 bg-white/5 rounded-lg border border-white/5" />
                          <div className="h-8 bg-white/5 rounded-lg border border-white/5" />
                          <div className="h-10 rounded-lg" style={{ backgroundColor: formData.adminLogin.loginAccentColor }} />
                        </div>
                      </div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[80px] opacity-20" style={{ backgroundColor: formData.adminLogin.loginAccentColor }} />
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        ) : (
          <motion.div 
            key="editor"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-220px)]"
          >
            {/* Editor Sidebar */}
            <div className="w-full lg:w-[400px] flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
              <Card className="rounded-[2rem] border-slate-200 shadow-sm shrink-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Page Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Page Title</label>
                    <Input 
                      value={editingPage?.title} 
                      onChange={(e) => updatePage(editingPageId, { title: e.target.value })}
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">URL Slug</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">/</span>
                      <Input 
                        value={editingPage?.slug} 
                        onChange={(e) => updatePage(editingPageId, { slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                        className="h-11 rounded-xl pl-6 font-mono text-xs"
                        disabled={editingPageId === 'home'}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <input 
                      type="checkbox" 
                      id="published"
                      checked={editingPage?.isPublished}
                      onChange={(e) => updatePage(editingPageId, { isPublished: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="published" className="text-[10px] font-black text-slate-600 uppercase tracking-widest cursor-pointer">Published & Publicly Accessible</label>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Page Sections</h3>
                  <Button size="sm" variant="ghost" onClick={() => addSection(editingPageId)} className="h-8 text-primary hover:text-primary hover:bg-primary/5 font-bold text-[10px] uppercase">
                    <Plus className="h-3 w-3 mr-1" /> Add Section
                  </Button>
                </div>

                <div className="space-y-3">
                  {editingPage?.sections.map((section, idx) => (
                    <Card key={section.id} className="rounded-2xl border-slate-200 overflow-hidden group">
                      <div className="bg-slate-50 px-4 py-3 flex items-center justify-between border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="h-6 w-6 bg-[#1e1b18] rounded-lg flex items-center justify-center text-[10px] font-black text-white">
                            {idx + 1}
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#3b2c1f]">{section.type}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md" onClick={() => moveSection(editingPageId, section.id, 'up')} disabled={idx === 0}>
                            <MoveUp className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md" onClick={() => moveSection(editingPageId, section.id, 'down')} disabled={idx === editingPage.sections.length - 1}>
                            <MoveDown className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => removeSection(editingPageId, section.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Type</label>
                            <select 
                              className="w-full h-8 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold uppercase"
                              value={section.type}
                              onChange={(e) => {
                                const newSections = [...editingPage.sections];
                                newSections[idx].type = e.target.value as any;
                                updatePage(editingPageId, { sections: newSections });
                              }}
                            >
                              <option value="hero">Hero</option>
                              <option value="features">Features</option>
                              <option value="services">Services</option>
                              <option value="brands">Brands</option>
                              <option value="content">Content</option>
                              <option value="cta">CTA</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Title</label>
                            <Input 
                              value={section.title || ""} 
                              onChange={(e) => {
                                const newSections = [...editingPage.sections];
                                newSections[idx].title = e.target.value;
                                updatePage(editingPageId, { sections: newSections });
                              }}
                              className="h-8 rounded-lg text-xs"
                            />
                          </div>
                        </div>
                        
                        {(section.type === 'hero' || section.type === 'content' || section.type === 'cta') && (
                          <div className="space-y-1">
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Subtitle / Content</label>
                            <Textarea 
                              value={section.subtitle || section.content || ""} 
                              onChange={(e) => {
                                const newSections = [...editingPage.sections];
                                if (section.type === 'hero') newSections[idx].subtitle = e.target.value;
                                else newSections[idx].content = e.target.value;
                                updatePage(editingPageId, { sections: newSections });
                              }}
                              className="rounded-xl text-xs min-h-[60px]"
                            />
                          </div>
                        )}

                        {(section.type === 'hero' || section.type === 'content') && (
                          <ImageUpload 
                            label="Section Image"
                            value={section.image || ""}
                            onChange={(url) => {
                              const newSections = [...editingPage.sections];
                              newSections[idx].image = url;
                              updatePage(editingPageId, { sections: newSections });
                            }}
                          />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Preview Pane */}
            <div className="flex-1 bg-slate-100 rounded-[2.5rem] border border-slate-200 overflow-hidden flex flex-col shadow-inner relative">
              <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                  <span className="ml-4 text-[10px] font-mono text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                    preview: carmechs.run.app/{editingPage?.slug}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
                  <Button 
                    variant={previewMode === 'desktop' ? 'secondary' : 'ghost'} 
                    size="icon" className="h-8 w-8 rounded-lg"
                    onClick={() => setPreviewMode('desktop')}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={previewMode === 'mobile' ? 'secondary' : 'ghost'} 
                    size="icon" className="h-8 w-8 rounded-lg"
                    onClick={() => setPreviewMode('mobile')}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-[#fdfcfb]">
                <div className={cn(
                  "bg-white shadow-2xl transition-all duration-500 overflow-y-auto scrollbar-none",
                  previewMode === 'desktop' ? "w-full" : "w-[375px] rounded-[3rem] border-[8px] border-slate-900 h-[667px]"
                )}>
                  {/* Mock Page Content for Preview */}
                  <div className="font-sans">
                    {editingPage?.sections.map((section) => (
                      <div key={section.id} className="relative">
                        {section.type === 'hero' && (
                          <div className="py-20 px-10 text-white relative overflow-hidden" style={{ backgroundColor: formData.primaryColor }}>
                            {section.image && <img src={section.image} className="absolute inset-0 w-full h-full object-cover opacity-20" />}
                            <div className="relative z-10">
                              <h2 className="text-4xl font-black uppercase tracking-tight mb-4">{section.title}</h2>
                              <p className="text-lg opacity-80 max-w-md">{section.subtitle}</p>
                            </div>
                          </div>
                        )}
                        {section.type === 'content' && (
                          <div className="py-16 px-10">
                            <h3 className="text-2xl font-black text-[#3b2c1f] uppercase tracking-tight mb-4">{section.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{section.content}</p>
                            {section.image && <img src={section.image} className="mt-8 rounded-2xl w-full h-64 object-cover" />}
                          </div>
                        )}
                        {section.type === 'features' && (
                          <div className="py-16 px-10 bg-slate-50">
                            <h3 className="text-2xl font-black text-[#3b2c1f] uppercase tracking-tight mb-10 text-center">{section.title}</h3>
                            <div className="grid grid-cols-2 gap-6">
                              {[1,2,3,4].map(i => (
                                <div key={i} className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                                  <div className="h-10 w-10 bg-primary/10 rounded-xl mb-4" />
                                  <div className="h-4 w-24 bg-slate-200 rounded mb-2" />
                                  <div className="h-3 w-full bg-slate-100 rounded" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {section.type === 'services' && (
                          <div className="py-16 px-10">
                            <h3 className="text-2xl font-black text-[#3b2c1f] uppercase tracking-tight mb-10 text-center">{section.title}</h3>
                            <div className="space-y-4">
                              {[1,2,3].map(i => (
                                <div key={i} className="p-6 border border-slate-100 rounded-2xl flex items-center gap-4">
                                  <div className="h-12 w-12 bg-slate-100 rounded-xl" />
                                  <div className="flex-1">
                                    <div className="h-4 w-32 bg-slate-200 rounded mb-2" />
                                    <div className="h-3 w-48 bg-slate-100 rounded" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
                          <div className="bg-primary text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest shadow-lg">
                            {section.type}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
