import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
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
  Zap,
  Clock,
  CalendarCheck,
  ClipboardCheck,
  Settings2
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
import ServiceCard from "@/components/ServiceCard";

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
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [selectedCheckups, setSelectedCheckups] = useState<string[]>([]);
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

  const allCommonIssues = Array.from(new Set(services.flatMap(s => s.commonIssues || [])));
  const allRecommendedCheckups = Array.from(new Set(services.flatMap(s => s.recommendedCheckups || [])));

  const filteredServices = services
    .filter(s => {
      const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           s.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || s.categoryId === selectedCategory;
      
      const matchesMake = !selectedMake || !s.applicableMakes || s.applicableMakes.length === 0 || s.applicableMakes.includes(selectedMake);
      const matchesModel = !selectedModel || !s.applicableModels || s.applicableModels.length === 0 || s.applicableModels.includes(selectedModel);
      const matchesFuel = !selectedFuel || !s.applicableFuelTypes || s.applicableFuelTypes.length === 0 || s.applicableFuelTypes.includes(selectedFuel);

      const matchesIssues = selectedIssues.length === 0 || 
                           (s.commonIssues && selectedIssues.some(issue => s.commonIssues?.includes(issue)));
      
      const matchesCheckups = selectedCheckups.length === 0 || 
                             (s.recommendedCheckups && selectedCheckups.some(checkup => s.recommendedCheckups?.includes(checkup)));

      return matchesSearch && matchesCategory && matchesMake && matchesModel && matchesFuel && matchesIssues && matchesCheckups;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") {
        return (a.estimatedPrice || a.basePrice || 0) - (b.estimatedPrice || b.basePrice || 0);
      }
      if (sortBy === "price_desc") {
        return (b.estimatedPrice || b.basePrice || 0) - (a.estimatedPrice || a.basePrice || 0);
      }
      if (sortBy === "duration") {
        const getNum = (s: string) => parseInt(s.match(/\d+/)?.[0] || "0");
        const durA = a.estimatedDuration || a.duration || "";
        const durB = b.estimatedDuration || b.duration || "";
        return getNum(durA) - getNum(durB);
      }
      return 0;
    });

  const serviceSteps = [
    {
      title: "Digital Booking",
      description: "Select your service, choose a convenient time slot, and provide your vehicle details through our seamless digital interface.",
      icon: <CalendarCheck className="h-10 w-10 text-primary" />
    },
    {
      title: "Master Execution",
      description: "Our certified master mechanics perform the requested services using genuine OEM/OES parts and state-of-the-art diagnostic tools.",
      icon: <Wrench className="h-10 w-10 text-primary" />
    },
    {
      title: "Quality Protocol",
      description: "Every vehicle undergoes a rigorous multi-point inspection and a final test drive to ensure it meets our high performance standards.",
      icon: <ShieldCheck className="h-10 w-10 text-primary" />
    }
  ];

  const whyChooseUs = [
    {
      title: "Certified Technicians",
      description: "Our team consists of factory-trained specialists with years of experience in premium automotive care.",
      icon: <LucideIcons.UserCheck className="h-6 w-6 text-primary" />
    },
    {
      title: "Genuine Parts",
      description: "We exclusively use OEM and OES parts to ensure your vehicle's warranty and performance remain intact.",
      icon: <LucideIcons.ShieldCheck className="h-6 w-6 text-primary" />
    },
    {
      title: "Transparent Pricing",
      description: "No hidden costs. Our dynamic pricing model provides accurate estimates based on your specific vehicle model.",
      icon: <LucideIcons.IndianRupee className="h-6 w-6 text-primary" />
    },
    {
      title: "Modern Diagnostics",
      description: "Equipped with the latest diagnostic technology to identify and resolve complex mechanical issues.",
      icon: <LucideIcons.Cpu className="h-6 w-6 text-primary" />
    }
  ];

  return (
    <div className="bg-background min-h-screen pb-32">
      {/* Hero Header */}
      <div className="bg-background pt-40 pb-32 relative overflow-hidden border-b border-border">
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
              className="text-6xl md:text-8xl font-black text-foreground uppercase tracking-tighter leading-[0.85] mb-8"
            >
              Precision <br /> Maintenance
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed"
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Exclusive Bundles</span>
              </div>
              <h2 className="text-5xl font-black text-foreground uppercase tracking-tighter">Service Packages</h2>
              <p className="text-muted-foreground font-medium max-w-xl">Get multiple services combined at a special discounted rate. Maximum value for your vehicle.</p>
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
                className="bg-card rounded-[2.5rem] shadow-2xl shadow-black/5 dark:shadow-black/20 border border-border overflow-hidden flex flex-col lg:flex-row group"
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
                    <h3 className="text-3xl font-black text-foreground uppercase tracking-tighter mb-4 group-hover:text-primary transition-colors">{pkg.title}</h3>
                    <p className="text-muted-foreground text-sm font-medium mb-8 line-clamp-2">{pkg.description}</p>
                    
                    <div className="space-y-3 mb-8">
                      {pkg.serviceIds.slice(0, 3).map(sid => {
                        const service = services.find(s => s.id === sid);
                        return (
                          <div key={sid} className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
                            <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                            </div>
                            <span>{service?.title || "Premium Service"}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Package Price</span>
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-black text-primary tracking-tighter">₹{pkg.basePrice.toLocaleString()}</span>
                        <span className="text-sm font-bold text-muted-foreground/50 line-through">
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

      {/* Service Process Section */}
      <div className="container mx-auto px-4 lg:px-8 mb-32">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-6">
            <Settings2 className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Operational Workflow</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-foreground uppercase tracking-tighter leading-none mb-6">
            The CarMechs <br /> <span className="text-primary">Protocol</span>
          </h2>
          <p className="text-lg text-muted-foreground font-medium">A systematic approach to automotive excellence, ensuring every vehicle leaves our facility in peak condition.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-border -z-10" />
          
          {serviceSteps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="bg-card p-10 rounded-[3rem] border border-border shadow-xl shadow-black/5 dark:shadow-black/20 flex flex-col items-center text-center group hover:border-primary/30 transition-all"
            >
              <div className="h-20 w-20 rounded-[2rem] bg-muted flex items-center justify-center mb-8 group-hover:bg-primary transition-colors shadow-sm">
                <div className="group-hover:scale-110 group-hover:brightness-0 group-hover:invert transition-all">
                  {step.icon}
                </div>
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Step 0{idx + 1}</div>
              <h3 className="text-2xl font-black text-foreground uppercase tracking-tight mb-4">{step.title}</h3>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 -mt-20 relative z-20">
        {/* Vehicle Selector Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-black/5 dark:shadow-black/20 border border-border mb-20"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="max-w-xs">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Vehicle Profile</h2>
                {isVehicleSelected && (
                  <button 
                    onClick={() => { setSelectedMake(""); setSelectedModel(""); setSelectedFuel(""); }}
                    className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <p className="text-sm text-muted-foreground font-medium">Select your vehicle to unlock precise, model-specific pricing.</p>
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 relative group">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Manufacturer</label>
                <div className="relative">
                  <Select value={selectedMake} onValueChange={(val) => { setSelectedMake(val); setSelectedModel(""); setSelectedFuel(""); }}>
                    <SelectTrigger className={cn(
                      "h-14 rounded-2xl border-border bg-muted/50 font-bold text-foreground transition-all",
                      selectedMake && "border-primary/50 bg-primary/5"
                    )}>
                      <SelectValue placeholder="Select Make" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl bg-card border-border text-foreground">
                      {carMakes.map((make) => (
                        <SelectItem key={make.name} value={make.name}>{make.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedMake && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedMake(""); setSelectedModel(""); setSelectedFuel(""); }}
                      className="absolute right-10 top-1/2 -translate-y-1/2 p-1 hover:bg-primary/10 rounded-full text-primary transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2 relative group">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Model</label>
                <div className="relative">
                  <Select value={selectedModel} onValueChange={(val) => { setSelectedModel(val); setSelectedFuel(""); }} disabled={!selectedMake}>
                    <SelectTrigger className={cn(
                      "h-14 rounded-2xl border-border bg-muted/50 font-bold text-foreground transition-all",
                      selectedModel && "border-primary/50 bg-primary/5"
                    )}>
                      <SelectValue placeholder="Select Model" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl bg-card border-border text-foreground">
                      {carModels.filter(m => m.make === selectedMake).map((model) => (
                        <SelectItem key={model.name} value={model.name}>{model.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedModel && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedModel(""); setSelectedFuel(""); }}
                      className="absolute right-10 top-1/2 -translate-y-1/2 p-1 hover:bg-primary/10 rounded-full text-primary transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2 relative group">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Fuel Type</label>
                <div className="relative">
                  <Select value={selectedFuel} onValueChange={setSelectedFuel} disabled={!selectedModel}>
                    <SelectTrigger className={cn(
                      "h-14 rounded-2xl border-border bg-muted/50 font-bold text-foreground transition-all",
                      selectedFuel && "border-primary/50 bg-primary/5"
                    )}>
                      <SelectValue placeholder="Select Fuel" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl bg-card border-border text-foreground">
                      {fuelTypes.map((fuel) => (
                        <SelectItem key={fuel.name} value={fuel.name}>{fuel.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedFuel && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedFuel(""); }}
                      className="absolute right-10 top-1/2 -translate-y-1/2 p-1 hover:bg-primary/10 rounded-full text-primary transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <AnimatePresence>
            {isVehicleSelected && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8 pt-8 border-t border-border text-sm text-primary font-black uppercase tracking-widest flex items-center gap-3"
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
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search services..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-16 pl-14 pr-6 rounded-2xl border border-border bg-card text-foreground shadow-xl shadow-black/5 dark:shadow-black/20 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
            />
          </div>
          
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-4 h-16 shadow-xl shadow-black/5 dark:shadow-black/20">
                <Package className="h-5 w-5 text-primary" />
                <select
                  className="bg-transparent text-[10px] font-black uppercase tracking-[0.2em] text-foreground focus:outline-none cursor-pointer pr-4"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-16 px-6 rounded-2xl border-border bg-card shadow-xl shadow-black/5 dark:shadow-black/20 flex items-center gap-3">
                    <LucideIcons.AlertTriangle className="h-5 w-5 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Common Issues</span>
                    {selectedIssues.length > 0 && (
                      <span className="bg-primary text-white text-[8px] h-4 w-4 rounded-full flex items-center justify-center">
                        {selectedIssues.length}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4 rounded-2xl bg-card border-border shadow-2xl">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Filter by Issues</h4>
                    {allCommonIssues.map(issue => (
                      <label key={issue} className="flex items-center gap-3 p-2 hover:bg-muted rounded-xl cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                          checked={selectedIssues.includes(issue)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedIssues([...selectedIssues, issue]);
                            else setSelectedIssues(selectedIssues.filter(i => i !== issue));
                          }}
                        />
                        <span className="text-xs font-bold text-foreground">{issue}</span>
                      </label>
                    ))}
                    {allCommonIssues.length === 0 && <p className="text-[10px] text-muted-foreground italic">No issues found</p>}
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-16 px-6 rounded-2xl border-border bg-card shadow-xl shadow-black/5 dark:shadow-black/20 flex items-center gap-3">
                    <LucideIcons.Stethoscope className="h-5 w-5 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Checkups</span>
                    {selectedCheckups.length > 0 && (
                      <span className="bg-primary text-white text-[8px] h-4 w-4 rounded-full flex items-center justify-center">
                        {selectedCheckups.length}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4 rounded-2xl bg-card border-border shadow-2xl">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Filter by Checkups</h4>
                    {allRecommendedCheckups.map(checkup => (
                      <label key={checkup} className="flex items-center gap-3 p-2 hover:bg-muted rounded-xl cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                          checked={selectedCheckups.includes(checkup)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedCheckups([...selectedCheckups, checkup]);
                            else setSelectedCheckups(selectedCheckups.filter(c => c !== checkup));
                          }}
                        />
                        <span className="text-xs font-bold text-foreground">{checkup}</span>
                      </label>
                    ))}
                    {allRecommendedCheckups.length === 0 && <p className="text-[10px] text-muted-foreground italic">No checkups found</p>}
                  </div>
                </PopoverContent>
              </Popover>

              <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-4 h-16 shadow-xl shadow-black/5 dark:shadow-black/20">
              <ArrowLeftRight className="h-5 w-5 text-primary rotate-90" />
              <select
                className="bg-transparent text-[10px] font-black uppercase tracking-[0.2em] text-foreground focus:outline-none cursor-pointer pr-4"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Sort By</option>
                <option value="price_asc">Est. Price: Low to High</option>
                <option value="price_desc">Est. Price: High to Low</option>
                <option value="duration">Est. Duration</option>
              </select>
            </div>

            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">
              Showing {filteredServices.length} Results
            </span>

            {(selectedIssues.length > 0 || selectedCheckups.length > 0 || selectedCategory !== "all" || searchQuery || selectedMake || selectedModel || selectedFuel) && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedIssues([]);
                  setSelectedCheckups([]);
                  setSelectedCategory("all");
                  setSearchQuery("");
                  setSelectedMake("");
                  setSelectedModel("");
                  setSelectedFuel("");
                }}
                className="h-16 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 border-red-100 bg-red-50/30 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        <AnimatePresence>
          {(selectedIssues.length > 0 || selectedCheckups.length > 0 || selectedMake || selectedModel || selectedFuel) && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-wrap items-center gap-3 mb-10 p-6 bg-slate-50/50 rounded-3xl border border-slate-100"
            >
              <div className="flex items-center gap-2 mr-4">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active Filters:</span>
              </div>

              {selectedMake && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-[10px] font-bold text-slate-700 hover:border-primary transition-colors">
                  <span className="text-slate-400">Make:</span>
                  <span>{selectedMake}</span>
                  <button 
                    onClick={() => { setSelectedMake(""); setSelectedModel(""); setSelectedFuel(""); }}
                    className="ml-1 p-0.5 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {selectedModel && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-[10px] font-bold text-slate-700 hover:border-primary transition-colors">
                  <span className="text-slate-400">Model:</span>
                  <span>{selectedModel}</span>
                  <button 
                    onClick={() => { setSelectedModel(""); setSelectedFuel(""); }}
                    className="ml-1 p-0.5 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {selectedFuel && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-[10px] font-bold text-slate-700 hover:border-primary transition-colors">
                  <span className="text-slate-400">Fuel:</span>
                  <span>{selectedFuel}</span>
                  <button 
                    onClick={() => setSelectedFuel("")}
                    className="ml-1 p-0.5 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {selectedIssues.map(issue => (
                <div key={issue} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-[10px] font-bold text-slate-700 hover:border-primary transition-colors">
                  <span className="text-slate-400">Issue:</span>
                  <span>{issue}</span>
                  <button 
                    onClick={() => setSelectedIssues(selectedIssues.filter(i => i !== issue))}
                    className="ml-1 p-0.5 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {selectedCheckups.map(checkup => (
                <div key={checkup} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-[10px] font-bold text-slate-700 hover:border-primary transition-colors">
                  <span className="text-slate-400">Checkup:</span>
                  <span>{checkup}</span>
                  <button 
                    onClick={() => setSelectedCheckups(selectedCheckups.filter(c => c !== checkup))}
                    className="ml-1 p-0.5 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Services Grid */}
        <div className="min-h-[400px]">
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredServices.map((service) => (
                <ServiceCard 
                  key={service.id}
                  service={service}
                  onViewDetail={(id) => setSelectedService(services.find(s => s.id === id))}
                  onBook={(s) => navigate('/book', { state: { serviceId: s.id } })}
                />
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-8">
                <Search className="h-10 w-10 text-muted-foreground/30" />
              </div>
              <h3 className="text-3xl font-black text-foreground uppercase tracking-tighter mb-4">No Services Found</h3>
              <p className="text-muted-foreground font-medium max-w-md mx-auto mb-8">We couldn't find any services matching your current search or filter criteria. Try adjusting your filters or search terms.</p>
              <Button 
                variant="outline" 
                onClick={() => { setSearchQuery(""); setSelectedCategory("all"); setSelectedIssues([]); setSelectedCheckups([]); }}
                className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs border-border"
              >
                Reset All Filters
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-slate-950 py-32 overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
                <ShieldCheck className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">The CarMechs Advantage</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-8">
                Uncompromising <br /> <span className="text-primary">Standards</span>
              </h2>
              <p className="text-xl text-slate-400 font-medium leading-relaxed mb-12 max-w-xl">
                We've redefined automotive service by combining master craftsmanship with cutting-edge digital convenience.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {whyChooseUs.map((item, idx) => (
                  <div key={idx} className="space-y-4">
                    <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">{item.title}</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-[4rem] overflow-hidden border border-white/10 relative group">
                <img 
                  src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=1000&auto=format&fit=crop" 
                  alt="Workshop" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                
                <div className="absolute bottom-12 left-12 right-12 bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem]">
                  <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <div className="text-3xl font-black text-white tracking-tighter">15,000+</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Vehicles Serviced Annually</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-[80px] rounded-full" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 blur-[80px] rounded-full" />
            </div>
          </div>
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
            <div className="bg-card rounded-[2rem] p-4 shadow-2xl shadow-black/40 border border-border flex items-center justify-between gap-6">
              <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
                {compareList.map(id => {
                  const service = services.find(s => s.id === id);
                  return (
                    <div key={id} className="flex items-center gap-3 bg-accent/10 rounded-xl p-2 pr-4 shrink-0 border border-border">
                      <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
                        {service && getIcon(service)}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-foreground truncate max-w-[100px]">
                        {service?.title}
                      </span>
                      <button onClick={() => toggleCompare(id)} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}
                {compareList.length < 3 && (
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground px-4">
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
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-background/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card w-full max-w-6xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-10 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-black text-foreground uppercase tracking-tighter">Service Comparison</h2>
                  <p className="text-muted-foreground font-medium">Side-by-side analysis of your selected service modules.</p>
                </div>
                <button 
                  onClick={() => setShowCompareModal(false)}
                  className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-auto p-10">
                <div className="grid grid-cols-4 gap-8">
                  <div className="col-span-1 pt-40 space-y-12">
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-10 flex items-center">Features & Benefits</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-10 flex items-center">Base Pricing</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-10 flex items-center">Estimated Time</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-10 flex items-center">Warranty</div>
                  </div>
                  
                  {compareList.map(id => {
                    const service = services.find(s => s.id === id);
                    if (!service) return null;
                    return (
                      <div key={id} className="col-span-1 space-y-12">
                        <div className="h-40 flex flex-col items-center text-center">
                          <div className="h-20 w-20 rounded-2xl bg-muted flex items-center justify-center mb-6 shadow-sm border border-border">
                            {getIcon(service)}
                          </div>
                          <h3 className="text-xl font-black text-foreground uppercase tracking-tight">{service.title}</h3>
                        </div>
                        
                        <div className="space-y-3 h-10 overflow-hidden">
                          {service.features.slice(0, 3).map((f, i) => (
                            <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
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
                        
                        <div className="h-10 flex items-center justify-center text-sm font-black text-foreground uppercase tracking-widest">
                          {service.timeEstimate || "2-4 Hours"}
                        </div>
                        
                        <div className="h-10 flex items-center justify-center">
                          <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
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
