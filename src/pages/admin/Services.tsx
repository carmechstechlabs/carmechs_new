import { useState, ChangeEvent, useMemo } from "react";
import { useData, Service, ServiceCategory } from "@/context/DataContext";
import { GoogleGenAI } from "@google/genai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Trash2, Edit2, Save, X, ImageIcon, Activity, Zap, Wrench, Clock, IndianRupee, ArrowRight, Layers, Shield, Car, Battery, Disc, Droplets, Wind, Sparkles, Search, CheckCircle2, ChevronDown, ChevronUp, Tag, Info, ListChecks, Settings2 } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ImageUpload";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

const COMMON_ICONS = [
  { name: "Zap", icon: Zap },
  { name: "Wrench", icon: Wrench },
  { name: "Clock", icon: Clock },
  { name: "Shield", icon: Shield },
  { name: "Car", icon: Car },
  { name: "Battery", icon: Battery },
  { name: "Disc", icon: Disc },
  { name: "Droplets", icon: Droplets },
  { name: "Wind", icon: Wind },
  { name: "Sparkles", icon: Sparkles },
  { name: "Activity", icon: Activity },
  { name: "Layers", icon: Layers },
];

export function Services() {
  const { services, updateServices, adminRole, categories, updateCategories, carMakes, carModels, fuelTypes } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Service>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMake, setSelectedMake] = useState<string>("all");
  const [selectedModel, setSelectedModel] = useState<string>("all");
  const [selectedFuelType, setSelectedFuelType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("title");
  const [activeTab, setActiveTab] = useState<string>("services");
  const [iconSearch, setIconSearch] = useState("");
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);

  const generateAiImages = async () => {
    if (adminRole !== 'admin') {
      toast.error("Only admins can generate AI images.");
      return;
    }

    setIsGeneratingImages(true);
    const toastId = toast.loading("Generating high-quality service images...");

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const model = "gemini-2.5-flash-image";

      const targets = [
        { id: "ser_1", title: "Periodic Maintenance", prompt: "A high-quality, professional photo of a modern car undergoing periodic maintenance in a clean, well-lit workshop. A mechanic is checking the engine with professional tools. Cinematic lighting, 4k, realistic." },
        { id: "ser_2", title: "AC Service & Repair", prompt: "A professional close-up photo of a car's air conditioning system being serviced. A technician is using a pressure gauge and specialized tools. Focus on the AC vents and the tools. Clean, professional, realistic." },
        { id: "ser_3", title: "Denting & Painting", prompt: "A high-quality photo of a car in a professional paint booth. A technician in a protective suit is using a spray gun to paint a car door. Vibrant colors, professional environment, realistic." }
      ];

      const updatedServices = [...services];
      let successCount = 0;

      for (const target of targets) {
        try {
          const response = await ai.models.generateContent({
            model: model,
            contents: {
              parts: [{ text: target.prompt }]
            },
            config: {
              imageConfig: {
                aspectRatio: "16:9"
              }
            }
          });

          const imagePart = response.candidates[0].content.parts.find(p => p.inlineData);
          if (imagePart?.inlineData) {
            const base64 = imagePart.inlineData.data;
            const imageUrl = `data:image/png;base64,${base64}`;
            
            const index = updatedServices.findIndex(s => s.id === target.id);
            if (index !== -1) {
              updatedServices[index] = { ...updatedServices[index], iconUrl: imageUrl };
              successCount++;
            }
          }
        } catch (err) {
          console.error(`Failed to generate image for ${target.title}:`, err);
        }
      }

      if (successCount > 0) {
        updateServices(updatedServices);
        toast.success(`Successfully generated ${successCount} service images!`, { id: toastId });
      } else {
        toast.error("Failed to generate images. Please check your API key and try again.", { id: toastId });
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      toast.error("An error occurred during image generation.", { id: toastId });
    } finally {
      setIsGeneratingImages(false);
    }
  };

  // Category Management State
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryFormData, setCategoryFormData] = useState<Partial<ServiceCategory>>({
    name: "",
    description: "",
    iconName: "Tag"
  });

  const allLucideIcons = useMemo(() => {
    return Object.keys(LucideIcons).filter(key => 
      typeof (LucideIcons as any)[key] === 'function' || 
      (typeof (LucideIcons as any)[key] === 'object' && (LucideIcons as any)[key].render)
    );
  }, []);

  const filteredIcons = useMemo(() => {
    if (!iconSearch) return allLucideIcons.slice(0, 100);
    return allLucideIcons.filter(name => 
      name.toLowerCase().includes(iconSearch.toLowerCase())
    ).slice(0, 100);
  }, [iconSearch, allLucideIcons]);

  const getIconComponent = (name: string) => {
    const Icon = (LucideIcons as any)[name] || Zap;
    return <Icon className="h-5 w-5" />;
  };

  const handleEdit = (service: Service) => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to edit services.");
      return;
    }
    setEditingId(service.id);
    setFormData(service);
    setIsAdding(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to delete services.");
      return;
    }
    if (confirm("Are you sure you want to delete this service?")) {
      updateServices(services.filter(s => s.id !== id));
      toast.success("Service deleted successfully");
    }
  };

  const handleSave = () => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to save services.");
      return;
    }

    // Validation
    if (!formData.title?.trim()) {
      toast.error("Service title is required");
      return;
    }
    if (!formData.price?.trim()) {
      toast.error("Display price is required (e.g. ₹1,499)");
      return;
    }
    if (!formData.basePrice || isNaN(Number(formData.basePrice)) || Number(formData.basePrice) <= 0) {
      toast.error("Valid numeric base price is required for calculations");
      return;
    }
    if (!formData.duration?.trim()) {
      toast.error("Estimated duration is required");
      return;
    }

    const newService: Service = {
      id: editingId || formData.id || Date.now().toString(),
      title: formData.title.trim(),
      description: formData.description?.trim() || "",
      price: formData.price.trim(),
      basePrice: Number(formData.basePrice),
      estimatedPrice: Number(formData.estimatedPrice || formData.basePrice),
      duration: formData.duration.trim(),
      estimatedDuration: formData.estimatedDuration?.trim() || formData.duration?.trim() || "",
      iconUrl: formData.iconUrl || "",
      iconName: formData.iconName || "Zap",
      categoryId: formData.categoryId,
      features: Array.isArray(formData.features) 
        ? formData.features 
        : (formData.features as string || "").split(',').map(s => s.trim()).filter(Boolean),
      checks: Array.isArray(formData.checks) 
        ? formData.checks 
        : (formData.checks as string || "").split(',').map(s => s.trim()).filter(Boolean),
      applicableMakes: formData.applicableMakes || [],
      applicableModels: formData.applicableModels || [],
      applicableFuelTypes: formData.applicableFuelTypes || [],
    };

    if (editingId) {
      updateServices(services.map(s => s.id === editingId ? newService : s));
      toast.success("Service updated successfully");
    } else {
      updateServices([...services, newService]);
      toast.success("Service added successfully");
    }

    setEditingId(null);
    setIsAdding(false);
    setFormData({});
  };

  const handleSaveCategory = () => {
    if (adminRole !== 'admin') {
      toast.error("Permission denied");
      return;
    }
    if (!categoryFormData.name?.trim()) {
      toast.error("Category name is required");
      return;
    }

    const newCategory: ServiceCategory = {
      id: editingCategoryId || Date.now().toString(),
      name: categoryFormData.name.trim(),
      description: categoryFormData.description?.trim() || "",
      iconName: categoryFormData.iconName || "Tag"
    };

    if (editingCategoryId) {
      updateCategories(categories.map(c => c.id === editingCategoryId ? newCategory : c));
      toast.success("Category updated");
    } else {
      updateCategories([...categories, newCategory]);
      toast.success("Category created");
    }

    setEditingCategoryId(null);
    setCategoryFormData({ name: "", description: "", iconName: "Tag" });
  };

  const handleDeleteCategory = (id: string) => {
    if (adminRole !== 'admin') return;
    if (confirm("Delete this category? Services in this category will become uncategorized.")) {
      updateCategories(categories.filter(c => c.id !== id));
      // Optionally update services to remove this categoryId
      updateServices(services.map(s => s.categoryId === id ? { ...s, categoryId: undefined } : s));
      toast.success("Category deleted");
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedMake("all");
    setSelectedModel("all");
    setSelectedFuelType("all");
    setSortBy("title");
  };

  const filteredServices = services
    .filter(service => {
      const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || service.categoryId === selectedCategory;
      
      const matchesMake = selectedMake === "all" || 
                        (service.applicableMakes && service.applicableMakes.includes(selectedMake));
      
      const matchesModel = selectedModel === "all" || 
                         (service.applicableModels && service.applicableModels.includes(selectedModel));
      
      const matchesFuel = selectedFuelType === "all" || 
                        (service.applicableFuelTypes && service.applicableFuelTypes.includes(selectedFuelType));

      return matchesSearch && matchesCategory && matchesMake && matchesModel && matchesFuel;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.basePrice - b.basePrice;
      if (sortBy === "price_desc") return b.basePrice - a.basePrice;
      if (sortBy === "duration") return a.duration.localeCompare(b.duration);
      return a.title.localeCompare(b.title);
    });

  return (
    <div className="space-y-8 pb-12">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
              <Layers className="h-3 w-3" /> Management
            </div>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
              {activeTab === "services" ? "Service Catalog" : "Service Categories"}
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              {activeTab === "services" ? "Configure and manage your service offerings." : "Organize your services into logical groups."}
            </p>
          </div>

          <TabsList className="bg-slate-100 p-1 rounded-2xl">
            <TabsTrigger value="services" className="rounded-xl px-6 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Services
            </TabsTrigger>
            <TabsTrigger value="categories" className="rounded-xl px-6 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Categories
            </TabsTrigger>
          </TabsList>
          
          {activeTab === "services" && (
            <div className="flex gap-4">
              <Button 
                onClick={generateAiImages}
                disabled={isGeneratingImages || adminRole !== 'admin'}
                className="h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest rounded-2xl px-8 shadow-xl shadow-indigo-200 group border-none"
              >
                <Sparkles className={cn("mr-2 h-4 w-4 group-hover:scale-110 transition-transform", isGeneratingImages && "animate-spin")} />
                {isGeneratingImages ? "Generating..." : "Generate AI Images"}
              </Button>
              <Button 
                onClick={() => { setIsAdding(true); setEditingId(null); setFormData({}); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                disabled={adminRole !== 'admin'}
                className="h-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-2xl px-8 shadow-xl shadow-primary/20 group border-none"
              >
                <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" /> Add New Service
              </Button>
            </div>
          )}
        </div>

        <TabsContent value="services" className="space-y-8 mt-0 outline-none">
          {/* Search and Filter Bar */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search services..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-12 pl-11 bg-slate-50 border-slate-100 text-slate-900 rounded-xl text-xs font-bold uppercase tracking-widest"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className={cn(
                  "h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl text-xs font-bold uppercase tracking-widest",
                  selectedCategory !== "all" && "border-primary/50 bg-primary/5"
                )}>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  <SelectItem value="all" className="text-xs font-bold uppercase tracking-widest">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id} className="text-xs font-bold uppercase tracking-widest">{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="relative group">
                <Select value={selectedMake} onValueChange={(val) => { setSelectedMake(val); setSelectedModel("all"); }}>
                  <SelectTrigger className={cn(
                    "h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                    selectedMake !== "all" && "border-primary/50 bg-primary/5"
                  )}>
                    <SelectValue placeholder="All Makes" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    <SelectItem value="all" className="text-xs font-bold uppercase tracking-widest">All Makes</SelectItem>
                    {carMakes.map(make => (
                      <SelectItem key={make.id} value={make.name} className="text-xs font-bold uppercase tracking-widest">{make.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedMake !== "all" && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedMake("all"); setSelectedModel("all"); }}
                    className="absolute right-10 top-1/2 -translate-y-1/2 p-1 hover:bg-primary/10 rounded-full text-primary transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              <div className="relative group">
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className={cn(
                    "h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                    selectedModel !== "all" && "border-primary/50 bg-primary/5"
                  )}>
                    <SelectValue placeholder="All Models" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    <SelectItem value="all" className="text-xs font-bold uppercase tracking-widest">All Models</SelectItem>
                    {carModels
                      .filter(m => selectedMake === "all" || m.make === selectedMake)
                      .map(model => (
                        <SelectItem key={model.id} value={model.name} className="text-xs font-bold uppercase tracking-widest">{model.name}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {selectedModel !== "all" && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedModel("all"); }}
                    className="absolute right-10 top-1/2 -translate-y-1/2 p-1 hover:bg-primary/10 rounded-full text-primary transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              <div className="relative group">
                <Select value={selectedFuelType} onValueChange={setSelectedFuelType}>
                  <SelectTrigger className={cn(
                    "h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                    selectedFuelType !== "all" && "border-primary/50 bg-primary/5"
                  )}>
                    <SelectValue placeholder="All Fuel Types" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    <SelectItem value="all" className="text-xs font-bold uppercase tracking-widest">All Fuel Types</SelectItem>
                    {fuelTypes.map(fuel => (
                      <SelectItem key={fuel.id} value={fuel.name} className="text-xs font-bold uppercase tracking-widest">{fuel.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedFuelType !== "all" && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedFuelType("all"); }}
                    className="absolute right-10 top-1/2 -translate-y-1/2 p-1 hover:bg-primary/10 rounded-full text-primary transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl text-xs font-bold uppercase tracking-widest">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  <SelectItem value="title" className="text-xs font-bold uppercase tracking-widest">Title (A-Z)</SelectItem>
                  <SelectItem value="price_asc" className="text-xs font-bold uppercase tracking-widest">Price (Low to High)</SelectItem>
                  <SelectItem value="price_desc" className="text-xs font-bold uppercase tracking-widest">Price (High to Low)</SelectItem>
                  <SelectItem value="duration" className="text-xs font-bold uppercase tracking-widest">Duration</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={resetFilters}
                className="h-12 border-slate-200 text-slate-500 font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-50"
              >
                <X className="h-3 w-3 mr-2" /> Reset Filters
              </Button>
            </div>
            
            {(searchTerm || selectedCategory !== "all" || selectedMake !== "all" || selectedModel !== "all" || selectedFuelType !== "all") && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-50">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center mr-2">Active Filters:</span>
                {searchTerm && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-lg text-[9px] font-bold uppercase tracking-widest">
                    Search: {searchTerm} <X className="h-2 w-2 cursor-pointer" onClick={() => setSearchTerm("")} />
                  </div>
                )}
                {selectedCategory !== "all" && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-lg text-[9px] font-bold uppercase tracking-widest">
                    Category: {categories.find(c => c.id === selectedCategory)?.name} <X className="h-2 w-2 cursor-pointer" onClick={() => setSelectedCategory("all")} />
                  </div>
                )}
                {selectedMake !== "all" && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-lg text-[9px] font-bold uppercase tracking-widest">
                    Make: {selectedMake} <X className="h-2 w-2 cursor-pointer" onClick={() => setSelectedMake("all")} />
                  </div>
                )}
                {selectedModel !== "all" && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-lg text-[9px] font-bold uppercase tracking-widest">
                    Model: {selectedModel} <X className="h-2 w-2 cursor-pointer" onClick={() => setSelectedModel("all")} />
                  </div>
                )}
                {selectedFuelType !== "all" && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-lg text-[9px] font-bold uppercase tracking-widest">
                    Fuel: {selectedFuelType} <X className="h-2 w-2 cursor-pointer" onClick={() => setSelectedFuelType("all")} />
                  </div>
                )}
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {(isAdding || editingId) && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="relative"
              >
                <Card className="bg-white border-slate-200 shadow-2xl overflow-hidden rounded-[2rem]">
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary opacity-50" />
                  <CardHeader className="border-b border-slate-100 p-8">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                        <Zap className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                          {editingId ? "Edit Service" : "Create New Service"}
                        </CardTitle>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          {editingId ? `Service ID: ${editingId}` : "Enter service details below"}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <Tabs defaultValue="basic" className="w-full">
                      <TabsList className="bg-slate-50 p-1 rounded-xl mb-8">
                        <TabsTrigger value="basic" className="rounded-lg px-6 font-bold text-[10px] uppercase tracking-widest">
                          <Info className="h-3 w-3 mr-2" /> Basic Info
                        </TabsTrigger>
                        <TabsTrigger value="details" className="rounded-lg px-6 font-bold text-[10px] uppercase tracking-widest">
                          <ListChecks className="h-3 w-3 mr-2" /> Features & Checks
                        </TabsTrigger>
                        <TabsTrigger value="appearance" className="rounded-lg px-6 font-bold text-[10px] uppercase tracking-widest">
                          <ImageIcon className="h-3 w-3 mr-2" /> Appearance
                        </TabsTrigger>
                        <TabsTrigger value="applicability" className="rounded-lg px-6 font-bold text-[10px] uppercase tracking-widest">
                          <Car className="h-3 w-3 mr-2" /> Applicability
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="basic" className="space-y-8 mt-0 outline-none">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Service Title</label>
                              <Input 
                                placeholder="e.g. Premium Ceramic Coating" 
                                value={formData.title || ""} 
                                onChange={e => setFormData({...formData, title: e.target.value})}
                                className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs uppercase tracking-widest"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Display Price (String)</label>
                                <Input 
                                  placeholder="e.g. ₹14,999" 
                                  value={formData.price || ""} 
                                  onChange={e => setFormData({...formData, price: e.target.value})}
                                  className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs uppercase tracking-widest"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Base Price (Numeric)</label>
                                <Input 
                                  placeholder="14999" 
                                  type="number"
                                  value={formData.basePrice || ""} 
                                  onChange={e => setFormData({...formData, basePrice: Number(e.target.value), estimatedPrice: Number(e.target.value)})}
                                  className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs uppercase tracking-widest"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Estimated Duration (Display)</label>
                              <Input 
                                placeholder="e.g. 4-6 Hours" 
                                value={formData.estimatedDuration || ""} 
                                onChange={e => setFormData({...formData, estimatedDuration: e.target.value, duration: e.target.value})}
                                className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs uppercase tracking-widest"
                              />
                            </div>
                          </div>
                          <div className="space-y-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Category</label>
                              <Select 
                                value={formData.categoryId || "none"} 
                                onValueChange={(val) => setFormData({ ...formData, categoryId: val === "none" ? undefined : val })}
                              >
                                <SelectTrigger className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest">
                                  <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200">
                                  <SelectItem value="none" className="text-xs font-bold uppercase tracking-widest">No Category</SelectItem>
                                  {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id} className="text-xs font-bold uppercase tracking-widest">
                                      {cat.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Description</label>
                              <Textarea 
                                placeholder="Describe the service in detail..." 
                                value={formData.description || ""} 
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                className="min-h-[120px] bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-medium text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="details" className="space-y-8 mt-0 outline-none">
                        <Accordion type="multiple" defaultValue={["features", "checks"]} className="space-y-4">
                          <AccordionItem value="features" className="border border-slate-100 rounded-2xl bg-slate-50 px-6 overflow-hidden">
                            <AccordionTrigger className="hover:no-underline py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <Zap className="h-4 w-4 text-primary" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-widest text-slate-900">Features & Benefits</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-6">
                              <div className="space-y-2">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Enter features separated by commas</p>
                                <Textarea 
                                  placeholder="Feature 1, Feature 2, Feature 3..." 
                                  value={Array.isArray(formData.features) ? formData.features.join(", ") : (formData.features || "")} 
                                  onChange={e => setFormData({...formData, features: e.target.value as any})}
                                  className="min-h-[120px] bg-white border-slate-200 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs uppercase tracking-widest"
                                />
                              </div>
                            </AccordionContent>
                          </AccordionItem>

                          <AccordionItem value="checks" className="border border-slate-100 rounded-2xl bg-slate-50 px-6 overflow-hidden">
                            <AccordionTrigger className="hover:no-underline py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <CheckCircle2 className="h-4 w-4 text-primary" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-widest text-slate-900">Service Checks</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-6">
                              <div className="space-y-2">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Enter checks separated by commas</p>
                                <Textarea 
                                  placeholder="Check 1, Check 2, Check 3..." 
                                  value={Array.isArray(formData.checks) ? formData.checks.join(", ") : (formData.checks || "")} 
                                  onChange={e => setFormData({...formData, checks: e.target.value as any})}
                                  className="min-h-[120px] bg-white border-slate-200 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs uppercase tracking-widest"
                                />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </TabsContent>

                      <TabsContent value="appearance" className="space-y-8 mt-0 outline-none">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Service Icon (Upload)</label>
                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:border-primary/30 transition-all group/upload">
                              <ImageUpload 
                                value={formData.iconUrl || ""}
                                onChange={(url) => setFormData({ ...formData, iconUrl: url })}
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Library Icon Selection</label>
                            
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-6">
                              <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-primary shadow-sm">
                                  {getIconComponent(formData.iconName || "Zap")}
                                </div>
                                <div className="flex-1">
                                  <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">Current Icon: {formData.iconName || "Zap"}</p>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Select from library or search below</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-4 gap-2">
                                {COMMON_ICONS.map((item) => (
                                  <button
                                    key={item.name}
                                    onClick={() => setFormData({ ...formData, iconName: item.name })}
                                    className={cn(
                                      "h-12 flex items-center justify-center rounded-xl border transition-all",
                                      formData.iconName === item.name 
                                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                                        : "bg-white text-slate-400 border-slate-100 hover:border-primary/30"
                                    )}
                                  >
                                    <item.icon className="h-5 w-5" />
                                  </button>
                                ))}
                              </div>

                              <div className="pt-4 border-t border-slate-200">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full h-12 bg-white border-slate-200 rounded-xl font-black uppercase tracking-widest text-[10px] flex justify-between">
                                      Search All Icons <Search className="h-3 w-3" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-[300px] p-0 bg-white border-slate-200 rounded-2xl shadow-2xl" align="start">
                                    <div className="p-4 border-b border-slate-100">
                                      <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                                        <Input 
                                          placeholder="Search icons..." 
                                          value={iconSearch}
                                          onChange={(e) => setIconSearch(e.target.value)}
                                          className="h-9 pl-9 bg-slate-50 border-slate-100 rounded-lg text-xs"
                                        />
                                      </div>
                                    </div>
                                    <ScrollArea className="h-[300px] p-2">
                                      <div className="grid grid-cols-4 gap-1">
                                        {filteredIcons.map((name) => {
                                          const Icon = (LucideIcons as any)[name];
                                          return (
                                            <button
                                              key={name}
                                              onClick={() => setFormData({ ...formData, iconName: name })}
                                              className={cn(
                                                "h-10 flex items-center justify-center rounded-lg border transition-all",
                                                formData.iconName === name 
                                                  ? "bg-primary text-white border-primary" 
                                                  : "bg-transparent text-slate-400 border-transparent hover:bg-slate-50"
                                              )}
                                              title={name}
                                            >
                                              <Icon className="h-4 w-4" />
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </ScrollArea>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="applicability" className="space-y-8 mt-0 outline-none">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Applicable Makes</label>
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 max-h-[300px] overflow-y-auto">
                              {carMakes.map(make => (
                                <div key={make.name} className="flex items-center gap-2">
                                  <input 
                                    type="checkbox" 
                                    id={`make-${make.name}`}
                                    checked={(formData.applicableMakes || []).includes(make.name)}
                                    onChange={(e) => {
                                      const current = formData.applicableMakes || [];
                                      if (e.target.checked) {
                                        setFormData({ ...formData, applicableMakes: [...current, make.name] });
                                      } else {
                                        setFormData({ ...formData, applicableMakes: current.filter(m => m !== make.name) });
                                      }
                                    }}
                                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                                  />
                                  <label htmlFor={`make-${make.name}`} className="text-xs font-bold text-slate-700 uppercase tracking-tight cursor-pointer">{make.name}</label>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Applicable Models</label>
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 max-h-[300px] overflow-y-auto">
                              {carModels.map(model => (
                                <div key={`${model.make}-${model.name}`} className="flex items-center gap-2">
                                  <input 
                                    type="checkbox" 
                                    id={`model-${model.make}-${model.name}`}
                                    checked={(formData.applicableModels || []).includes(model.name)}
                                    onChange={(e) => {
                                      const current = formData.applicableModels || [];
                                      if (e.target.checked) {
                                        setFormData({ ...formData, applicableModels: [...current, model.name] });
                                      } else {
                                        setFormData({ ...formData, applicableModels: current.filter(m => m !== model.name) });
                                      }
                                    }}
                                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                                  />
                                  <label htmlFor={`model-${model.make}-${model.name}`} className="text-xs font-bold text-slate-700 uppercase tracking-tight cursor-pointer">
                                    {model.name} <span className="text-[8px] text-slate-400">({model.make})</span>
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Applicable Fuel Types</label>
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 max-h-[300px] overflow-y-auto">
                              {fuelTypes.map(fuel => (
                                <div key={fuel.name} className="flex items-center gap-2">
                                  <input 
                                    type="checkbox" 
                                    id={`fuel-${fuel.name}`}
                                    checked={(formData.applicableFuelTypes || []).includes(fuel.name)}
                                    onChange={(e) => {
                                      const current = formData.applicableFuelTypes || [];
                                      if (e.target.checked) {
                                        setFormData({ ...formData, applicableFuelTypes: [...current, fuel.name] });
                                      } else {
                                        setFormData({ ...formData, applicableFuelTypes: current.filter(f => f !== fuel.name) });
                                      }
                                    }}
                                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                                  />
                                  <label htmlFor={`fuel-${fuel.name}`} className="text-xs font-bold text-slate-700 uppercase tracking-tight cursor-pointer">{fuel.name}</label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>

                    <div className="flex justify-end gap-4 pt-8 border-t border-slate-100 mt-8">
                      <Button 
                        variant="ghost" 
                        onClick={() => { setIsAdding(false); setEditingId(null); }}
                        className="h-12 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl px-8"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSave}
                        className="h-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-xl px-12 shadow-xl shadow-primary/20"
                      >
                        Save Service
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Services List */}
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-white border-slate-100 shadow-2xl shadow-slate-200/50 hover:border-primary/30 transition-all duration-500 group overflow-hidden rounded-[2rem]">
                    <CardContent className="flex flex-col lg:flex-row items-center justify-between p-8 gap-8">
                      <div className="flex flex-col lg:flex-row items-center gap-8 w-full">
                        <div className="relative">
                          <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="h-24 w-24 bg-slate-50 rounded-[2rem] flex items-center justify-center border border-slate-100 overflow-hidden flex-shrink-0 relative z-10 group-hover:border-primary/30 transition-all">
                            {service.iconUrl ? (
                              <img src={service.iconUrl} alt={service.title} className="max-h-[60%] max-w-[60%] object-contain group-hover:scale-110 transition-transform duration-500" />
                            ) : (
                              <div className="text-primary group-hover:scale-110 transition-transform duration-500">
                                {getIconComponent(service.iconName || "Zap")}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-1 text-center lg:text-left space-y-2">
                          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter group-hover:text-primary transition-colors">{service.title}</h3>
                            <div className="flex items-center justify-center lg:justify-start gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
                              {service.categoryId && (
                                <span className="ml-2 px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[8px] font-bold uppercase tracking-widest">
                                  {categories.find(c => c.id === service.categoryId)?.name}
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-slate-500 font-medium max-w-2xl line-clamp-2">{service.description}</p>
                          
                          <div className="pt-4 flex flex-wrap justify-center lg:justify-start gap-6">
                            <div className="flex items-center gap-2">
                              <IndianRupee className="h-4 w-4 text-primary" />
                              <div className="flex flex-col">
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Display Price</span>
                                <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{service.price}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4 text-primary" />
                              <div className="flex flex-col">
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Base Price</span>
                                <span className="text-xs font-black text-slate-900 uppercase tracking-widest">₹{service.basePrice || 0}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-primary" />
                              <div className="flex flex-col">
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Est. Duration</span>
                                <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{service.estimatedDuration || service.duration}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-primary" />
                              <div className="flex flex-col">
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Features</span>
                                <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{service.features.length} Items</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 w-full lg:w-auto">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEdit(service)}
                          className="h-12 w-12 bg-slate-50 border border-slate-100 text-slate-400 hover:text-primary hover:bg-primary/5 hover:border-primary/10 rounded-xl transition-all"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(service.id)}
                          className="h-12 w-12 bg-slate-50 border border-slate-100 text-slate-400 hover:text-primary hover:bg-primary/5 hover:border-primary/10 rounded-xl transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-8 mt-0 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Category Form */}
            <div className="lg:col-span-1">
              <Card className="bg-white border-slate-200 shadow-xl rounded-[2rem] overflow-hidden sticky top-24">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary opacity-50" />
                <CardHeader className="border-b border-slate-100 p-8">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                      <Tag className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                        {editingCategoryId ? "Edit Category" : "New Category"}
                      </CardTitle>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        Organize your services
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Category Name</label>
                    <Input 
                      placeholder="e.g. Periodic Maintenance" 
                      value={categoryFormData.name || ""} 
                      onChange={e => setCategoryFormData({...categoryFormData, name: e.target.value})}
                      className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs uppercase tracking-widest"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Description</label>
                    <Textarea 
                      placeholder="Brief description..." 
                      value={categoryFormData.description || ""} 
                      onChange={e => setCategoryFormData({...categoryFormData, description: e.target.value})}
                      className="min-h-[100px] bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-medium text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Icon Name</label>
                    <div className="flex gap-2">
                      <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary shrink-0">
                        {getIconComponent(categoryFormData.iconName || "Tag")}
                      </div>
                      <Input 
                        placeholder="Lucide Icon Name" 
                        value={categoryFormData.iconName || ""} 
                        onChange={e => setCategoryFormData({...categoryFormData, iconName: e.target.value})}
                        className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs uppercase tracking-widest"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    {editingCategoryId && (
                      <Button 
                        variant="ghost" 
                        onClick={() => { setEditingCategoryId(null); setCategoryFormData({ name: "", description: "", iconName: "Tag" }); }}
                        className="flex-1 h-12 text-[10px] font-black uppercase tracking-widest text-slate-400"
                      >
                        Cancel
                      </Button>
                    )}
                    <Button 
                      onClick={handleSaveCategory}
                      className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20"
                    >
                      {editingCategoryId ? "Update" : "Create"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Categories List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((cat) => (
                  <motion.div key={cat.id} layout>
                    <Card className="bg-white border-slate-100 shadow-xl rounded-[2rem] overflow-hidden group hover:border-primary/30 transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                              {getIconComponent(cat.iconName || "Tag")}
                            </div>
                            <div>
                              <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter">{cat.name}</h4>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {services.filter(s => s.categoryId === cat.id).length} Services
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => { setEditingCategoryId(cat.id); setCategoryFormData(cat); }}
                              className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg"
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        {cat.description && (
                          <p className="mt-4 text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                            {cat.description}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
                {categories.length === 0 && (
                  <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                    <Tag className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No categories created yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
