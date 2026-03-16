import { useState } from "react";
import { useData, Location } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Search, MapPin, Trash2, Edit2, Check, X, Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export function Locations() {
  const { locations, updateLocations, adminRole } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newLocation, setNewLocation] = useState({ 
    name: "", 
    address: "", 
    city: "", 
    phone: "", 
    email: "", 
    latitude: 0, 
    longitude: 0, 
    googleMapsUrl: "",
    isPopular: false, 
    workingHours: "09:00 AM - 08:00 PM" 
  });
  const [editLocation, setEditLocation] = useState({ 
    name: "", 
    address: "", 
    city: "", 
    phone: "", 
    email: "", 
    latitude: 0, 
    longitude: 0, 
    googleMapsUrl: "",
    isPopular: false, 
    workingHours: "" 
  });

  const filteredLocations = locations.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    if (!newLocation.name.trim() || !newLocation.city.trim()) {
      toast.error("Name and City are required");
      return;
    }
    const location: Location = {
      id: Math.random().toString(36).substring(2, 9),
      ...newLocation
    };
    updateLocations([...locations, location]);
    setNewLocation({ 
      name: "", 
      address: "", 
      city: "", 
      phone: "", 
      email: "", 
      latitude: 0, 
      longitude: 0, 
      isPopular: false, 
      workingHours: "09:00 AM - 08:00 PM" 
    });
    setIsAdding(false);
    toast.success("Location added successfully");
  };

  const handleUpdate = (id: string) => {
    if (!editLocation.name.trim() || !editLocation.city.trim()) {
      toast.error("Name and City are required");
      return;
    }
    const updated = locations.map(l => 
      l.id === id ? { ...l, ...editLocation } : l
    );
    updateLocations(updated);
    setEditingId(null);
    toast.success("Location updated successfully");
  };

  const handleDelete = (id: string) => {
    if (adminRole !== 'admin') {
      toast.error("Permission denied");
      return;
    }
    updateLocations(locations.filter(l => l.id !== id));
    toast.success("Location removed");
  };

  const togglePopular = (id: string) => {
    const updated = locations.map(l => 
      l.id === id ? { ...l, isPopular: !l.isPopular } : l
    );
    updateLocations(updated);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
            <MapPin className="h-3 w-3" /> Geography
          </div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">City Management</h1>
          <p className="text-slate-500 text-sm font-medium">Configure operational cities and popular hubs.</p>
        </div>
        
        <Button 
          onClick={() => setIsAdding(true)}
          className="h-14 px-8 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary/20 group"
        >
          <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" />
          Add New City
        </Button>
      </div>

      {/* Search & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="SEARCH CITIES..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-16 pl-14 bg-white border-slate-100 text-slate-900 rounded-2xl focus:ring-primary/20 focus:border-primary/50 font-black text-sm uppercase tracking-widest shadow-sm"
          />
        </div>
        <Card className="bg-white border-slate-100 shadow-sm rounded-2xl flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Cities</p>
            <p className="text-2xl font-black text-slate-900">{locations.length}</p>
          </div>
        </Card>
      </div>

      {/* Add New Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-white border-primary/20 shadow-2xl rounded-[2.5rem] overflow-hidden">
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Workshop Name</label>
                    <Input 
                      value={newLocation.name}
                      onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                      placeholder="E.G. NEW DELHI HUB"
                      className="h-14 bg-slate-50 border-slate-100 text-slate-900 rounded-2xl focus:ring-primary/20 focus:border-primary/50 font-black text-sm uppercase tracking-widest"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">City</label>
                    <Input 
                      value={newLocation.city}
                      onChange={(e) => setNewLocation({...newLocation, city: e.target.value})}
                      placeholder="E.G. NEW DELHI"
                      className="h-14 bg-slate-50 border-slate-100 text-slate-900 rounded-2xl focus:ring-primary/20 focus:border-primary/50 font-black text-sm uppercase tracking-widest"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Address</label>
                    <Input 
                      value={newLocation.address}
                      onChange={(e) => setNewLocation({...newLocation, address: e.target.value})}
                      placeholder="FULL ADDRESS"
                      className="h-14 bg-slate-50 border-slate-100 text-slate-900 rounded-2xl focus:ring-primary/20 focus:border-primary/50 font-black text-sm uppercase tracking-widest"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Phone</label>
                    <Input 
                      value={newLocation.phone}
                      onChange={(e) => setNewLocation({...newLocation, phone: e.target.value})}
                      placeholder="+91-XXXXX-XXXXX"
                      className="h-14 bg-slate-50 border-slate-100 text-slate-900 rounded-2xl focus:ring-primary/20 focus:border-primary/50 font-black text-sm uppercase tracking-widest"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email</label>
                    <Input 
                      value={newLocation.email}
                      onChange={(e) => setNewLocation({...newLocation, email: e.target.value})}
                      placeholder="CITY@CARMECHS.IN"
                      className="h-14 bg-slate-50 border-slate-100 text-slate-900 rounded-2xl focus:ring-primary/20 focus:border-primary/50 font-black text-sm uppercase tracking-widest"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Latitude</label>
                    <Input 
                      type="number"
                      step="0.0001"
                      value={newLocation.latitude}
                      onChange={(e) => setNewLocation({...newLocation, latitude: parseFloat(e.target.value)})}
                      className="h-14 bg-slate-50 border-slate-100 text-slate-900 rounded-2xl focus:ring-primary/20 focus:border-primary/50 font-black text-sm uppercase tracking-widest"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Longitude</label>
                    <Input 
                      type="number"
                      step="0.0001"
                      value={newLocation.longitude}
                      onChange={(e) => setNewLocation({...newLocation, longitude: parseFloat(e.target.value)})}
                      className="h-14 bg-slate-50 border-slate-100 text-slate-900 rounded-2xl focus:ring-primary/20 focus:border-primary/50 font-black text-sm uppercase tracking-widest"
                    />
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Google Maps Embed URL</label>
                    <Input 
                      value={newLocation.googleMapsUrl}
                      onChange={(e) => setNewLocation({...newLocation, googleMapsUrl: e.target.value})}
                      placeholder="HTTPS://WWW.GOOGLE.COM/MAPS/EMBED?..."
                      className="h-14 bg-slate-50 border-slate-100 text-slate-900 rounded-2xl focus:ring-primary/20 focus:border-primary/50 font-black text-sm uppercase tracking-widest"
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-end gap-6 pt-4">
                  <div className="flex-1 space-y-3 w-full">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Working Hours</label>
                    <Input 
                      value={newLocation.workingHours}
                      onChange={(e) => setNewLocation({...newLocation, workingHours: e.target.value})}
                      placeholder="09:00 AM - 08:00 PM"
                      className="h-14 bg-slate-50 border-slate-100 text-slate-900 rounded-2xl focus:ring-primary/20 focus:border-primary/50 font-black text-sm uppercase tracking-widest"
                    />
                  </div>
                  <div className="flex items-center gap-4 h-14 px-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Popular Hub?</span>
                    <button 
                      onClick={() => setNewLocation({...newLocation, isPopular: !newLocation.isPopular})}
                      className={cn(
                        "h-6 w-11 rounded-full transition-all relative",
                        newLocation.isPopular ? "bg-primary" : "bg-slate-200"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 left-1 h-4 w-4 bg-white rounded-full transition-all",
                        newLocation.isPopular ? "translate-x-5" : "translate-x-0"
                      )} />
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setIsAdding(false)} className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] border-slate-200">Cancel</Button>
                    <Button onClick={handleAdd} className="h-14 px-8 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">Confirm Add</Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredLocations.map((location) => (
          <motion.div
            key={location.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className={cn(
              "bg-white border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500 rounded-[2rem] overflow-hidden group",
              editingId === location.id && "ring-2 ring-primary/50 border-transparent"
            )}>
              <CardContent className="p-6">
                {editingId === location.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <Input 
                        value={editLocation.name}
                        onChange={(e) => setEditLocation({...editLocation, name: e.target.value})}
                        className="h-10 bg-slate-50 border-slate-100 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest"
                        placeholder="NAME"
                      />
                      <Input 
                        value={editLocation.city}
                        onChange={(e) => setEditLocation({...editLocation, city: e.target.value})}
                        className="h-10 bg-slate-50 border-slate-100 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest"
                        placeholder="CITY"
                      />
                    </div>
                    <Input 
                      value={editLocation.address}
                      onChange={(e) => setEditLocation({...editLocation, address: e.target.value})}
                      className="h-10 bg-slate-50 border-slate-100 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest"
                      placeholder="ADDRESS"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input 
                        value={editLocation.phone}
                        onChange={(e) => setEditLocation({...editLocation, phone: e.target.value})}
                        className="h-10 bg-slate-50 border-slate-100 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest"
                        placeholder="PHONE"
                      />
                      <Input 
                        value={editLocation.email}
                        onChange={(e) => setEditLocation({...editLocation, email: e.target.value})}
                        className="h-10 bg-slate-50 border-slate-100 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest"
                        placeholder="EMAIL"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input 
                        type="number"
                        value={editLocation.latitude}
                        onChange={(e) => setEditLocation({...editLocation, latitude: parseFloat(e.target.value)})}
                        className="h-10 bg-slate-50 border-slate-100 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest"
                        placeholder="LAT"
                      />
                      <Input 
                        type="number"
                        value={editLocation.longitude}
                        onChange={(e) => setEditLocation({...editLocation, longitude: parseFloat(e.target.value)})}
                        className="h-10 bg-slate-50 border-slate-100 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest"
                        placeholder="LNG"
                      />
                    </div>
                    <Input 
                      value={editLocation.workingHours}
                      onChange={(e) => setEditLocation({...editLocation, workingHours: e.target.value})}
                      className="h-10 bg-slate-50 border-slate-100 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest"
                      placeholder="WORKING HOURS"
                    />
                    <Input 
                      value={editLocation.googleMapsUrl}
                      onChange={(e) => setEditLocation({...editLocation, googleMapsUrl: e.target.value})}
                      className="h-10 bg-slate-50 border-slate-100 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest"
                      placeholder="GOOGLE MAPS EMBED URL"
                    />
                    <div className="flex items-center justify-between px-2">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Popular Hub</span>
                       <button 
                        onClick={() => setEditLocation({...editLocation, isPopular: !editLocation.isPopular})}
                        className={cn(
                          "h-5 w-9 rounded-full transition-all relative",
                          editLocation.isPopular ? "bg-primary" : "bg-slate-200"
                        )}
                      >
                        <div className={cn(
                          "absolute top-0.5 left-0.5 h-4 w-4 bg-white rounded-full transition-all",
                          editLocation.isPopular ? "translate-x-4" : "translate-x-0"
                        )} />
                      </button>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" onClick={() => handleUpdate(location.id)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 font-black uppercase tracking-widest text-[9px]">Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="flex-1 rounded-xl h-10 font-black uppercase tracking-widest text-[9px]">Cancel</Button>
                    </div>
                  </div>
                ) : (
                    <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center transition-all shadow-sm border",
                        location.isPopular ? "bg-primary/5 border-primary/10 text-primary" : "bg-slate-50 border-slate-100 text-slate-400"
                      )}>
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest group-hover:text-primary transition-colors">{location.name}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{location.city}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {location.isPopular && (
                            <span className="flex items-center gap-1 text-[8px] font-black text-primary uppercase tracking-widest bg-primary/5 px-1.5 py-0.5 rounded-full">
                              <Star className="h-2 w-2 fill-primary" /> Popular
                            </span>
                          )}
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">ID: {location.id}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setEditingId(location.id);
                          setEditLocation({ 
                            name: location.name, 
                            city: location.city,
                            address: location.address,
                            phone: location.phone,
                            email: location.email,
                            latitude: location.latitude,
                            longitude: location.longitude,
                            googleMapsUrl: location.googleMapsUrl || "",
                            workingHours: location.workingHours,
                            isPopular: location.isPopular 
                          });
                        }}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary transition-colors"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(location.id)}
                        className="p-2 hover:bg-primary/5 rounded-lg text-slate-400 hover:text-primary transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredLocations.length === 0 && (
        <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
          <MapPin className="h-12 w-12 text-slate-200 mx-auto mb-4" />
          <p className="text-sm font-black text-slate-300 uppercase tracking-widest">No cities found matching your search</p>
        </div>
      )}
    </div>
  );
}
