import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Wrench, 
  Car, 
  Battery, 
  Disc, 
  PaintBucket, 
  ShieldCheck, 
  CheckCircle2,
  Info,
  ChevronRight,
  Search,
  ArrowRight,
  Package,
  ArrowLeftRight,
  X,
  Zap
} from "lucide-react";
import { useState } from "react";
import { ServiceModal } from "@/components/ServiceModal";
import { useData, ServicePackage } from "@/context/DataContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

import * as LucideIcons from "lucide-react";

const getIcon = (service: any) => {
  if (service.iconUrl) {
    return <img src={service.iconUrl} alt={service.title} className="h-12 w-12 object-contain" />;
  }
  
  if (service.iconName) {
    const Icon = (LucideIcons as any)[service.iconName] || LucideIcons.Wrench;
    return <Icon className="h-10 w-10 text-primary" />;
  }

  switch (service.id) {
    case "periodic": return <LucideIcons.Wrench className="h-10 w-10 text-primary" />;
    case "tyres": return <LucideIcons.Disc className="h-10 w-10 text-primary" />;
    case "batteries": return <LucideIcons.Battery className="h-10 w-10 text-primary" />;
    case "denting": return <LucideIcons.PaintBucket className="h-10 w-10 text-primary" />;
    case "ac": return <LucideIcons.Car className="h-10 w-10 text-primary" />;
    case "spa": return <LucideIcons.ShieldCheck className="h-10 w-10 text-primary" />;
    default: return <LucideIcons.Wrench className="h-10 w-10 text-primary" />;
  }
};

