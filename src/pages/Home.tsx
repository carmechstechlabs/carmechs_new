import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "motion/react";
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
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import { Link } from "react-router-dom";
import { useData } from "@/context/DataContext";
import { useState, useRef } from "react";
import { ServiceModal } from "@/components/ServiceModal";

const services = [
  {
    icon: <Wrench className="h-8 w-8 text-primary" />,
    title: "Periodic Services",
    description: "Oil change, filter replacement, and general checkup.",
  },
  {
    icon: <Disc className="h-8 w-8 text-primary" />,
    title: "Tyres & Wheels",
    description: "Alignment, balancing, and tyre replacement.",
  },
  {
    icon: <Battery className="h-8 w-8 text-primary" />,
    title: "Batteries",
    description: "Battery check, charging, and replacement.",
  },
  {
    icon: <PaintBucket className="h-8 w-8 text-primary" />,
    title: "Denting & Painting",
    description: "Scratch removal, dent repair, and full body painting.",
  },
  {
    icon: <Car className="h-8 w-8 text-primary" />,
    title: "AC Service",
    description: "Cooling coil cleaning, gas refill, and compressor check.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: "Car Spa & Cleaning",
    description: "Interior detailing, exterior wash, and polishing.",
  },
];

const features = [
  {
    icon: <ShieldCheck className="h-6 w-6 text-primary" />,
    title: "Genuine Parts",
    description: "We use only 100% genuine OEM/OES spare parts.",
  },
  {
    icon: <Clock className="h-6 w-6 text-primary" />,
    title: "Timely Delivery",
    description: "We value your time and ensure on-time delivery.",
  },
  {
    icon: <IndianRupee className="h-6 w-6 text-primary" />,
    title: "Transparent Pricing",
    description: "Upfront pricing with no hidden charges.",
  },
  {
    icon: <Wrench className="h-6 w-6 text-primary" />,
    title: "Expert Mechanics",
    description: "Highly trained and certified mechanics.",
  },
];

