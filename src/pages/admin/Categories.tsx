import { useState } from "react";
import { useData, ServiceCategory } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, Search, Trash2, Edit2, LayoutGrid, 
  Wrench, ShieldCheck, Clock, IndianRupee, 
  Star, Settings2, ChevronRight, Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger 
} from "@/components/ui/dialog";

const IconOptions = [
  { name: 'Wrench', icon: Wrench },
  { name: 'ShieldCheck', icon: ShieldCheck },
  { name: 'Clock', icon: Clock },
  { name: 'IndianRupee', icon: IndianRupee },
  { name: 'Star', icon: Star },
  { name: 'Settings2', icon: Settings2 },
  { name: 'LayoutGrid', icon: LayoutGrid },
  { name: 'ImageIcon', icon: ImageIcon }
];

export function Categories() {
  const { categories, updateCategories, adminRole } = useData();
  const [search, setSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  const [newCategory, setNewCategory] = useState<Partial<ServiceCategory>>({
    name: "",
    description: "",
    iconName: "Wrench"
  });

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(search.toLowerCase()) || 
    cat.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to modify categories.");
      return;
    }

    if (!newCategory.name || !newCategory.description) {
      toast.error("Please fill in all required fields.");
      return;
    }

    let updatedCategories: ServiceCategory[];
    if (editingCategory) {
      updatedCategories = categories.map(cat => 
        cat.id === editingCategory.id ? { ...cat, ...newCategory } as ServiceCategory : cat
      );
      toast.success("Category updated successfully");
    } else {
      const catToAdd: ServiceCategory = {
        ...newCategory as ServiceCategory,
        id: `cat_${Date.now()}`
      };
      updatedCategories = [...categories, catToAdd];
      toast.success("Category created successfully");
    }

    updateCategories(updatedCategories);
    setIsAddDialogOpen(false);
    setEditingCategory(null);
    setNewCategory({ name: "", description: "", iconName: "Wrench" });
  };

  const handleDelete = (id: string) => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to delete categories.");
      return;
    }
    updateCategories(categories.filter(cat => cat.id !== id));
    toast.success("Category removed successfully");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Service Categories</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Organize your services into logical groups for better navigation.</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingCategory(null); setNewCategory({ name: "", description: "", iconName: "Wrench" }); }} className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-xl shadow-primary/10 h-12 px-6">
              <Plus className="h-4 w-4 mr-2" /> Create Category
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-[2rem] border-slate-200 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-black uppercase tracking-tight">
                {editingCategory ? "Edit Category" : "New Category"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category Name</label>
                <Input 
                  value={newCategory.name} 
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  placeholder="e.g., Periodic Maintenance"
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                <Textarea 
                  value={newCategory.description} 
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  placeholder="Describe what services fall into this category..."
                  className="rounded-2xl min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Icon Representation</label>
                <div className="grid grid-cols-4 gap-3">
                  {IconOptions.map((opt) => (
                    <button
                      key={opt.name}
                      onClick={() => setNewCategory({...newCategory, iconName: opt.name})}
                      className={cn(
                        "h-12 w-full rounded-xl border flex items-center justify-center transition-all",
                        newCategory.iconName === opt.name 
                          ? "bg-primary/5 border-primary/20 text-primary shadow-inner" 
                          : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
                      )}
                    >
                      <opt.icon className="h-5 w-5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="rounded-xl">Cancel</Button>
              <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-8">
                {editingCategory ? "Update Category" : "Create Category"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Search categories..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-12 rounded-2xl border-slate-200 bg-white shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredCategories.map((cat) => {
            const Icon = IconOptions.find(o => o.name === cat.iconName)?.icon || Wrench;
            return (
              <motion.div 
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative"
              >
                <Card className="rounded-[2.5rem] border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 overflow-hidden bg-white h-full flex flex-col">
                  <div className="p-8 flex-1">
                    <div className="flex items-start justify-between mb-8">
                      <div className="h-16 w-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary group-hover:scale-110 transition-all duration-500 border border-slate-100 group-hover:border-primary/10">
                        <Icon className="h-8 w-8" />
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => { setEditingCategory(cat); setNewCategory(cat); setIsAddDialogOpen(true); }}
                          className="h-10 w-10 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(cat.id)}
                          className="h-10 w-10 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/5"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-3 group-hover:text-primary transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                  
                  <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Active Services: <span className="text-slate-900">12</span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {filteredCategories.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="h-20 w-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <LayoutGrid className="h-10 w-10 text-slate-200" />
            </div>
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">No categories found</h3>
            <p className="text-sm text-slate-500 font-medium">Create your first category to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
