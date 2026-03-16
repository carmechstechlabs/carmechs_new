import { useState } from "react";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Trash2, Edit2, Car, Fuel, Wrench, Search, Zap, Shield, ArrowRight, X } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "motion/react";

export function Cars() {
  const { carMakes, carModels, fuelTypes, updateCarMakes, updateCarModels, updateFuelTypes, adminRole } = useData();
  const [activeTab, setActiveTab] = useState<'makes' | 'models' | 'fuels'>('makes');
  const [newItem, setNewItem] = useState("");
  const [newPrice, setNewPrice] = useState("0");
  const [newYear, setNewYear] = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [editingItem, setEditingItem] = useState<{ originalName: string, name: string, price: string, make?: string, year?: string } | null>(null);

  const handleAdd = () => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to add items.");
      return;
    }
    if (!newItem) return;
    
    const price = parseFloat(newPrice);
    if (isNaN(price)) {
      toast.error("Please enter a valid price");
      return;
    }

    if (activeTab === 'models' && !selectedMake) {
      toast.error("Please select a car make");
      return;
    }

    if (activeTab === 'makes') {
      updateCarMakes([...carMakes, { name: newItem, price }]);
    } else if (activeTab === 'models') {
      updateCarModels([...carModels, { name: newItem, price, make: selectedMake, year: newYear }]);
    } else {
      updateFuelTypes([...fuelTypes, { name: newItem, price }]);
    }
    
    setNewItem("");
    setNewPrice("0");
    setNewYear("");
    toast.success("Item added successfully");
  };

  const handleUpdate = () => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to update items.");
      return;
    }
    if (!editingItem || !editingItem.name) return;

    const price = parseFloat(editingItem.price);
    if (isNaN(price)) {
      toast.error("Please enter a valid price");
      return;
    }

    if (activeTab === 'models' && !editingItem.make) {
      toast.error("Please select a car make");
      return;
    }

    if (activeTab === 'makes') {
      const updatedItem = { name: editingItem.name, price };
      updateCarMakes(carMakes.map(item => item.name === editingItem.originalName ? updatedItem : item));
    } else if (activeTab === 'models') {
      const updatedItem = { name: editingItem.name, price, make: editingItem.make!, year: editingItem.year };
      updateCarModels(carModels.map(item => item.name === editingItem.originalName ? updatedItem : item));
    } else {
      const updatedItem = { name: editingItem.name, price };
      updateFuelTypes(fuelTypes.map(item => item.name === editingItem.originalName ? updatedItem : item));
    }

    setEditingItem(null);
    toast.success("Item updated successfully");
  };

  const handleDelete = (itemName: string) => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to delete items.");
      return;
    }
    if (confirm(`Delete ${itemName}?`)) {
      if (activeTab === 'makes') {
        updateCarMakes(carMakes.filter(m => m.name !== itemName));
      } else if (activeTab === 'models') {
        updateCarModels(carModels.filter(m => m.name !== itemName));
      } else {
        updateFuelTypes(fuelTypes.filter(m => m.name !== itemName));
      }
      toast.success("Item deleted successfully");
    }
  };

  const startEditing = (item: any) => {
    setEditingItem({
      originalName: item.name,
      name: item.name,
      price: item.price.toString(),
      make: item.make,
      year: item.year || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [searchTerm, setSearchTerm] = useState("");

  const tabs = [
    { id: 'makes', label: 'Car Makes', icon: Car, data: carMakes },
    { id: 'models', label: 'Car Models', icon: Wrench, data: carModels },
    { id: 'fuels', label: 'Fuel Types', icon: Fuel, data: fuelTypes },
  ];

  const filteredData = tabs.find(t => t.id === activeTab)?.data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
            <Car className="h-3 w-3" /> Vehicle Data
          </div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Fleet Parameters</h1>
          <p className="text-slate-500 text-sm font-medium">Configure vehicle makes, models, and fuel specifications.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setEditingItem(null); setSearchTerm(""); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest ${
                activeTab === tab.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "bg-transparent text-slate-400 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <tab.icon className={`h-3.5 w-3.5 ${activeTab === tab.id ? "animate-pulse" : ""}`} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1 space-y-6">
          <Card className={`bg-white border-slate-200 shadow-sm rounded-[2rem] overflow-hidden sticky top-8 transition-all duration-500 ${editingItem ? "ring-2 ring-primary/20 border-primary/30" : ""}`}>
            <div className={`absolute top-0 left-0 w-full h-1 ${editingItem ? "bg-primary" : "bg-slate-100"}`} />
            <CardHeader className="p-8 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center border transition-colors ${editingItem ? "bg-primary/5 border-primary/10" : "bg-slate-50 border-slate-100"}`}>
                  {editingItem ? <Edit2 className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-slate-400" />}
                </div>
                <div>
                  <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                    {editingItem ? "Edit Entry" : `New ${activeTab === 'makes' ? 'Make' : activeTab === 'models' ? 'Model' : 'Fuel'}`}
                  </CardTitle>
                  <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {editingItem ? "Modify existing parameters" : "Define new fleet specification"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Name / Designation</label>
                  <Input 
                    placeholder="Enter name..."
                    value={editingItem ? editingItem.name : newItem}
                    onChange={(e) => editingItem ? setEditingItem({...editingItem, name: e.target.value}) : setNewItem(e.target.value)}
                    className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs uppercase tracking-widest"
                  />
                </div>

                {activeTab === 'models' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Parent Make</label>
                      <Select 
                        value={editingItem ? editingItem.make : selectedMake} 
                        onValueChange={(val) => editingItem ? setEditingItem({...editingItem, make: val}) : setSelectedMake(val)}
                      >
                        <SelectTrigger className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs uppercase tracking-widest">
                          <SelectValue placeholder="Select Make" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 rounded-xl shadow-xl">
                          {carMakes.map((make) => (
                            <SelectItem key={make.name} value={make.name} className="font-bold text-xs uppercase tracking-widest focus:bg-primary/5 focus:text-primary transition-colors py-3">
                              {make.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Production Year</label>
                      <Input 
                        placeholder="e.g. 2024"
                        value={editingItem ? (editingItem.year || "") : newYear}
                        onChange={(e) => editingItem ? setEditingItem({...editingItem, year: e.target.value}) : setNewYear(e.target.value)}
                        className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs uppercase tracking-widest"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center justify-between">
                    Additional Price
                    <span className="text-primary font-black">₹{editingItem ? editingItem.price : newPrice}</span>
                  </label>
                  <Input 
                    type="number"
                    placeholder="0"
                    value={editingItem ? editingItem.price : newPrice}
                    onChange={(e) => editingItem ? setEditingItem({...editingItem, price: e.target.value}) : setNewPrice(e.target.value)}
                    className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-black text-lg"
                  />
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest px-1">
                    Added to base service pricing. 0 = standard rate.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                {editingItem ? (
                  <>
                    <Button 
                      onClick={handleUpdate}
                      className="h-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20"
                    >
                      Update Entry
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => setEditingItem(null)}
                      className="h-12 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={handleAdd}
                    className="h-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 group"
                  >
                    <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" /> Add Entry
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-4 bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <Input 
              placeholder={`Search ${tabs.find(t => t.id === activeTab)?.label}...`} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-none bg-transparent shadow-none focus-visible:ring-0 font-bold text-slate-900 placeholder:text-slate-300 uppercase tracking-widest text-xs"
            />
            {searchTerm && (
              <Button variant="ghost" size="icon" onClick={() => setSearchTerm("")} className="h-8 w-8 text-slate-400 hover:text-slate-900">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredData.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className="bg-white border-slate-200 shadow-sm hover:border-primary/30 transition-all duration-500 group overflow-hidden rounded-2xl">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-900 uppercase tracking-tighter group-hover:text-primary transition-colors">{item.name}</span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            +₹{item.price}
                          </span>
                        </div>
                        {activeTab === 'models' && (
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span className="text-primary/70">{(item as any).make}</span>
                            {(item as any).year && (
                              <>
                                <span className="h-1 w-1 rounded-full bg-slate-200" />
                                <span>{(item as any).year}</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => startEditing(item)}
                          className="h-9 w-9 bg-slate-50 border border-slate-100 text-slate-400 hover:text-primary hover:bg-primary/5 hover:border-primary/10 rounded-lg transition-all"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(item.name)}
                          className="h-9 w-9 bg-slate-50 border border-slate-100 text-slate-400 hover:text-primary hover:bg-primary/5 hover:border-primary/10 rounded-lg transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredData.length === 0 && (
              <div className="col-span-full text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
                <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 mx-auto mb-4">
                  <Search className="h-8 w-8 text-slate-300" />
                </div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-900/40">No Results Found</p>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-1 text-slate-400">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