export function Home() {
  const { uiSettings, services: dynamicServices, brands } = useData();
  const [selectedService, setSelectedService] = useState<any>(null);
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
    <div className="flex flex-col bg-white selection:bg-primary/10" ref={containerRef}>
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center text-slate-900 pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden"
      >
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
                  background: `radial-gradient(circle at 20% 50%, #ffffff00 0%, #ffffff 100%), linear-gradient(to right, #ffffff 0%, #ffffffF2 30%, #ffffff80 100%)` 
                }}
              ></div>
            </>
          ) : (
            <div className="w-full h-full bg-slate-50 opacity-40"></div>
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
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 backdrop-blur-md mb-8"
              >
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Next-Gen Automotive Hub</span>
              </motion.div>
              
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-[0.85] uppercase tracking-tighter text-slate-900">
                {uiSettings.heroTitle ? (
                  <span dangerouslySetInnerHTML={{ __html: uiSettings.heroTitle.replace(/\\n/g, '<br />') }} />
                ) : (
                  <>Precision <br /><span className="text-primary">Car Care</span></>
                )}
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-lg font-medium leading-relaxed">
                {uiSettings.heroSubtitle || "Experience the next generation of car maintenance with our expert door-step service and transparent digital tracking."}
              </p>
              
              <div className="flex flex-wrap gap-6">
                <Link to="/book">
                  <Button size="lg" className="h-20 px-12 rounded-[2rem] text-lg font-bold uppercase tracking-widest shadow-xl shadow-primary/10 hover:scale-105 transition-all bg-primary hover:bg-primary/90 text-white">
                    Book Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/services">
                  <Button variant="outline" size="lg" className="h-20 px-12 rounded-[2rem] text-lg font-bold uppercase tracking-widest bg-white text-slate-900 border-slate-200 hover:bg-slate-50 transition-all">
                    Our Catalog
                  </Button>
                </Link>
              </div>
              
              {/* Stats Row */}
              <div className="mt-20 grid grid-cols-3 gap-12 border-t border-slate-100 pt-10">
                {[
                  { label: "User Rating", value: "4.9/5" },
                  { label: "Master Mechs", value: "250+" },
                  { label: "Service Hubs", value: "12" }
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-3xl font-bold text-slate-900 tracking-tighter">{stat.value}</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mt-1">{stat.label}</div>
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
              <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-2xl border border-slate-200 aspect-[4/5] group">
                <img 
                  src={uiSettings.heroBgImage || "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2000&auto=format&fit=crop"} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90"
                  alt="Car Service"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
                
                {/* Floating Info Cards */}
                <motion.div 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-12 -left-12 bg-white/90 backdrop-blur-md p-6 rounded-[2rem] shadow-2xl max-w-[220px] border border-slate-100"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-900">Verified</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">100% Genuine OEM/OES Spare Parts Guaranteed.</p>
                </motion.div>
                
                <motion.div 
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute bottom-12 -right-12 bg-white/90 backdrop-blur-md p-6 rounded-[2rem] shadow-2xl max-w-[220px] border border-slate-100"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-900">Express</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">90-Minute Service Turnaround for Basic Maintenance.</p>
                </motion.div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -inset-10 border border-slate-100 rounded-[5rem] -z-10" />
              <div className="absolute -inset-20 border border-slate-100 rounded-[6rem] -z-20" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 blur-[100px] -z-30" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brands Section (Marquee Style) */}
      {brands.length > 0 && (
        <section className="py-16 bg-white border-b border-slate-100 overflow-hidden">
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
            <p className="text-slate-500 max-w-sm font-medium text-lg leading-relaxed">
              Engineered for reliability. Select from our curated service packages designed for every vehicle stage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {(dynamicServices.length > 0 ? dynamicServices : services).map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -15 }}
                className="group relative bg-white p-10 rounded-[3rem] border border-slate-100 hover:border-primary/30 transition-all cursor-pointer overflow-hidden shadow-xl"
                onClick={() => setSelectedService({ ...service, icon: getIcon(service) })}
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-bl-[6rem] -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
                
                <div className="relative z-10">
                  <div className="mb-10 bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center overflow-hidden group-hover:bg-primary transition-colors shadow-sm">
                    <div className="group-hover:scale-110 group-hover:brightness-0 group-hover:invert transition-all">
                      {getIcon(service)}
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold mb-4 uppercase tracking-tight text-slate-900">{service.title}</h3>
                  <p className="text-slate-500 mb-10 text-base font-medium leading-relaxed line-clamp-2">{service.description}</p>
                  
                  <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Configure Module</span>
                    <div className="h-12 w-12 rounded-2xl border border-slate-200 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                      <Plus className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Bento Style */}
      <section className="py-40 bg-white text-slate-900 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-5 space-y-16">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="inline-block px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-8"
                >
                  The CarMechs Advantage
                </motion.div>
                <h2 className="text-6xl md:text-8xl font-bold uppercase tracking-tighter leading-[0.85] mb-10">
                  Built <br />For <span className="text-primary">Trust.</span>
                </h2>
                <p className="text-slate-500 max-w-md font-medium text-xl leading-relaxed">
                  {uiSettings.whyChooseDescription || "We've redefined the automotive service lifecycle with a focus on radical transparency and technical excellence."}
                </p>
              </div>

              <div className="space-y-8">
                {(uiSettings.features || features).map((feature, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-8 p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors group"
                  >
                    <div className="bg-primary/10 p-5 rounded-2xl group-hover:scale-110 transition-transform">
                      {'iconName' in feature ? getLucideIcon(feature.iconName) : (feature as any).icon}
                    </div>
                    <div>
                      <h4 className="font-bold uppercase tracking-tight text-xl mb-2">{feature.title}</h4>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Visual Bento Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                whileHover={{ scale: 0.98 }}
                className="md:col-span-2 rounded-[4rem] overflow-hidden relative aspect-video shadow-2xl border border-slate-100"
              >
                <img 
                  src={uiSettings.whyChooseImage || "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"} 
                  alt="Mechanic working" 
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent" />
                <div className="absolute bottom-12 left-12">
                  <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center shadow-2xl shadow-primary/40">
                      <Star className="h-8 w-8 text-white fill-current" />
                    </div>
                    <div>
                      <div className="text-4xl font-bold tracking-tighter text-slate-900">{uiSettings.testimonialRating || 4.9}</div>
                      <div className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold mt-1">User Satisfaction</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="bg-primary rounded-[3.5rem] p-12 flex flex-col justify-between group cursor-pointer overflow-hidden relative shadow-2xl shadow-primary/10">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-bl-[12rem] group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10">
                  <h3 className="text-4xl font-bold uppercase tracking-tighter leading-none mb-6 text-white">Live <br />Tracking</h3>
                  <p className="text-white/80 text-base font-medium leading-relaxed">Monitor every stage of your service through our live dashboard.</p>
                </div>
                <div className="mt-12 relative z-10">
                  <div className="h-16 w-16 rounded-3xl bg-white flex items-center justify-center shadow-2xl">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-[3.5rem] p-12 flex flex-col justify-between group cursor-pointer overflow-hidden relative border border-slate-100 hover:bg-slate-100 transition-colors shadow-xl">
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-primary/5 rounded-tl-[12rem] group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10">
                  <h3 className="text-4xl font-bold uppercase tracking-tighter leading-none mb-6 text-slate-900">Expert <br />Network</h3>
                  <p className="text-slate-500 text-base font-medium leading-relaxed">Access our network of 250+ certified master mechanics.</p>
                </div>
                <div className="mt-12 relative z-10">
                  <div className="h-16 w-16 rounded-3xl bg-white flex items-center justify-center shadow-2xl border border-slate-100">
                    <Wrench className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-40 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-8 border border-primary/20"
              >
                Get In Touch
              </motion.div>
              <h2 className="text-6xl md:text-8xl font-bold uppercase tracking-tighter leading-[0.85] mb-12">
                Visit Our <br /><span className="text-primary">Workshop.</span>
              </h2>
              <p className="text-white/60 max-w-md font-medium text-xl leading-relaxed mb-16">
                Have a technical query or need immediate assistance? Our master mechanics are standing by to help you with your automotive needs.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Location</h4>
                    <p className="text-sm font-bold text-white leading-relaxed">{uiSettings.adminLogin.loginTerminalId || "Main Service Hub, New Delhi"}</p>
                    <p className="text-xs text-white/60 mt-1">123, Automotive Zone, Sector 45</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Direct Line</h4>
                    <p className="text-sm font-bold text-white leading-relaxed">+91 98765 43210</p>
                    <p className="text-xs text-white/60 mt-1">Mon - Sat: 9AM - 8PM</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Email Support</h4>
                    <p className="text-sm font-bold text-white leading-relaxed">support@carmechs.com</p>
                    <p className="text-xs text-white/60 mt-1">24/7 Response Time</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">WhatsApp</h4>
                    <p className="text-sm font-bold text-white leading-relaxed">+91 98765 43211</p>
                    <p className="text-xs text-white/60 mt-1">Instant Support</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[4rem] overflow-hidden aspect-square shadow-2xl border border-white/10 relative group">
                <img 
                  src="https://images.unsplash.com/photo-1517524008410-b44336d29a0c?q=80&w=1000&auto=format&fit=crop" 
                  alt="Workshop" 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                
                <div className="absolute bottom-12 left-12 right-12 p-8 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/20">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-widest">Authorized Center</h4>
                      <p className="text-[10px] text-white/60 uppercase font-black tracking-tighter">ISO 9001:2015 Certified</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed font-medium">Our facility is equipped with state-of-the-art diagnostic tools and a team of master mechanics dedicated to your vehicle's health.</p>
                </div>
              </div>
              
              {/* Decorative Rings */}
              <div className="absolute -inset-10 border border-white/5 rounded-[5rem] -z-10" />
              <div className="absolute -inset-20 border border-white/5 rounded-[6rem] -z-20" />
            </div>
          </div>
        </div>
      </section>

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
      />
    </div>
  );
}