export function Services() {
  const { services, servicePackages, carMakes, carModels, fuelTypes, categories } = useData();
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  
  // Vehicle Selection State
  const [selectedMake, setSelectedMake] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedFuel, setSelectedFuel] = useState<string>("");

  const calculatePrice = (basePrice: number) => {
    let additionalPrice = 0;

    const make = carMakes.find(m => m.name === selectedMake);
    if (make) additionalPrice += make.price;

    const model = carModels.find(m => m.name === selectedModel);
    if (model) additionalPrice += model.price;

    const fuel = fuelTypes.find(f => f.name === selectedFuel);
    if (fuel) additionalPrice += fuel.price;

    return Math.round(basePrice + additionalPrice);
  };

  const isVehicleSelected = selectedMake && selectedModel && selectedFuel;

  const toggleCompare = (id: string) => {
    setCompareList(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : (prev.length < 3 ? [...prev, id] : prev)
    );
  };

  const filteredServices = services
    .filter(s => {
      const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           s.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || s.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") {
        return (a.basePrice || 0) - (b.basePrice || 0);
      }
      if (sortBy === "price_desc") {
        return (b.basePrice || 0) - (a.basePrice || 0);
      }
      if (sortBy === "duration") {
        // Simple duration sort based on string length or first number if available
        const getNum = (s: string) => parseInt(s.match(/\d+/)?.[0] || "0");
        return getNum(a.duration) - getNum(b.duration);
      }
      return 0;
    });

  return (
    <div className="bg-slate-50 min-h-screen pb-32">
      {/* Hero Header */}
      <div className="bg-white pt-40 pb-32 relative overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-6"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Service Modules</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black text-slate-900 uppercase tracking-tighter leading-[0.85] mb-8"
            >
              Precision <br /> Maintenance
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed"
            >
              From periodic maintenance to complex mechanical repairs, our certified technicians ensure your vehicle performs at its absolute peak.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Service Packages Section */}
      {servicePackages.length > 0 && (
        <div className="container mx-auto px-4 lg:px-8 mb-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Exclusive Bundles</span>
              </div>
              <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">Service Packages</h2>
              <p className="text-slate-500 font-medium max-w-xl">Get multiple services combined at a special discounted rate. Maximum value for your vehicle.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {servicePackages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col lg:flex-row group"
              >
                <div className="lg:w-2/5 relative overflow-hidden h-64 lg:h-auto">
                  {pkg.imageUrl ? (
                    <img src={pkg.imageUrl} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                      <Package className="h-12 w-12 text-slate-300" />
                    </div>
                  )}
                  <div className="absolute top-6 left-6 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-xl">
                    Save {pkg.discountPercentage}%
                  </div>
                  {pkg.isPopular && (
                    <div className="absolute bottom-6 left-6 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-xl">
                      Most Popular
                    </div>
                  )}
                </div>

                <div className="lg:w-3/5 p-10 flex flex-col justify-between">
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4 group-hover:text-primary transition-colors">{pkg.title}</h3>
                    <p className="text-slate-500 text-sm font-medium mb-8 line-clamp-2">{pkg.description}</p>
                    
                    <div className="space-y-3 mb-8">
                      {pkg.serviceIds.slice(0, 3).map(sid => {
                        const service = services.find(s => s.id === sid);
                        return (
                          <div key={sid} className="flex items-center gap-3 text-xs font-bold text-slate-400">
                            <div className="h-5 w-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                            </div>
                            <span>{service?.title || "Premium Service"}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Package Price</span>
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-black text-primary tracking-tighter">₹{pkg.basePrice.toLocaleString()}</span>
                        <span className="text-sm font-bold text-slate-300 line-through">
                          ₹{services.filter(s => pkg.serviceIds.includes(s.id)).reduce((sum, s) => sum + s.basePrice, 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <Button 
                      asChild
                      className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/10 bg-primary hover:bg-primary/90 text-white border-none"
                    >
                      <Link to="/book" state={{ packageId: pkg.id }}>Book Now</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 lg:px-8 -mt-20 relative z-20">
        {/* Vehicle Selector Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 mb-20"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="max-w-xs">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Vehicle Profile</h2>
                {isVehicleSelected && (
                  <button 
                    onClick={() => { setSelectedMake(""); setSelectedModel(""); setSelectedFuel(""); }}
                    className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <p className="text-sm text-slate-500 font-medium">Select your vehicle to unlock precise, model-specific pricing.</p>
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Manufacturer</label>
                <Select value={selectedMake} onValueChange={(val) => { setSelectedMake(val); setSelectedModel(""); setSelectedFuel(""); }}>
                  <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-slate-50 font-bold text-slate-700">
                    <SelectValue placeholder="Select Make" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl bg-white border-slate-100 text-slate-700">
                    {carMakes.map((make) => (
                      <SelectItem key={make.name} value={make.name}>{make.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Model</label>
                <Select value={selectedModel} onValueChange={(val) => { setSelectedModel(val); setSelectedFuel(""); }} disabled={!selectedMake}>
                  <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-slate-50 font-bold text-slate-700">
                    <SelectValue placeholder="Select Model" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl bg-white border-slate-100 text-slate-700">
                    {carModels.filter(m => m.make === selectedMake).map((model) => (
                      <SelectItem key={model.name} value={model.name}>{model.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Fuel Type</label>
                <Select value={selectedFuel} onValueChange={setSelectedFuel} disabled={!selectedModel}>
                  <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-slate-50 font-bold text-slate-700">
                    <SelectValue placeholder="Select Fuel" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl bg-white border-slate-100 text-slate-700">
                    {fuelTypes.map((fuel) => (
                      <SelectItem key={fuel.name} value={fuel.name}>{fuel.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <AnimatePresence>
            {isVehicleSelected && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8 pt-8 border-t border-slate-100 text-sm text-primary font-black uppercase tracking-widest flex items-center gap-3"
              >
                <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                Dynamic pricing active for {selectedMake} {selectedModel}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search services..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-16 pl-14 pr-6 rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-xl shadow-slate-200/50 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 h-16 shadow-xl shadow-slate-200/50">
              <Package className="h-5 w-5 text-primary" />
              <select
                className="bg-transparent text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 focus:outline-none cursor-pointer pr-4"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 h-16 shadow-xl shadow-slate-200/50">
              <ArrowLeftRight className="h-5 w-5 text-primary rotate-90" />
              <select
                className="bg-transparent text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 focus:outline-none cursor-pointer pr-4"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Sort By</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="duration">Duration</option>
              </select>
            </div>

            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
              Showing {filteredServices.length} Results
            </span>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredServices.map((service, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col group overflow-hidden"
            >
              <div className="p-10 flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-all duration-500 shadow-sm border border-slate-100 group-hover:shadow-primary/20">
                    <div className="group-hover:scale-110 transition-transform duration-500">
                      {getIcon(service)}
                    </div>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-none group-hover:text-primary transition-colors">{service.title}</h3>
                </div>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 line-clamp-2">{service.description}</p>
                
                <div className="space-y-3">
                  {service.features.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs font-bold text-slate-400">
                      <div className="h-5 w-5 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-10 pt-0">
                <div className="bg-slate-50 rounded-[2rem] p-6 flex items-center justify-between group-hover:bg-primary/5 transition-colors border border-slate-100">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                      {isVehicleSelected ? "Final Quote" : "Base Price"}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-black text-primary tracking-tighter">
                        {isVehicleSelected 
                          ? `₹${calculatePrice(service.basePrice)}` 
                          : service.price}
                      </span>
                      {isVehicleSelected && (
                        <Popover>
                          <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <div className="h-6 w-6 rounded-full bg-white border border-slate-200 flex items-center justify-center cursor-help hover:border-primary transition-colors">
                              <Info className="h-3 w-3 text-slate-400" />
                            </div>
                          </PopoverTrigger>
                          <PopoverContent className="w-64 rounded-2xl p-6 shadow-2xl border-slate-100 bg-white text-slate-900">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Price Breakdown</h4>
                            <div className="space-y-3 text-xs font-bold">
                              <div className="flex justify-between">
                                <span className="text-slate-500">Base Service</span>
                                <span>₹{service.basePrice}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Make Adjustment</span>
                                <span>+₹{carMakes.find(m => m.name === selectedMake)?.price || 0}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Model Adjustment</span>
                                <span>+₹{carModels.find(m => m.name === selectedModel)?.price || 0}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Fuel Adjustment</span>
                                <span>+₹{fuelTypes.find(f => f.name === selectedFuel)?.price || 0}</span>
                              </div>
                              <div className="flex justify-between border-t border-slate-100 pt-3 text-primary">
                                <span>Total Estimate</span>
                                <span>₹{calculatePrice(service.basePrice)}</span>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  </div>
                  
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/10 bg-primary hover:bg-primary/90 text-white border-none flex-1"
                          asChild
                        >
                          <Link 
                            to="/book" 
                            state={{ 
                              serviceId: service.id,
                              vehicleDetails: isVehicleSelected ? {
                                make: selectedMake,
                                model: selectedModel,
                                fuel: selectedFuel
                              } : undefined
                            }}
                          >
                            Book
                          </Link>
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => toggleCompare(service.id)}
                          className={cn(
                            "h-12 w-12 rounded-xl border-slate-200 transition-all",
                            compareList.includes(service.id) ? "bg-primary border-primary text-white" : "bg-white text-slate-400 hover:border-primary hover:text-primary"
                          )}
                        >
                          <ArrowLeftRight className="h-4 w-4" />
                        </Button>
                      </div>
                      <button 
                        onClick={() => setSelectedService({ ...service, icon: getIcon(service) })}
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors text-center"
                      >
                        Details
                      </button>
                    </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <ServiceModal 
        service={selectedService} 
        isOpen={!!selectedService} 
        onClose={() => setSelectedService(null)}
        calculatedPrice={selectedService && isVehicleSelected ? `₹${calculatePrice(selectedService.basePrice)}` : undefined}
        isVehicleSelected={!!isVehicleSelected}
        vehicleDetails={isVehicleSelected ? {
          make: selectedMake,
          model: selectedModel,
          fuel: selectedFuel
        } : undefined}
      />

      {/* Floating Compare Bar */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl"
          >
            <div className="bg-slate-900 rounded-[2rem] p-4 shadow-2xl shadow-black/40 border border-white/10 flex items-center justify-between gap-6">
              <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
                {compareList.map(id => {
                  const service = services.find(s => s.id === id);
                  return (
                    <div key={id} className="flex items-center gap-3 bg-white/5 rounded-xl p-2 pr-4 shrink-0 border border-white/5">
                      <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
                        {service && getIcon(service)}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white truncate max-w-[100px]">
                        {service?.title}
                      </span>
                      <button onClick={() => toggleCompare(id)} className="text-white/40 hover:text-white transition-colors">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}
                {compareList.length < 3 && (
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 px-4">
                    Add {3 - compareList.length} more to compare
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setCompareList([])}
                  className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors px-4"
                >
                  Clear
                </button>
                <Button
                  disabled={compareList.length < 2}
                  onClick={() => setShowCompareModal(true)}
                  className="h-12 px-8 rounded-xl font-black uppercase tracking-widest text-[10px] bg-primary hover:bg-primary/90 text-white border-none shadow-xl shadow-primary/20"
                >
                  Compare Now
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare Modal */}
      <AnimatePresence>
        {showCompareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-slate-950/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-6xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-10 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Service Comparison</h2>
                  <p className="text-slate-500 font-medium">Side-by-side analysis of your selected service modules.</p>
                </div>
                <button 
                  onClick={() => setShowCompareModal(false)}
                  className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-auto p-10">
                <div className="grid grid-cols-4 gap-8">
                  <div className="col-span-1 pt-40 space-y-12">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 flex items-center">Features & Benefits</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 flex items-center">Base Pricing</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 flex items-center">Estimated Time</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 flex items-center">Warranty</div>
                  </div>
                  
                  {compareList.map(id => {
                    const service = services.find(s => s.id === id);
                    if (!service) return null;
                    return (
                      <div key={id} className="col-span-1 space-y-12">
                        <div className="h-40 flex flex-col items-center text-center">
                          <div className="h-20 w-20 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                            {getIcon(service)}
                          </div>
                          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{service.title}</h3>
                        </div>
                        
                        <div className="space-y-3 h-10 overflow-hidden">
                          {service.features.slice(0, 3).map((f, i) => (
                            <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                              <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                              <span className="truncate">{f}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="h-10 flex items-center justify-center">
                          <span className="text-2xl font-black text-primary tracking-tighter">
                            {isVehicleSelected ? `₹${calculatePrice(service.basePrice)}` : service.price}
                          </span>
                        </div>
                        
                        <div className="h-10 flex items-center justify-center text-sm font-black text-slate-900 uppercase tracking-widest">
                          {service.timeEstimate || "2-4 Hours"}
                        </div>
                        
                        <div className="h-10 flex items-center justify-center">
                          <div className="px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                            {service.warranty || "6 Months"}
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/10 bg-primary hover:bg-primary/90 text-white border-none"
                          asChild
                        >
                          <Link 
                            to="/book" 
                            state={{ 
                              serviceId: service.id,
                              vehicleDetails: isVehicleSelected ? {
                                make: selectedMake,
                                model: selectedModel,
                                fuel: selectedFuel
                              } : undefined
                            }}
                          >
                            Select
                          </Link>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
