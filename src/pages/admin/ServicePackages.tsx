import { useState } from "react";
import { useData, ServicePackage, Service } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit2, Zap, Wrench, Clock, IndianRupee, Layers, Shield, Check, X, Package } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ImageUpload";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export function ServicePackages() {
  const { servicePackages, services, updateServicePackages, adminRole } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ServicePackage>>({
    serviceIds: [],
    features: [],
    discountPercentage: 10,
    isPopular: false
  });

  const handleEdit = (pkg: ServicePackage) => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to edit packages.");
      return;
    }
    setEditingId(pkg.id);
    setFormData(pkg);
    setIsAdding(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to delete packages.");
      return;
    }
    if (confirm("Are you sure you want to delete this package?")) {
      updateServicePackages(servicePackages.filter(p => p.id !== id));
      toast.success("Package deleted successfully");
    }
  };

  const toggleService = (serviceId: string) => {
    const currentIds = formData.serviceIds || [];
    if (currentIds.includes(serviceId)) {
      setFormData({ ...formData, serviceIds: currentIds.filter(id => id !== serviceId) });
    } else {
      setFormData({ ...formData, serviceIds: [...currentIds, serviceId] });
    }
  };

  const calculatePackagePrice = () => {
    const selectedServices = services.filter(s => formData.serviceIds?.includes(s.id));
    const totalBasePrice = selectedServices.reduce((sum, s) => sum + (s.basePrice || 0), 0);
    const discount = (formData.discountPercentage || 0) / 100;
    return Math.round(totalBasePrice * (1 - discount));
  };

  const handleSave = () => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to save packages.");
      return;
    }
    if (!formData.title || !formData.serviceIds || formData.serviceIds.length === 0) {
      toast.error("Please fill in all required fields and select at least one service");
      return;
    }

    const calculatedPrice = calculatePackagePrice();

    const newPackage: ServicePackage = {
      id: editingId || formData.id || Date.now().toString(),
      title: formData.title || "",
      description: formData.description || "",
      serviceIds: formData.serviceIds || [],
      discountPercentage: Number(formData.discountPercentage) || 0,
      basePrice: calculatedPrice,
      isPopular: !!formData.isPopular,
      imageUrl: formData.imageUrl || "",
      features: Array.isArray(formData.features) 
        ? formData.features 
        : (formData.features as unknown as string || "").split(',').map(s => s.trim()).filter(Boolean),
    };

    if (editingId) {
      updateServicePackages(servicePackages.map(p => p.id === editingId ? newPackage : p));
      toast.success("Package updated successfully");
    } else {
      updateServicePackages([...servicePackages, newPackage]);
      toast.success("Package added successfully");
    }

    setEditingId(null);
    setIsAdding(false);
    setFormData({ serviceIds: [], features: [], discountPercentage: 10, isPopular: false });
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
            <Package className="h-3 w-3" /> Bundles
          </div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Service Packages</h1>
          <p className="text-slate-500 text-sm font-medium">Create discounted bundles of multiple services.</p>
        </div>
        
        <Button 
          onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ serviceIds: [], features: [], discountPercentage: 10, isPopular: false }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          disabled={adminRole !== 'admin'}
          className="h-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-2xl px-8 shadow-xl shadow-primary/20 group border-none"
        >
          <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" /> Create Package
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
                      {editingId ? "Edit Package" : "Create New Package"}
                    </CardTitle>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      Combine services for a better value
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Package Title</label>
                      <Input 
                        placeholder="e.g. Complete Car Rejuvenation" 
                        value={formData.title || ""} 
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs uppercase tracking-widest"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Discount (%)</label>
                        <Input 
                          type="number"
                          placeholder="10" 
                          value={formData.discountPercentage || ""} 
                          onChange={e => setFormData({...formData, discountPercentage: Number(e.target.value)})}
                          className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs uppercase tracking-widest"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Estimated Price</label>
                        <div className="h-12 bg-slate-100 border-slate-200 text-slate-900 rounded-xl flex items-center px-4 font-black text-sm">
                          ₹{calculatePackagePrice().toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Select Services</label>
                      <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-100">
                        {services.map(service => (
                          <div 
                            key={service.id}
                            onClick={() => toggleService(service.id)}
                            className={cn(
                              "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all border",
                              formData.serviceIds?.includes(service.id) 
                                ? "bg-primary/5 border-primary/20 text-primary" 
                                : "bg-white border-slate-100 text-slate-600 hover:border-slate-300"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "h-5 w-5 rounded flex items-center justify-center border transition-colors",
                                formData.serviceIds?.includes(service.id) ? "bg-primary border-primary" : "bg-white border-slate-300"
                              )}>
                                {formData.serviceIds?.includes(service.id) && <Check className="h-3 w-3 text-white" />}
                              </div>
                              <span className="text-xs font-bold uppercase tracking-tight">{service.title}</span>
                            </div>
                            <span className="text-[10px] font-black">₹{service.basePrice.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Package Image</label>
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:border-primary/30 transition-all group/upload">
                        <ImageUpload 
                          value={formData.imageUrl || ""}
                          onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Description</label>
                      <Textarea 
                        placeholder="Describe the value of this package..." 
                        value={formData.description || ""} 
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="min-h-[100px] bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-medium text-sm"
                      />
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <input 
                        type="checkbox" 
                        id="isPopular"
                        checked={formData.isPopular}
                        onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                        className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="isPopular" className="text-[10px] font-black text-slate-600 uppercase tracking-widest cursor-pointer">Mark as Popular / Featured</label>
                    </div>
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
                    Save Package
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {servicePackages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-white border-slate-100 shadow-2xl shadow-slate-200/50 hover:border-primary/30 transition-all duration-500 group overflow-hidden rounded-[2rem] h-full flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  {pkg.imageUrl ? (
                    <img src={pkg.imageUrl} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                      <Package className="h-12 w-12 text-slate-300" />
                    </div>
                  )}
                  {pkg.isPopular && (
                    <div className="absolute top-4 left-4 bg-primary text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                      Popular
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                    {pkg.discountPercentage}% OFF
                  </div>
                </div>
                
                <CardContent className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter group-hover:text-primary transition-colors">{pkg.title}</h3>
                    <div className="text-right">
                      <p className="text-lg font-black text-slate-900">₹{pkg.basePrice.toLocaleString()}</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest line-through">
                        ₹{services.filter(s => pkg.serviceIds.includes(s.id)).reduce((sum, s) => sum + s.basePrice, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-500 font-medium mb-6 line-clamp-2">{pkg.description}</p>
                  
                  <div className="space-y-2 mb-8 flex-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Included Services:</p>
                    {pkg.serviceIds.map(sid => {
                      const service = services.find(s => s.id === sid);
                      return (
                        <div key={sid} className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                          <Check className="h-3 w-3 text-emerald-500" />
                          {service?.title || "Unknown Service"}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-3 pt-6 border-t border-slate-100">
                    <Button 
                      variant="ghost" 
                      onClick={() => handleEdit(pkg)}
                      className="flex-1 h-10 bg-slate-50 border border-slate-100 text-slate-600 hover:text-primary hover:bg-primary/5 rounded-xl font-black uppercase tracking-widest text-[10px]"
                    >
                      <Edit2 className="h-3 w-3 mr-2" /> Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => handleDelete(pkg.id)}
                      className="h-10 w-10 bg-slate-50 border border-slate-100 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl"
                    >
                      <Trash2 className="h-3 w-3" />
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
