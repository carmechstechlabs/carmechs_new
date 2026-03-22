import { useState } from "react";
import { useData, CarModel, PricingItem } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Car, Fuel, Layers, Activity, Zap, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/components/ImageUpload";

export function VehicleConfig() {
  const { 
    carMakes, updateCarMakes, 
    carModels, updateCarModels, 
    fuelTypes, updateFuelTypes,
    adminRole 
  } = useData();

  const [activeTab, setActiveTab] = useState<'makes' | 'models' | 'fuel'>('makes');

  // Makes State
  const [newMake, setNewMake] = useState("");
  const [newMakeLogo, setNewMakeLogo] = useState("");
  
  // Models State
  const [newModel, setNewModel] = useState({ name: "", make: "", year: "", price: 0 });

  // Fuel State
  const [newFuel, setNewFuel] = useState({ name: "", price: 0 });

  const handleAddMake = () => {
    if (!newMake.trim()) return;
    if (carMakes.some(m => m.name.toLowerCase() === newMake.toLowerCase())) {
      toast.error("Make already exists");
      return;
    }
    updateCarMakes([...carMakes, { id: `make_${Date.now()}`, name: newMake, price: 0, imageUrl: newMakeLogo }]);
    setNewMake("");
    setNewMakeLogo("");
    toast.success("Manufacturer added");
  };

  const handleRemoveMake = (name: string) => {
    updateCarMakes(carMakes.filter(m => m.name !== name));
    // Also remove associated models
    updateCarModels(carModels.filter(m => m.make !== name));
    toast.success("Manufacturer removed");
  };

  const handleAddModel = () => {
    if (!newModel.name || !newModel.make) {
      toast.error("Please fill all fields");
      return;
    }
    const makeId = carMakes.find(m => m.name === newModel.make)?.id || `make_${Date.now()}`;
    updateCarModels([...carModels, { 
      id: `model_${Date.now()}`, 
      makeId, 
      ...newModel 
    }]);
    setNewModel({ name: "", make: "", year: "", price: 0 });
    toast.success("Model added");
  };

  const handleRemoveModel = (model: CarModel) => {
    updateCarModels(carModels.filter(m => !(m.name === model.name && m.make === model.make)));
    toast.success("Model removed");
  };

  const handleAddFuel = () => {
    if (!newFuel.name) return;
    updateFuelTypes([...fuelTypes, { id: `fuel_${Date.now()}`, ...newFuel }]);
    setNewFuel({ name: "", price: 0 });
    toast.success("Fuel type added");
  };

  const handleRemoveFuel = (name: string) => {
    updateFuelTypes(fuelTypes.filter(f => f.name !== name));
    toast.success("Fuel type removed");
  };

  if (adminRole !== 'admin') {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <Zap className="h-16 w-16 text-slate-200 mb-6" />
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">Access Restricted</h2>
        <p className="text-slate-500 max-w-md">You do not have the necessary clearance to modify vehicle configurations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
            <Activity className="h-3 w-3" /> Configuration
          </div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Vehicle Parameters</h1>
          <p className="text-slate-500 text-sm font-medium">Manage manufacturers, models, and propulsion systems.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('makes')}
          className={cn(
            "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
            activeTab === 'makes' ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
          )}
        >
          Manufacturers
        </button>
        <button 
          onClick={() => setActiveTab('models')}
          className={cn(
            "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
            activeTab === 'models' ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
          )}
        >
          Models
        </button>
        <button 
          onClick={() => setActiveTab('fuel')}
          className={cn(
            "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
            activeTab === 'fuel' ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
          )}
        >
          Fuel Types
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'makes' && (
          <motion.div
            key="makes"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <Card className="bg-white border-slate-100 shadow-xl rounded-[2rem]">
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase tracking-tight">Add Manufacturer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Name</label>
                  <Input 
                    placeholder="e.g. Toyota" 
                    value={newMake}
                    onChange={e => setNewMake(e.target.value)}
                    className="h-12 bg-slate-50 border-slate-100 rounded-xl font-bold uppercase"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Brand Logo</label>
                  <ImageUpload 
                    value={newMakeLogo}
                    onChange={setNewMakeLogo}
                    className="h-32"
                  />
                </div>
                <Button onClick={handleAddMake} className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-xl">
                  Add Make
                </Button>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {carMakes.map((make) => (
                <Card key={make.name} className="bg-white border-slate-100 shadow-sm hover:border-primary/30 transition-all rounded-2xl group">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors overflow-hidden">
                        {make.imageUrl ? (
                          <img src={make.imageUrl} alt={make.name} className="h-full w-full object-contain p-1" referrerPolicy="no-referrer" />
                        ) : (
                          <Car className="h-5 w-5" />
                        )}
                      </div>
                      <span className="text-sm font-black uppercase tracking-tight text-slate-900">{make.name}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveMake(make.name)}
                      className="h-8 w-8 text-slate-300 hover:text-primary hover:bg-primary/5 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'models' && (
          <motion.div
            key="models"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <Card className="bg-white border-slate-100 shadow-xl rounded-[2rem]">
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase tracking-tight">Add Model</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Manufacturer</label>
                  <select 
                    className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm font-bold uppercase focus:ring-2 focus:ring-primary/20 outline-none"
                    value={newModel.make}
                    onChange={e => setNewModel({...newModel, make: e.target.value})}
                  >
                    <option value="">Select Make</option>
                    {carMakes.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Model Name</label>
                  <Input 
                    placeholder="e.g. Corolla" 
                    value={newModel.name}
                    onChange={e => setNewModel({...newModel, name: e.target.value})}
                    className="h-12 bg-slate-50 border-slate-100 rounded-xl font-bold uppercase"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Year</label>
                  <Input 
                    placeholder="e.g. 2024" 
                    value={newModel.year}
                    onChange={e => setNewModel({...newModel, year: e.target.value})}
                    className="h-12 bg-slate-50 border-slate-100 rounded-xl font-bold uppercase"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Price Adjustment (₹)</label>
                  <Input 
                    type="number"
                    placeholder="0" 
                    value={newModel.price}
                    onChange={e => setNewModel({...newModel, price: Number(e.target.value)})}
                    className="h-12 bg-slate-50 border-slate-100 rounded-xl font-bold uppercase"
                  />
                </div>
                <Button onClick={handleAddModel} className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-xl">
                  Add Model
                </Button>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-4">
              {carMakes.map(make => {
                const models = carModels.filter(m => m.make === make.name);
                if (models.length === 0) return null;
                return (
                  <div key={make.name} className="space-y-3">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">{make.name}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {models.map((model) => (
                        <Card key={`${model.make}-${model.name}`} className="bg-white border-slate-100 shadow-sm hover:border-primary/30 transition-all rounded-2xl group">
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-black uppercase tracking-tight text-slate-900">{model.name}</span>
                                {model.year && <span className="text-[10px] font-bold text-slate-400">({model.year})</span>}
                              </div>
                              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">+₹{model.price}</span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleRemoveModel(model)}
                              className="h-8 w-8 text-slate-300 hover:text-primary hover:bg-primary/5 rounded-lg"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === 'fuel' && (
          <motion.div
            key="fuel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <Card className="bg-white border-slate-100 shadow-xl rounded-[2rem]">
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase tracking-tight">Add Fuel Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Name</label>
                  <Input 
                    placeholder="e.g. Electric" 
                    value={newFuel.name}
                    onChange={e => setNewFuel({...newFuel, name: e.target.value})}
                    className="h-12 bg-slate-50 border-slate-100 rounded-xl font-bold uppercase"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Price Adjustment (₹)</label>
                  <Input 
                    type="number"
                    placeholder="0" 
                    value={newFuel.price}
                    onChange={e => setNewFuel({...newFuel, price: Number(e.target.value)})}
                    className="h-12 bg-slate-50 border-slate-100 rounded-xl font-bold uppercase"
                  />
                </div>
                <Button onClick={handleAddFuel} className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-xl">
                  Add Fuel Type
                </Button>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fuelTypes.map((fuel) => (
                <Card key={fuel.name} className="bg-white border-slate-100 shadow-sm hover:border-primary/30 transition-all rounded-2xl group">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                        <Fuel className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black uppercase tracking-tight text-slate-900">{fuel.name}</span>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">+₹{fuel.price}</span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveFuel(fuel.name)}
                      className="h-8 w-8 text-slate-300 hover:text-primary hover:bg-primary/5 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
