import { useState, ChangeEvent } from "react";
import { useData, Brand } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit2, Save, X, Upload, ImageIcon, Zap, ArrowRight, Shield } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ImageUpload";
import { motion, AnimatePresence } from "motion/react";

export function Brands() {
  const { brands, updateBrands, adminRole } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Brand>>({});

  const handleEdit = (brand: Brand) => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to edit brands.");
      return;
    }
    setEditingId(brand.id);
    setFormData(brand);
    setIsAdding(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to delete brands.");
      return;
    }
    if (confirm("Are you sure you want to delete this brand?")) {
      updateBrands(brands.filter(b => b.id !== id));
      toast.success("Brand deleted successfully");
    }
  };

  const handleSave = () => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to save brands.");
      return;
    }
    if (!formData.name || !formData.imageUrl) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newBrand: Brand = {
      id: editingId || Date.now().toString(),
      name: formData.name || "",
      imageUrl: formData.imageUrl || "",
    };

    if (editingId) {
      updateBrands(brands.map(b => b.id === editingId ? newBrand : b));
      toast.success("Brand updated successfully");
    } else {
      updateBrands([...brands, newBrand]);
      toast.success("Brand added successfully");
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
            <Shield className="h-3 w-3" /> Management
          </div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Brand Directory</h1>
          <p className="text-slate-400 text-sm font-medium">Manage the vehicle brands supported by your platform.</p>
        </div>
        
        <Button 
          onClick={() => { setIsAdding(true); setEditingId(null); setFormData({}); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          disabled={adminRole !== 'admin'}
          className="h-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-2xl px-8 shadow-xl shadow-primary/20 group"
        >
          <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" /> Add New Brand
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
            <Card className="bg-[#0A0A0A] border-white/5 shadow-2xl overflow-hidden rounded-[2rem]">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary opacity-50" />
              <CardHeader className="border-b border-white/5 p-8">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black text-white uppercase tracking-tighter">
                      {editingId ? "Edit Brand" : "Create New Brand"}
                    </CardTitle>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                      {editingId ? `Brand ID: ${editingId}` : "Enter brand details below"}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">Brand Name</label>
                      <Input 
                        placeholder="e.g. Toyota" 
                        value={formData.name || ""} 
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="h-12 bg-white/5 border-white/5 text-white rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs uppercase tracking-widest"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">Brand Logo</label>
                      <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:border-primary/30 transition-all group/upload">
                        <ImageUpload 
                          value={formData.imageUrl || ""}
                          onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                        />
                        <div className="mt-4 flex items-center gap-2 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                          <Shield className="h-3 w-3 text-primary" /> Max size 5MB. Transparent PNG recommended.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-8 border-t border-white/5">
                  <Button 
                    variant="ghost" 
                    onClick={() => { setIsAdding(false); setEditingId(null); }}
                    className="h-12 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5 rounded-xl px-8"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSave}
                    className="h-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-xl px-12 shadow-xl shadow-primary/20"
                  >
                    Save Brand
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-[#0A0A0A] border-white/5 shadow-sm hover:border-primary/30 transition-all duration-500 group overflow-hidden rounded-[2rem]">
                <CardContent className="p-0">
                  <div className="h-40 bg-white/5 flex items-center justify-center p-8 border-b border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <img src={brand.imageUrl} alt={brand.name} className="max-h-full max-w-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-6 flex items-center justify-between">
                    <h3 className="text-lg font-black text-white uppercase tracking-tighter group-hover:text-primary transition-colors">{brand.name}</h3>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEdit(brand)}
                        className="h-10 w-10 bg-white/5 border border-white/5 text-slate-500 hover:text-primary hover:bg-primary/10 hover:border-primary/30 rounded-xl transition-all"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(brand.id)}
                        className="h-10 w-10 bg-white/5 border border-white/5 text-slate-500 hover:text-primary hover:bg-primary/10 hover:border-primary/30 rounded-xl transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        {brands.length === 0 && (
          <div className="col-span-full text-center py-24 bg-[#0A0A0A] rounded-[2rem] border-2 border-dashed border-white/5">
            <div className="h-20 w-20 rounded-[2rem] bg-white/5 flex items-center justify-center border border-white/5 mx-auto mb-4">
              <ImageIcon className="h-10 w-10 text-slate-600" />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-white/40">No Brands Found</p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1 text-slate-600">Click "Add New Brand" to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
