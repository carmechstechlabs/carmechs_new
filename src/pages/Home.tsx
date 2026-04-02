import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { 
  Wrench, 
  Car, 
  Battery, 
  Disc, 
  PaintBucket, 
  ShieldCheck, 
  Clock, 
  IndianRupee, 
  Star,
  Plus,
  ArrowRight,
  Zap,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  Send,
  Loader2,
  Sparkles,
  X,
  Calendar,
  Globe,
  Terminal,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Camera,
  Map,
  ExternalLink,
  Users,
  Package,
  Activity,
  Info,
  Scale
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useData } from "@/context/DataContext";
import React, { useState, useRef, useEffect } from "react";
import { ServiceModal } from "@/components/ServiceModal";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { SEO } from "@/components/SEO";
import * as LucideIcons from "lucide-react";
import { GallerySection } from "@/components/sections/GallerySection";
import { CoreServicesSection } from "@/components/sections/CoreServicesSection";
import { LocationSection } from "@/components/sections/LocationSection";
import { ServiceCatalog } from "@/components/sections/ServiceCatalog";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { BrandsCarousel } from "@/components/sections/BrandsCarousel";

const BookingModal = ({ isOpen, onClose, service }: { isOpen: boolean, onClose: () => void, service: any }) => {
  const { carMakes, carModels, fuelTypes, locations, addAppointment, currentUser, vehicles } = useData();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    fuel: "",
    year: "",
    licensePlate: "",
    locationId: "",
    date: new Date().toISOString().split('T')[0],
    time: "09:00 AM",
    name: currentUser?.displayName || "",
    phone: currentUser?.phoneNumber || "",
    email: currentUser?.email || ""
  });

  const calculateTotal = () => {
    let total = service.basePrice || 1499;
    const make = carMakes.find(m => m.name === formData.make);
    if (make) total += make.price;
    const model = carModels.find(m => m.name === formData.model);
    if (model) total += model.price;
    const fuel = fuelTypes.find(f => f.name === formData.fuel);
    if (fuel) total += fuel.price;
    return total;
  };

  const totalAmount = calculateTotal();

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.displayName || prev.name,
        phone: currentUser.phoneNumber || prev.phone,
        email: currentUser.email || prev.email
      }));
    }
  }, [currentUser]);

  if (!service) return null;

  const handleBooking = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const selectedLocation = locations.find(l => l.id === formData.locationId);
      addAppointment({
        ...formData,
        locationName: selectedLocation?.name || "",
        service: service.title,
        serviceId: service.id,
        amount: totalAmount,
      });
      toast.success("Booking successful! Redirecting...");
      setTimeout(() => {
        onClose();
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      toast.error("Booking failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl bg-background">
        <div className="bg-slate-900 dark:bg-slate-950 p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full" />
          <DialogHeader className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 mb-4 w-fit">
              <Zap className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Quick Booking Terminal</span>
            </div>
            <DialogTitle className="text-4xl font-black uppercase tracking-tighter leading-none mb-2 text-white">
              {service.title}
            </DialogTitle>
            <p className="text-white/60 font-medium">Configure your maintenance parameters.</p>
          </DialogHeader>
        </div>

        <div className="p-10 bg-card space-y-8">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Manufacturer</label>
                    <select 
                      value={formData.make}
                      onChange={(e) => setFormData({...formData, make: e.target.value})}
                      className="w-full h-12 px-4 rounded-xl border border-border bg-accent/50 font-bold text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      <option value="" className="bg-background">Select Make</option>
                      {carMakes.map(m => <option key={m.id} value={m.name} className="bg-background">{m.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Model</label>
                    <select 
                      value={formData.model}
                      onChange={(e) => setFormData({...formData, model: e.target.value})}
                      className="w-full h-12 px-4 rounded-xl border border-border bg-accent/50 font-bold text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none"
                      disabled={!formData.make}
                    >
                      <option value="" className="bg-background">Select Model</option>
                      {carModels.filter(m => m.make === formData.make).map(m => <option key={m.id} value={m.name} className="bg-background">{m.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Fuel Type</label>
                    <select 
                      value={formData.fuel}
                      onChange={(e) => setFormData({...formData, fuel: e.target.value})}
                      className="w-full h-12 px-4 rounded-xl border border-border bg-accent/50 font-bold text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      <option value="" className="bg-background">Select Fuel</option>
                      {fuelTypes.map(f => <option key={f.id} value={f.name} className="bg-background">{f.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">License Plate</label>
                    <Input 
                      value={formData.licensePlate}
                      onChange={(e) => setFormData({...formData, licensePlate: e.target.value.toUpperCase()})}
                      placeholder="KA 01 AB 1234"
                      className="h-12 rounded-xl font-bold uppercase bg-accent/50 border-border text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Select Workshop</label>
                  <select 
                    value={formData.locationId}
                    onChange={(e) => setFormData({...formData, locationId: e.target.value})}
                    className="w-full h-12 px-4 rounded-xl border border-border bg-accent/50 font-bold text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="" className="bg-background">Select Location</option>
                    {locations.map(l => <option key={l.id} value={l.id} className="bg-background">{l.name} - {l.city}</option>)}
                  </select>
                </div>

                {formData.make && (
                  <div className="p-4 bg-accent/30 rounded-2xl border border-border space-y-3">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      <span>Base Price</span>
                      <span>₹{service.basePrice || 1499}</span>
                    </div>
                    {carMakes.find(m => m.name === formData.make)?.price !== 0 && (
                      <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        <span>{formData.make} Adjustment</span>
                        <span>+₹{carMakes.find(m => m.name === formData.make)?.price}</span>
                      </div>
                    )}
                    {carModels.find(m => m.name === formData.model)?.price !== 0 && formData.model && (
                      <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        <span>{formData.model} Adjustment</span>
                        <span>+₹{carModels.find(m => m.name === formData.model)?.price}</span>
                      </div>
                    )}
                    {fuelTypes.find(f => f.name === formData.fuel)?.price !== 0 && formData.fuel && (
                      <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        <span>{formData.fuel} Adjustment</span>
                        <span>+₹{fuelTypes.find(f => f.name === formData.fuel)?.price}</span>
                      </div>
                    )}
                    <div className="pt-3 border-t border-border flex justify-between text-sm font-black uppercase tracking-widest text-primary">
                      <span>Total Estimate</span>
                      <span>₹{totalAmount}</span>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={() => setStep(2)}
                  disabled={!formData.make || !formData.model || !formData.fuel || !formData.locationId}
                  className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-sm bg-primary hover:bg-primary/90 text-white border-none"
                >
                  Next: Schedule <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Select Date</label>
                    <Input 
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="h-12 rounded-xl font-bold bg-accent/50 border-border text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Select Time</label>
                    <select 
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      className="w-full h-12 px-4 rounded-xl border border-border bg-accent/50 font-bold text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      {["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"].map(t => <option key={t} value={t} className="bg-background">{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Your Name</label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe"
                    className="h-12 rounded-xl font-bold bg-accent/50 border-border text-foreground"
                  />
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="h-16 px-8 rounded-2xl font-black uppercase tracking-widest text-xs border-border text-foreground hover:bg-accent">
                    Back
                  </Button>
                  <Button 
                    onClick={handleBooking}
                    disabled={isSubmitting || !formData.name || !formData.date}
                    className="flex-1 h-16 rounded-2xl font-black uppercase tracking-widest text-sm bg-primary hover:bg-primary/90 text-white border-none"
                  >
                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Confirm Booking"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};
;

const features = [
  {
    icon: <Wrench className="h-6 w-6 text-primary" />,
    title: "Certified Technicians",
    description: "Highly trained and certified master mechanics for your vehicle.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-primary" />,
    title: "Genuine Parts",
    description: "We use only 100% genuine OEM/OES spare parts for every service.",
  },
  {
    icon: <IndianRupee className="h-6 w-6 text-primary" />,
    title: "Transparent Pricing",
    description: "Upfront pricing with no hidden charges or surprise costs.",
  },
];

const ComparisonModal = ({ isOpen, onClose, services }: { isOpen: boolean, onClose: () => void, services: any[] }) => {
  if (services.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl bg-background">
        <div className="bg-slate-900 dark:bg-slate-950 p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full" />
          <DialogHeader className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 mb-4 w-fit">
              <Scale className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Service Comparison Engine</span>
            </div>
            <DialogTitle className="text-4xl font-black uppercase tracking-tighter leading-none mb-2 text-white">
              Compare Modules
            </DialogTitle>
            <p className="text-white/60 font-medium">Side-by-side analysis of selected maintenance protocols.</p>
          </DialogHeader>
        </div>

        <div className="p-10 bg-card overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-4 text-left border-b border-border bg-accent/50 rounded-tl-2xl text-foreground">Feature</th>
                {services.map(s => (
                  <th key={s.id} className="p-4 text-center border-b border-border bg-accent/50 last:rounded-tr-2xl">
                    <div className="text-sm font-black uppercase tracking-tighter text-foreground">{s.title}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border/50">Starting Price</td>
                {services.map(s => (
                  <td key={s.id} className="p-4 text-center border-b border-border/50">
                    <div className="text-lg font-black text-primary">{s.price}</div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border/50">Duration</td>
                {services.map(s => (
                  <td key={s.id} className="p-4 text-center border-b border-border/50">
                    <div className="text-sm font-bold text-muted-foreground">{s.duration}</div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border/50">Checks Included</td>
                {services.map(s => (
                  <td key={s.id} className="p-4 text-center border-b border-border/50">
                    <div className="text-xs font-bold text-foreground">{s.checks?.length || 0} Points</div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Key Features</td>
                {services.map(s => (
                  <td key={s.id} className="p-4 text-center align-top">
                    <ul className="space-y-2">
                      {s.features?.slice(0, 4).map((f: string, i: number) => (
                        <li key={i} className="text-[10px] font-medium text-muted-foreground flex items-center justify-center gap-1">
                          <CheckCircle2 className="h-2 w-2 text-emerald-500 shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export function Home() {
  const { uiSettings, services: dynamicServices, brands, reviews, addContactSubmission, categories, isLoading, settings, carMakes, carModels, fuelTypes, servicePackages } = useData();
  const [selectedService, setSelectedService] = useState<any>(null);
  const [bookingService, setBookingService] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [compareList, setCompareList] = useState<any[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const navigate = useNavigate();
  const [quickVehicle, setQuickVehicle] = useState({
    make: "",
    model: "",
    fuel: "",
    year: "",
    licensePlate: "",
    date: "",
    time: ""
  });

  const calculateCalculatedPrice = (service: any) => {
    if (!quickVehicle.make || !quickVehicle.model || !quickVehicle.fuel) return service.price;
    
    let total = service.basePrice || 1499;
    const make = carMakes.find(m => m.name === quickVehicle.make);
    if (make) total += make.price;
    const model = carModels.find(m => m.name === quickVehicle.model);
    if (model) total += model.price;
    const fuel = fuelTypes.find(f => f.name === quickVehicle.fuel);
    if (fuel) total += fuel.price;
    
    return `₹${total.toLocaleString()}`;
  };
  const [contactForm, setContactForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.firstName || !contactForm.lastName || !contactForm.email || !contactForm.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      await addContactSubmission(contactForm);
      toast.success("Message sent! We'll get back to you soon.");
      setContactForm({
        firstName: "",
        lastName: "",
        email: "",
        subject: "General Inquiry",
        message: ""
      });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const publishedReviews = reviews.filter(r => r.isPublished).slice(0, 3);

  const filteredServices = dynamicServices.filter(s => 
    activeCategory === "all" || s.categoryId === activeCategory
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground animate-pulse">Initializing Systems...</p>
        </div>
      </div>
    );
  }

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const getIcon = (service: any) => {
    if ('iconUrl' in service && service.iconUrl) {
      return <img src={service.iconUrl} alt={service.title} className="max-h-10 max-w-10 object-contain" />;
    }
    
    if (service.iconName) {
      const Icon = (LucideIcons as any)[service.iconName] || LucideIcons.Wrench;
      return <Icon className="h-8 w-8 text-primary" />;
    }

    return 'icon' in service ? service.icon : <Wrench className="h-8 w-8 text-primary" />;
  };

  const getLucideIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck className="h-6 w-6 text-primary" />;
      case 'Clock': return <Clock className="h-6 w-6 text-primary" />;
      case 'IndianRupee': return <IndianRupee className="h-6 w-6 text-primary" />;
      case 'Wrench': return <Wrench className="h-6 w-6 text-primary" />;
      case 'Star': return <Star className="h-6 w-6 text-primary" />;
      default: return <Wrench className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <div className="flex flex-col bg-background selection:bg-primary/10" ref={containerRef}>
      <SEO 
        title={uiSettings.pages?.find(p => p.id === 'home')?.seo?.metaTitle}
        description={uiSettings.pages?.find(p => p.id === 'home')?.seo?.metaDescription}
        keywords={uiSettings.pages?.find(p => p.id === 'home')?.seo?.keywords}
        ogImage={uiSettings.pages?.find(p => p.id === 'home')?.seo?.ogImage}
        noIndex={uiSettings.pages?.find(p => p.id === 'home')?.seo?.enableIndexing === false}
        slug="home"
      />
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center text-foreground pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden"
      >
        {/* Background Video */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-30 grayscale dark:opacity-20"
          >
            <source src={uiSettings.heroVideoUrl || "https://cdn.pixabay.com/video/2020/09/24/50923-463863484_large.mp4"} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />
        </div>

        {/* Animated Background Elements */}
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          {uiSettings.heroBgImage ? (
            <>
              <motion.img 
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: uiSettings.heroBgOpacity || 0.15 }}
                transition={{ duration: 1.5 }}
                src={uiSettings.heroBgImage} 
                alt="Hero Background" 
                className="w-full h-full object-cover"
              />
              <div 
                className="absolute inset-0"
                style={{ 
                  background: `radial-gradient(circle at 20% 50%, transparent 0%, var(--background) 100%), linear-gradient(to right, var(--background) 0%, var(--background) 30%, transparent 100%)` 
                }}
              ></div>
            </>
          ) : (
            <div className="w-full h-full bg-accent/20 opacity-40"></div>
          )}
          
          {/* Floating Particles/Glows */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.1, 0.05],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 -left-20 w-96 h-96 rounded-full blur-[120px]"
            style={{ backgroundColor: 'var(--primary)' }}
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.05, 0.1, 0.05],
              x: [0, -40, 0],
              y: [0, 60, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
            className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]"
          />
        </motion.div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent border border-border backdrop-blur-md mb-8"
              >
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Next-Gen Automotive Hub</span>
              </motion.div>
              
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-[0.85] uppercase tracking-tighter text-foreground">
                {uiSettings.heroTitle ? (
                  <span dangerouslySetInnerHTML={{ __html: uiSettings.heroTitle.replace(/\\n/g, '<br />') }} />
                ) : (
                  <>Precision <br /><span className="text-primary">Car Care</span></>
                )}
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-lg font-medium leading-relaxed">
                {uiSettings.heroSubtitle || "Experience the next generation of car maintenance with our expert door-step service and transparent digital tracking."}
              </p>
              
              <div className="flex flex-wrap gap-6">
                <Link to="/book">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button size="lg" className="h-20 px-12 rounded-[2rem] text-lg font-bold uppercase tracking-widest shadow-xl shadow-primary/10 transition-all bg-primary hover:bg-primary/90 text-white border-none">
                      Book Now <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/services">
                  <Button variant="outline" size="lg" className="h-20 px-12 rounded-[2rem] text-lg font-bold uppercase tracking-widest bg-card text-foreground border-border hover:bg-accent transition-all">
                    Our Catalog
                  </Button>
                </Link>
              </div>
              
              {/* Stats Row */}
              <div className="mt-20 grid grid-cols-3 gap-12 border-t border-border pt-10">
                {[
                  { label: "User Rating", value: "4.9/5" },
                  { label: "Master Mechs", value: "250+" },
                  { label: "Service Hubs", value: "12" }
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-3xl font-bold text-foreground tracking-tighter">{stat.value}</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            {/* Interactive Hero Element */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:block relative"
            >
              <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-2xl border border-border aspect-[4/5] group">
                <img 
                  src={uiSettings.heroBgImage || "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2000&auto=format&fit=crop"} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90 grayscale dark:grayscale-0"
                  alt="Car Service"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
                
                {/* Floating Info Cards */}
                <motion.div 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-12 -left-12 bg-card/90 backdrop-blur-md p-6 rounded-[2rem] shadow-2xl max-w-[220px] border border-border"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-foreground">Verified</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed">100% Genuine OEM/OES Spare Parts Guaranteed.</p>
                </motion.div>
                
                <motion.div 
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute bottom-12 -right-12 bg-card/90 backdrop-blur-md p-6 rounded-[2rem] shadow-2xl max-w-[220px] border border-border"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-foreground">Express</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed">90-Minute Service Turnaround for Basic Maintenance.</p>
                </motion.div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -inset-10 border border-border rounded-[5rem] -z-10" />
              <div className="absolute -inset-20 border border-border rounded-[6rem] -z-20" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 blur-[100px] -z-30" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Booking Section */}
      <section className="relative z-30 -mt-24 mb-20 container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-card rounded-[3rem] shadow-2xl border border-border p-8 lg:p-12 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-4 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <Zap className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Instant Access</span>
              </div>
              <h3 className="text-4xl lg:text-5xl font-black text-foreground uppercase tracking-tighter leading-none">
                Quick <br /><span className="text-primary">Booking</span>
              </h3>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                Configure your service parameters in seconds. Select your vehicle and preferred schedule to get started.
              </p>
            </div>
            
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Vehicle Configuration</label>
                    <select 
                      className="w-full h-14 px-4 rounded-2xl border border-border bg-accent/50 font-bold text-xs uppercase tracking-widest focus:ring-2 focus:ring-primary/20 outline-none text-foreground"
                      value={`${quickVehicle.make}|${quickVehicle.model}`}
                      onChange={(e) => {
                        const [make, model] = e.target.value.split('|');
                        setQuickVehicle(prev => ({ ...prev, make: make || "", model: model || "" }));
                      }}
                    >
                      <option value="|" className="bg-background">Select Make & Model</option>
                      {carMakes.map(make => (
                        <optgroup key={make.id} label={make.name} className="bg-background">
                          {carModels.filter(m => m.make === make.name).map(model => (
                            <option key={model.id} value={`${make.name}|${model.name}`} className="bg-background">
                              {make.name} {model.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Fuel Type</label>
                      <select 
                        className="w-full h-14 px-4 rounded-2xl border border-border bg-accent/50 font-bold text-xs uppercase tracking-widest focus:ring-2 focus:ring-primary/20 outline-none text-foreground"
                        value={quickVehicle.fuel}
                        onChange={(e) => setQuickVehicle(prev => ({ ...prev, fuel: e.target.value }))}
                      >
                        <option value="" className="bg-background">Fuel</option>
                        {fuelTypes.map(f => <option key={f.id} value={f.name} className="bg-background">{f.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Plate No.</label>
                      <input 
                        placeholder="KA 01 AB 1234" 
                        className="w-full h-14 px-4 rounded-2xl border border-border bg-accent/50 font-bold text-xs uppercase focus:ring-2 focus:ring-primary/20 outline-none text-foreground"
                        value={quickVehicle.licensePlate}
                        onChange={(e) => setQuickVehicle(prev => ({ ...prev, licensePlate: e.target.value.toUpperCase() }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Preferred Date</label>
                      <input 
                        type="date"
                        className="w-full h-14 px-4 rounded-2xl border border-border bg-accent/50 font-bold text-xs focus:ring-2 focus:ring-primary/20 outline-none text-foreground"
                        min={new Date().toISOString().split('T')[0]}
                        value={quickVehicle.date}
                        onChange={(e) => setQuickVehicle(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Time Slot</label>
                      <select 
                        className="w-full h-14 px-4 rounded-2xl border border-border bg-accent/50 font-bold text-xs uppercase tracking-widest focus:ring-2 focus:ring-primary/20 outline-none text-foreground"
                        value={quickVehicle.time}
                        onChange={(e) => setQuickVehicle(prev => ({ ...prev, time: e.target.value }))}
                      >
                        <option value="" className="bg-background">Select Time</option>
                        <option className="bg-background">09:00 AM</option>
                        <option className="bg-background">11:00 AM</option>
                        <option className="bg-background">02:00 PM</option>
                        <option className="bg-background">04:00 PM</option>
                      </select>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => {
                      if (!quickVehicle.make || !quickVehicle.model || !quickVehicle.fuel) {
                        toast.error("Please select your vehicle details first");
                        return;
                      }
                      const dateParam = quickVehicle.date ? `&date=${quickVehicle.date}` : '';
                      const timeParam = quickVehicle.time ? `&time=${quickVehicle.time}` : '';
                      navigate(`/book?make=${quickVehicle.make}&model=${quickVehicle.model}&fuel=${quickVehicle.fuel}${dateParam}${timeParam}`);
                    }}
                    className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs bg-primary hover:bg-primary/90 text-white border-none shadow-xl shadow-primary/20"
                  >
                    Proceed to Booking <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Service Packages Section */}
      <section className="py-24 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-4">
                <Sparkles className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Curated Bundles</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-foreground uppercase tracking-tighter leading-[0.85] mb-6">
                Service <br /><span className="text-primary">Packages</span>
              </h2>
              <p className="text-xl text-muted-foreground font-medium">
                Maximize value and performance with our expert-curated maintenance bundles.
              </p>
            </div>
            <Link to="/services">
              <Button variant="outline" className="h-16 px-8 rounded-2xl font-black uppercase tracking-widest text-xs bg-card border-border hover:bg-accent text-foreground">
                View All Services <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {servicePackages.map((pkg, idx) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-card rounded-[3rem] overflow-hidden border border-border shadow-xl hover:shadow-2xl transition-all duration-500"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative h-64 lg:h-auto overflow-hidden">
                    <img 
                      src={pkg.imageUrl || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000"} 
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-card via-transparent to-transparent hidden lg:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent lg:hidden" />
                    
                    {pkg.isPopular && (
                      <div className="absolute top-6 left-6 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
                        Most Popular
                      </div>
                    )}
                  </div>

                  <div className="p-10 flex flex-col justify-between">
                    <div>
                      <h3 className="text-3xl font-black text-foreground uppercase tracking-tighter mb-4 leading-none">
                        {pkg.title}
                      </h3>
                      <p className="text-muted-foreground text-sm font-medium mb-8 leading-relaxed">
                        {pkg.description}
                      </p>
                      
                      <div className="space-y-3 mb-8">
                        {pkg.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-3 text-xs font-bold text-foreground">
                            <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                            </div>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-border">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Bundle Price</div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-black text-primary tracking-tighter">₹{pkg.basePrice}</span>
                          <span className="text-sm text-muted-foreground line-through font-bold">₹{Math.round(pkg.basePrice / (1 - pkg.discountPercentage / 100))}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          onClick={() => {
                            setBookingService({
                              id: pkg.id,
                              title: pkg.title,
                              basePrice: pkg.basePrice,
                              isPackage: true
                            });
                          }}
                          className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-primary hover:bg-primary/90 text-white border-none flex-1"
                        >
                          Book Now
                        </Button>
                        <Link to={`/services/${pkg.id}`}>
                          <Button variant="outline" className="h-14 px-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border-border hover:bg-accent text-foreground">
                            Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section (Marquee Style) */}
      {brands.length > 0 && (
        <section id="brands" className="py-16 bg-white border-b border-slate-100 overflow-hidden">
          <div className="container mx-auto px-4 mb-10">
            <div className="flex items-center gap-6">
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-400">Authorized Service Partner</span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>
          </div>
          <div className="flex overflow-hidden group">
            <div className="flex animate-marquee whitespace-nowrap gap-24 items-center py-4">
              {[...brands, ...brands].map((brand, i) => (
                <div key={i} className="h-12 md:h-16 w-40 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                  <img src={brand.imageUrl} alt={brand.name} className="max-h-full max-w-full object-contain" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      <section className="py-40 relative bg-slate-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-6"
              >
                Service Modules
              </motion.div>
              <h2 className="text-5xl md:text-8xl font-bold text-slate-900 uppercase tracking-tighter leading-[0.85]">
                Specialized <br /><span className="text-primary">Engineering</span>
              </h2>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setActiveCategory("all")}
                className={cn(
                  "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  activeCategory === "all" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-slate-400 hover:bg-slate-100"
                )}
              >
                All Modules
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    activeCategory === cat.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-slate-400 hover:bg-slate-100"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="relative group/carousel">
            <div className="flex overflow-x-auto gap-8 pb-12 scrollbar-none snap-x snap-mandatory scroll-smooth" id="service-carousel">
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                  className="min-w-[320px] md:min-w-[400px] snap-center"
                >
                  <div
                    className="group relative bg-white p-10 rounded-[3rem] border border-slate-100 hover:border-primary/30 transition-all cursor-pointer overflow-hidden shadow-xl h-full flex flex-col"
                    onClick={() => navigate(`/services/${service.id}`)}
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-bl-[6rem] -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
                    
                    <div className="relative z-10 flex-1">
                      <motion.div 
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        className="mb-10 bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center overflow-hidden group-hover:bg-primary transition-colors shadow-sm"
                      >
                        <div className="group-hover:scale-110 group-hover:brightness-0 group-hover:invert transition-all">
                          {getIcon(service)}
                        </div>
                      </motion.div>
                      <h3 className="text-3xl font-bold mb-4 uppercase tracking-tight text-slate-900 group-hover:text-primary transition-colors">{service.title}</h3>
                      <p className="text-slate-500 mb-6 text-base font-medium leading-relaxed line-clamp-2">{service.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-8">
                        {service.features?.slice(0, 3).map((feature: string, i: number) => (
                          <span key={i} className="px-3 py-1 rounded-full bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100 group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/10 transition-colors">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="relative z-10 flex flex-col gap-6 mt-auto">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-2">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Starting From</span>
                          <span className="text-xl font-black text-primary">{service.price}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Duration</span>
                          <span className="text-xs font-bold text-slate-600 flex items-center gap-1"><Clock className="h-3 w-3" /> {service.duration}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <motion.div 
                          whileHover={{ scale: 1.05, y: -2 }} 
                          whileTap={{ scale: 0.95 }}
                          className="flex-1"
                        >
                          <Button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedService(service);
                            }}
                            className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/10 bg-primary hover:bg-primary/90 text-white border-none transition-all"
                          >
                            Book Now <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </motion.div>
                        <Button
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (compareList.find(s => s.id === service.id)) {
                              setCompareList(compareList.filter(s => s.id !== service.id));
                            } else if (compareList.length < 3) {
                              setCompareList([...compareList, service]);
                            } else {
                              toast.error("You can compare up to 3 services");
                            }
                          }}
                          className={cn(
                            "h-14 w-14 rounded-2xl border-slate-200 transition-all",
                            compareList.find(s => s.id === service.id) ? "bg-primary text-white border-primary" : "bg-white text-slate-400 hover:bg-slate-50"
                          )}
                        >
                          <Scale className="h-5 w-5" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Technical Specs</span>
                        <div className="h-12 w-12 rounded-2xl border border-slate-200 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                          <Plus className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Carousel Navigation */}
            <div className="flex justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="icon"
                className="h-14 w-14 rounded-2xl border-slate-200 text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm"
                onClick={() => {
                  const el = document.getElementById('service-carousel');
                  if (el) el.scrollLeft -= 400;
                }}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-14 w-14 rounded-2xl border-slate-200 text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm"
                onClick={() => {
                  const el = document.getElementById('service-carousel');
                  if (el) el.scrollLeft += 400;
                }}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Service Packages Section */}
      <section className="py-40 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full -mr-96 -mt-96" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-6"
            >
              Exclusive Bundles
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-bold text-slate-900 uppercase tracking-tighter leading-none mb-8">
              Premium <span className="text-primary">Service Packages</span>
            </h2>
            <p className="text-slate-500 text-lg font-medium">
              Curated maintenance protocols designed for maximum performance and cost efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {servicePackages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="bg-slate-50 rounded-[3.5rem] p-2 border border-slate-100 group-hover:border-primary/20 transition-all duration-500">
                  <div className="bg-white rounded-[3rem] overflow-hidden shadow-xl border border-slate-100 flex flex-col md:flex-row h-full">
                    <div className="md:w-2/5 relative overflow-hidden">
                      <img 
                        src={pkg.imageUrl || "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2000&auto=format&fit=crop"} 
                        alt={pkg.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                      <div className="absolute bottom-6 left-6">
                        <div className="px-3 py-1 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest mb-2">
                          Save {pkg.discountPercentage}%
                        </div>
                        <div className="text-2xl font-black text-white">₹{pkg.basePrice.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="md:w-3/5 p-10 flex flex-col">
                      <div className="flex justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold uppercase tracking-tight text-slate-900 group-hover:text-primary transition-colors">{pkg.title}</h3>
                        {pkg.isPopular && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                            <Star className="h-3 w-3 fill-current" /> Popular
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 mb-8 text-sm font-medium leading-relaxed">{pkg.description}</p>
                      
                      <div className="space-y-3 mb-10 flex-1">
                        {pkg.features.slice(0, 4).map((feature, i) => (
                          <div key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <CheckCircle2 className="h-3 w-3 text-primary" />
                            </div>
                            {feature}
                          </div>
                        ))}
                      </div>

                      <Button 
                        onClick={() => {
                          const firstService = dynamicServices.find(s => s.id === pkg.serviceIds[0]);
                          setBookingService(firstService || dynamicServices[0]);
                        }}
                        className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs bg-slate-900 hover:bg-primary text-white border-none transition-all shadow-lg shadow-slate-900/10"
                      >
                        Book Package <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Bento Style */}
      <section id="why-choose-us" className="py-40 bg-white text-slate-900 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-8"
            >
              The CarMechs Advantage
            </motion.div>
            <h2 className="text-6xl md:text-8xl font-bold uppercase tracking-tighter leading-[0.85] mb-10">
              Built <br />For <span className="text-primary">Trust.</span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium text-xl leading-relaxed">
              {uiSettings.whyChooseDescription || "We've redefined the automotive service lifecycle with a focus on radical transparency and technical excellence."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[700px]">
            {/* Main Feature - Master Technicians */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 md:row-span-2 p-12 rounded-[3.5rem] bg-slate-900 text-white relative overflow-hidden group flex flex-col justify-end"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/30 transition-colors" />
              <div className="relative z-10">
                <div className="bg-primary/20 p-6 rounded-3xl w-fit mb-8 group-hover:scale-110 transition-transform">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-4xl font-black uppercase tracking-tighter leading-none mb-6">
                  Certified <br />Master <br /><span className="text-primary">Technicians</span>
                </h3>
                <p className="text-white/60 font-medium text-lg leading-relaxed max-w-md">
                  Every operator in our network undergoes rigorous technical validation and continuous performance monitoring.
                </p>
              </div>
            </motion.div>

            {/* Feature 2 - Express Service */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-2 p-10 rounded-[3rem] bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-all group flex items-center gap-8"
            >
              <div className="bg-primary/10 p-6 rounded-2xl group-hover:rotate-12 transition-transform shrink-0">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h4 className="font-black uppercase tracking-tight text-xl mb-2">90-Min Express Service</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">Precision maintenance protocols optimized for maximum efficiency without compromise.</p>
              </div>
            </motion.div>

            {/* Feature 3 - Zero Hidden Costs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-10 rounded-[3rem] bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-all group flex flex-col justify-between"
            >
              <div className="bg-primary/10 p-5 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-black uppercase tracking-tight text-lg mb-2">Zero Hidden Costs</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Upfront pricing with detailed digital breakdowns for every component and labor hour.</p>
              </div>
            </motion.div>

            {/* Feature 4 - Genuine Parts */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-10 rounded-[3rem] bg-primary text-white hover:bg-primary/90 transition-all group flex flex-col justify-between"
            >
              <div className="bg-white/20 p-5 rounded-2xl w-fit group-hover:rotate-12 transition-transform">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-black uppercase tracking-tight text-lg mb-2">100% Genuine Parts</h4>
                <p className="text-xs text-white/70 font-medium leading-relaxed">Direct manufacturer sourcing ensures peak performance and longevity for your machine.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-40 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,68,68,0.03),transparent_70%)]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-24">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Transmission Logs</span>
            </div>
            <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-6">
              Verified <br /> Feedback
            </h2>
            <p className="text-lg text-white/40 font-medium">Real experiences from our global network of machine operators.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(uiSettings.testimonials && uiSettings.testimonials.length > 0 ? uiSettings.testimonials : publishedReviews).map((item: any, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm p-10 rounded-[3rem] border border-white/10 relative group hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={cn(
                        "h-4 w-4",
                        star <= (item.rating || 5) ? "text-yellow-400 fill-yellow-400" : "text-white/10"
                      )} 
                    />
                  ))}
                </div>
                <p className="text-xl text-white/80 font-medium leading-relaxed mb-10 italic">
                  "{item.quote || item.comment}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center overflow-hidden">
                    {item.avatar ? (
                      <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white/40 font-black uppercase">{(item.name || item.userName).charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-black text-white uppercase tracking-widest">{item.name || item.userName}</p>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Verified Operator</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-40 bg-white relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Direct Uplink</span>
              </div>
              <h2 className="text-5xl md:text-8xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-8">
                Connect <br /> With Us
              </h2>
              <p className="text-xl text-slate-500 font-medium mb-12 leading-relaxed">
                Have a technical query or need immediate assistance? Our support engineers are standing by to help you navigate your vehicle's needs.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-6 group">
                  <div className="bg-slate-50 h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors shadow-sm border border-slate-100">
                    <MapPin className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Base Operations</h3>
                    <p className="text-lg font-bold text-slate-900">{settings.address || "Newtown, Kolkata 700156"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="bg-slate-50 h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors shadow-sm border border-slate-100">
                    <Phone className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Voice Uplink</h3>
                    <p className="text-lg font-bold text-slate-900">{settings.phone || "+91 98765 43210"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="bg-slate-50 h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors shadow-sm border border-slate-100">
                    <Mail className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Data Transmission</h3>
                    <p className="text-lg font-bold text-slate-900">{settings.email || "support@carmechs.com"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <motion.div 
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white p-10 md:p-16 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 -z-10" />
                
                <form className="space-y-8" onSubmit={handleContactSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">First Name</label>
                      <input 
                        type="text" 
                        required
                        value={contactForm.firstName}
                        onChange={(e) => setContactForm({ ...contactForm, firstName: e.target.value })}
                        className="w-full h-16 px-6 rounded-2xl border border-slate-100 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Last Name</label>
                      <input 
                        type="text" 
                        required
                        value={contactForm.lastName}
                        onChange={(e) => setContactForm({ ...contactForm, lastName: e.target.value })}
                        className="w-full h-16 px-6 rounded-2xl border border-slate-100 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full h-16 px-6 rounded-2xl border border-slate-100 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Message</label>
                    <textarea 
                      rows={4}
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full p-6 rounded-2xl border border-slate-100 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold resize-none"
                      placeholder="Describe your inquiry..."
                    ></textarea>
                  </div>

                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    size="lg" 
                    className="w-full h-20 rounded-[2rem] font-black uppercase tracking-widest text-lg shadow-2xl shadow-primary/20 group bg-primary hover:bg-primary/90 text-white border-none"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <>
                        Send Transmission <Send className="ml-3 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>


      {/* Gallery Section */}
      <GallerySection 
        title="Our Premium Workshop" 
        subtitle="Explore our state-of-the-art facilities and the luxury vehicles we service with precision." 
      />

      {/* Brands Carousel */}
      <BrandsCarousel />

      {/* Service Catalog Section */}
      <ServiceCatalog />

      {/* Core Services Section */}
      <CoreServicesSection 
        title="Core Engineering Services" 
        subtitle="Specialized maintenance modules for high-performance and luxury vehicles." 
      />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Location Section */}
      <div id="locations">
        <LocationSection 
          title="Visit Our Service Hubs" 
          content="Our growing network of premium workshops is equipped with the latest diagnostic tools and OEM parts."
        />
      </div>

      {/* Comparison Floating Bar */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-[2.5rem] shadow-2xl flex items-center gap-6"
          >
            <div className="flex -space-x-4">
              {compareList.map(s => (
                <div key={s.id} className="h-12 w-12 rounded-2xl bg-primary border-4 border-slate-900 flex items-center justify-center text-white shadow-lg">
                  <Scale className="h-5 w-5" />
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Comparison Engine</span>
              <span className="text-xs font-bold text-white">{compareList.length} Modules Selected</span>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setIsCompareOpen(true)}
                className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px]"
              >
                Analyze Side-by-Side
              </Button>
              <Button 
                variant="ghost"
                onClick={() => setCompareList([])}
                className="h-12 w-12 rounded-xl text-white/40 hover:text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ComparisonModal 
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        services={compareList}
      />

      {/* CTA Section */}
      <section className="py-48 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary -z-10" />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/4 w-[1200px] h-[1200px] border border-white/10 rounded-full -z-10" 
        />
        
        <div className="container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-6xl md:text-[10rem] font-bold mb-12 uppercase tracking-tighter leading-[0.8]">
              Ready for <br />The <span className="text-slate-900">Future?</span>
            </h2>
            <p className="text-2xl md:text-3xl text-white/80 mb-16 max-w-2xl mx-auto font-medium leading-relaxed">
              Join 50,000+ car owners who have switched to a smarter way of car maintenance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link to="/book" className="w-full sm:w-auto">
                <Button size="lg" className="h-24 px-16 rounded-[2.5rem] bg-white text-primary hover:bg-slate-50 text-2xl font-bold uppercase tracking-widest shadow-2xl shadow-black/10 w-full">
                  Book Service <ChevronRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
              <div className="flex items-center gap-6 px-10 py-5 rounded-[2.5rem] bg-white/10 backdrop-blur-md border border-white/20">
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-12 w-12 rounded-full border-4 border-white/20 bg-slate-100 overflow-hidden shadow-xl">
                      <img src={`https://picsum.photos/seed/${i+10}/100/100`} alt="User" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold uppercase tracking-widest">4.9/5 User Rating</div>
                  <div className="text-xs text-white/60 font-bold uppercase tracking-tighter">Verified Owners</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <ServiceModal 
        service={selectedService} 
        isOpen={!!selectedService} 
        onClose={() => setSelectedService(null)}
        calculatedPrice={selectedService ? calculateCalculatedPrice(selectedService) : ""}
        isVehicleSelected={!!(quickVehicle.make && quickVehicle.model && quickVehicle.fuel)}
        vehicleDetails={quickVehicle}
      />

      <BookingModal 
        service={bookingService}
        isOpen={!!bookingService}
        onClose={() => setBookingService(null)}
      />
    </div>
  );
}
