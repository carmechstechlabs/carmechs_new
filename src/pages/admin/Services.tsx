import { useState, ChangeEvent } from "react";
import { useData, Service, ServiceCategory } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit2, Save, X, ImageIcon, Activity, Zap, Wrench, Clock, IndianRupee, ArrowRight, Layers, Shield, Car, Battery, Disc, Droplets, Wind, Sparkles, Search, CheckCircle2 } from "lucide-react";
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
  const { services, updateServices, adminRole, categories } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Service>>({});

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
    if (!formData.title || !formData.price || !formData.basePrice) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newService: Service = {
      id: editingId || formData.id || Date.now().toString(),
      title: formData.title || "",
      description: formData.description || "",
      price: formData.price || "",
      basePrice: Number(formData.basePrice) || 0,
      duration: formData.duration || "",
      iconUrl: formData.iconUrl || "",
      iconName: formData.iconName || "Zap",
      categoryId: formData.categoryId,
      features: Array.isArray(formData.features) 
        ? formData.features 
        : (formData.features as string || "").split(',').map(s => s.trim()).filter(Boolean),
      checks: Array.isArray(formData.checks) 
        ? formData.checks 
        : (formData.checks as string || "").split(',').map(s => s.trim()).filter(Boolean),
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

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
            <Layers className="h-3 w-3" /> Management
          </div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Service Catalog</h1>
          <p className="text-slate-500 text-sm font-medium">Configure and manage your service offerings.</p>
        </div>
        
        <Button 
          onClick={() => { setIsAdding(true); setEditingId(null); setFormData({}); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          disabled={adminRole !== 'admin'}
          className="h-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-2xl px-8 shadow-xl shadow-primary/20 group border-none"
        >
          <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" /> Add New Service
        </Button>
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
              <CardContent className="p-8 space-y-8">
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
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Display Price</label>
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
                          onChange={e => setFormData({...formData, basePrice: Number(e.target.value)})}
                          className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs uppercase tracking-widest"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Estimated Duration</label>
                      <Input 
                        placeholder="e.g. 4-6 Hours" 
                        value={formData.duration || ""} 
                        onChange={e => setFormData({...formData, duration: e.target.value})}
                        className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs uppercase tracking-widest"
                      />
                    </div>

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
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Service Icon (Upload)</label>
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:border-primary/30 transition-all group/upload">
                        <ImageUpload 
                          value={formData.iconUrl || ""}
                          onChange={(url) => setFormData({ ...formData, iconUrl: url })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Or Select Library Icon</label>
                      <div className="grid grid-cols-4 gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
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
                      <div className="mt-2">
                        <Input 
                          placeholder="Custom Lucide Icon Name (e.g. Wrench, Car, Zap)" 
                          value={formData.iconName || ""} 
                          onChange={e => setFormData({...formData, iconName: e.target.value})}
                          className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs uppercase tracking-widest"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Description</label>
                      <Textarea 
                        placeholder="Describe the service in detail..." 
                        value={formData.description || ""} 
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="min-h-[120px] bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-medium text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Features (Comma Separated)</label>
                      <Textarea 
                        placeholder="Feature 1, Feature 2, Feature 3..." 
                        value={Array.isArray(formData.features) ? formData.features.join(", ") : (formData.features || "")} 
                        onChange={e => setFormData({...formData, features: e.target.value as any})}
                        className="min-h-[80px] bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs uppercase tracking-widest"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Checks (Comma Separated)</label>
                      <Textarea 
                        placeholder="Check 1, Check 2, Check 3..." 
                        value={Array.isArray(formData.checks) ? formData.checks.join(", ") : (formData.checks || "")} 
                        onChange={e => setFormData({...formData, checks: e.target.value as any})}
                        className="min-h-[80px] bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs uppercase tracking-widest"
                      />
                    </div>
                  </div>

                <div className="flex justify-end gap-4 pt-8 border-t border-slate-100">
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
          {services.map((service, index) => (
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
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 font-medium max-w-2xl line-clamp-2">{service.description}</p>
                      
                      <div className="pt-4 flex flex-wrap justify-center lg:justify-start gap-6">
                        <div className="flex items-center gap-2">
                          <IndianRupee className="h-4 w-4 text-primary" />
                          <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{service.price}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{service.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" />
                          <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{service.features.length} Features</span>
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
    </div>
  );
}
