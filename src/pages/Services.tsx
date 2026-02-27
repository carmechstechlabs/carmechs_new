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
  ArrowRight
} from "lucide-react";
import { useState } from "react";
import { ServiceModal } from "@/components/ServiceModal";
import { useData } from "@/context/DataContext";
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

const getIcon = (service: any) => {
  if (service.iconUrl) {
    return <img src={service.iconUrl} alt={service.title} className="h-12 w-12 object-contain" />;
  }
  switch (service.id) {
    case "periodic": return <Wrench className="h-10 w-10 text-primary" />;
    case "tyres": return <Disc className="h-10 w-10 text-primary" />;
    case "batteries": return <Battery className="h-10 w-10 text-primary" />;
    case "denting": return <PaintBucket className="h-10 w-10 text-primary" />;
    case "ac": return <Car className="h-10 w-10 text-primary" />;
    case "spa": return <ShieldCheck className="h-10 w-10 text-primary" />;
    default: return <Wrench className="h-10 w-10 text-primary" />;
  }
};

export function Services() {
  const { services, carMakes, carModels, fuelTypes } = useData();
  const [selectedService, setSelectedService] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Vehicle Selection State
  const [selectedMake, setSelectedMake] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedFuel, setSelectedFuel] = useState<string>("");

  const calculatePrice = (basePrice: number) => {
    let multiplier = 1;

    const make = carMakes.find(m => m.name === selectedMake);
    if (make) multiplier *= make.multiplier;

    const model = carModels.find(m => m.name === selectedModel);
    if (model) multiplier *= model.multiplier;

    const fuel = fuelTypes.find(f => f.name === selectedFuel);
    if (fuel) multiplier *= fuel.multiplier;

    return Math.round(basePrice * multiplier);
  };

  const isVehicleSelected = selectedMake && selectedModel && selectedFuel;

  const filteredServices = services.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#fdfcfb] min-h-screen pb-32">
      {/* Hero Header */}
      <div className="bg-slate-900 pt-40 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm mb-6"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Service Modules</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-8"
            >
              Precision <br /> Maintenance
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/60 font-medium max-w-2xl leading-relaxed"
            >
              From periodic maintenance to complex mechanical repairs, our certified technicians ensure your vehicle performs at its absolute peak.
            </motion.p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-20">
        {/* Vehicle Selector Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-black/5 border border-slate-100 mb-20"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="max-w-xs">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Vehicle Profile</h2>
              <p className="text-sm text-slate-500 font-medium">Select your vehicle to unlock precise, model-specific pricing.</p>
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Manufacturer</label>
                <Select value={selectedMake} onValueChange={setSelectedMake}>
                  <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50 font-bold">
                    <SelectValue placeholder="Select Make" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {carMakes.map((make) => (
                      <SelectItem key={make.name} value={make.name}>{make.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Model</label>
                <Select value={selectedModel} onValueChange={setSelectedModel} disabled={!selectedMake}>
                  <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50 font-bold">
                    <SelectValue placeholder="Select Model" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {carModels.filter(m => m.make === selectedMake).map((model) => (
                      <SelectItem key={model.name} value={model.name}>{model.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Fuel Type</label>
                <Select value={selectedFuel} onValueChange={setSelectedFuel}>
                  <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50 font-bold">
                    <SelectValue placeholder="Select Fuel" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
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
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                Dynamic pricing active for {selectedMake} {selectedModel}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search services..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-16 pl-14 pr-6 rounded-2xl border border-slate-100 bg-white shadow-xl shadow-black/5 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
            />
          </div>
          
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>Showing {filteredServices.length} Results</span>
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
              className="bg-white rounded-[3rem] shadow-xl shadow-black/[0.03] border border-slate-100 flex flex-col group overflow-hidden"
            >
              <div className="p-10 flex-1">
                <div className="mb-8 bg-slate-900 w-20 h-20 rounded-[1.5rem] flex items-center justify-center group-hover:bg-primary transition-all duration-500 shadow-xl group-hover:shadow-primary/20">
                  <div className="group-hover:scale-110 transition-transform duration-500">
                    {getIcon(service)}
                  </div>
                </div>
                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4 leading-none">{service.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 line-clamp-2">{service.description}</p>
                
                <div className="space-y-3">
                  {service.features.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs font-bold text-slate-700">
                      <div className="h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-10 pt-0">
                <div className="bg-slate-50 rounded-[2rem] p-6 flex items-center justify-between group-hover:bg-slate-100 transition-colors border border-slate-100">
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
                          <PopoverContent className="w-64 rounded-2xl p-6 shadow-2xl border-slate-100">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Price Breakdown</h4>
                            <div className="space-y-3 text-xs font-bold">
                              <div className="flex justify-between">
                                <span className="text-slate-500">Base Service</span>
                                <span>₹{service.basePrice}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Make Multiplier</span>
                                <span>x{carMakes.find(m => m.name === selectedMake)?.multiplier || 1}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Model Multiplier</span>
                                <span>x{carModels.find(m => m.name === selectedModel)?.multiplier || 1}</span>
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
                    <Button 
                      size="sm" 
                      className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/10"
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
    </div>
  );
}
