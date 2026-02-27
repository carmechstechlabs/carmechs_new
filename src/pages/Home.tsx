import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
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
  Plus
} from "lucide-react";
import { Link } from "react-router-dom";
import { useData } from "@/context/DataContext";
import { useState } from "react";
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
    <div className="flex flex-col bg-[#fcfcfc]">
      {/* Hero Section */}
      <section 
        className="relative min-h-[90vh] flex items-center text-white pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden"
        style={{ backgroundColor: uiSettings.primaryColor || '#0f172a' }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          {uiSettings.heroBgImage ? (
            <>
              <motion.img 
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: uiSettings.heroBgOpacity || 0.3 }}
                transition={{ duration: 1.5 }}
                src={uiSettings.heroBgImage} 
                alt="Hero Background" 
                className="w-full h-full object-cover"
              />
              <div 
                className="absolute inset-0"
                style={{ 
                  background: `linear-gradient(to right, ${uiSettings.primaryColor || '#0f172a'} 0%, ${uiSettings.primaryColor || '#0f172a'}F2 30%, ${uiSettings.primaryColor || '#0f172a'}80 100%)` 
                }}
              ></div>
            </>
          ) : (
            <div className="w-full h-full bg-slate-900 opacity-40"></div>
          )}
          
          {/* Floating Particles/Glows */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 -left-20 w-96 h-96 rounded-full blur-[120px]"
            style={{ backgroundColor: uiSettings.primaryColor || '#fc9c0a' }}
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
              x: [0, -40, 0],
              y: [0, 60, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
            className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[150px]"
          />
        </div>
        
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
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm mb-6"
              >
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Trusted by 50,000+ Owners</span>
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[0.9] uppercase tracking-tighter">
                {uiSettings.heroTitle ? (
                  <span dangerouslySetInnerHTML={{ __html: uiSettings.heroTitle.replace(/\\n/g, '<br />') }} />
                ) : (
                  <>Precision <br /><span className="text-primary">Car Care</span></>
                )}
              </h1>
              
              <p className="text-lg md:text-xl text-white/70 mb-10 max-w-lg font-medium leading-relaxed">
                {uiSettings.heroSubtitle || "Experience the next generation of car maintenance with our expert door-step service and transparent digital tracking."}
              </p>
              
              <div className="flex flex-wrap gap-5">
                <Link to="/book">
                  <Button size="lg" className="h-16 px-10 rounded-2xl text-sm font-black uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-105 transition-all">
                    Start Booking
                  </Button>
                </Link>
                <Link to="/services">
                  <Button variant="outline" size="lg" className="h-16 px-10 rounded-2xl text-sm font-black uppercase tracking-widest bg-white/5 text-white border-white/10 hover:bg-white hover:text-slate-900 transition-all backdrop-blur-sm">
                    Explore Services
                  </Button>
                </Link>
              </div>
              
              {/* Stats Row */}
              <div className="mt-16 grid grid-cols-3 gap-8 border-t border-white/10 pt-8">
                {[
                  { label: "Rating", value: "4.9/5" },
                  { label: "Mechanics", value: "250+" },
                  { label: "Cities", value: "12" }
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-2xl font-black text-white">{stat.value}</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{stat.label}</div>
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
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 aspect-[4/5] group">
                <img 
                  src={uiSettings.heroBgImage || "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2000&auto=format&fit=crop"} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  alt="Car Service"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Floating Info Cards */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-10 -left-10 glass p-5 rounded-3xl shadow-2xl max-w-[200px]"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Verified</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-bold">100% Genuine OEM/OES Spare Parts Guaranteed.</p>
                </motion.div>
                
                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute bottom-10 -right-10 glass p-5 rounded-3xl shadow-2xl max-w-[200px]"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 bg-primary/20 rounded-xl flex items-center justify-center">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Express</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-bold">90-Minute Service Turnaround for Basic Maintenance.</p>
                </motion.div>
              </div>
              
              {/* Decorative Rings */}
              <div className="absolute -inset-10 border border-white/5 rounded-[4rem] -z-10" />
              <div className="absolute -inset-20 border border-white/5 rounded-[5rem] -z-20" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brands Section (Marquee Style) */}
      {brands.length > 0 && (
        <section className="py-12 bg-white border-b border-slate-100 overflow-hidden">
          <div className="container mx-auto px-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Authorized Service Partner</span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>
          </div>
          <div className="flex overflow-hidden group">
            <div className="flex animate-marquee whitespace-nowrap gap-16 items-center py-4">
              {[...brands, ...brands].map((brand, i) => (
                <div key={i} className="h-10 md:h-12 w-32 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                  <img src={brand.imageUrl} alt={brand.name} className="max-h-full max-w-full object-contain" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      <section className="py-32 relative bg-grid-pattern">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4"
              >
                Our Expertise
              </motion.div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                Specialized <br /><span className="text-primary">Service Modules</span>
              </h2>
            </div>
            <p className="text-slate-500 max-w-sm font-medium">
              Engineered for reliability. Select from our curated service packages designed for every vehicle stage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(dynamicServices.length > 0 ? dynamicServices : services).map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all cursor-pointer overflow-hidden"
                onClick={() => setSelectedService({ ...service, icon: getIcon(service) })}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[5rem] -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />
                
                <div className="relative z-10">
                  <div className="mb-8 bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden group-hover:bg-primary transition-colors shadow-xl shadow-black/10">
                    <div className="group-hover:scale-110 group-hover:brightness-0 group-hover:invert transition-all">
                      {getIcon(service)}
                    </div>
                  </div>
                  <h3 className="text-2xl font-black mb-3 uppercase tracking-tight text-slate-900">{service.title}</h3>
                  <p className="text-slate-500 mb-8 text-sm font-medium leading-relaxed">{service.description}</p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <span className="text-xs font-black uppercase tracking-widest text-primary">Configure Service</span>
                    <div className="h-10 w-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                      <Plus className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Bento Style */}
      <section className="py-32 bg-[#0A0A0A] text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-5 space-y-12">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-widest mb-6"
                >
                  The CarMechs Advantage
                </motion.div>
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-8">
                  Engineered <br />For <span className="text-primary">Trust.</span>
                </h2>
                <p className="text-white/50 max-w-md font-medium leading-relaxed">
                  {uiSettings.whyChooseDescription || "We've redefined the automotive service lifecycle with a focus on radical transparency and technical excellence."}
                </p>
              </div>

              <div className="space-y-6">
                {(uiSettings.features || features).map((feature, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-6 p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <div className="bg-primary/20 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                      {'iconName' in feature ? getLucideIcon(feature.iconName) : (feature as any).icon}
                    </div>
                    <div>
                      <h4 className="font-black uppercase tracking-tight text-lg mb-1">{feature.title}</h4>
                      <p className="text-xs text-white/40 font-medium">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Visual Bento Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                whileHover={{ scale: 0.98 }}
                className="md:col-span-2 rounded-[3rem] overflow-hidden relative aspect-video shadow-2xl"
              >
                <img 
                  src={uiSettings.whyChooseImage || "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"} 
                  alt="Mechanic working" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-10 left-10">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                      <Star className="h-6 w-6 text-white fill-current" />
                    </div>
                    <div>
                      <div className="text-2xl font-black">{uiSettings.testimonialRating || 4.9}</div>
                      <div className="text-[10px] uppercase tracking-widest text-white/60 font-bold">User Satisfaction</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="bg-primary rounded-[3rem] p-10 flex flex-col justify-between group cursor-pointer overflow-hidden relative">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-bl-[10rem] group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10">
                  <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-4">Real-Time <br />Tracking</h3>
                  <p className="text-white/80 text-sm font-medium">Monitor every stage of your service through our live dashboard.</p>
                </div>
                <div className="mt-8 relative z-10">
                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-xl">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[3rem] p-10 flex flex-col justify-between group cursor-pointer overflow-hidden relative text-slate-900">
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-primary/5 rounded-tl-[10rem] group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10">
                  <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-4">Expert <br />Network</h3>
                  <p className="text-slate-500 text-sm font-medium">Access our network of 250+ certified master mechanics.</p>
                </div>
                <div className="mt-8 relative z-10">
                  <div className="h-12 w-12 rounded-full bg-slate-900 flex items-center justify-center shadow-xl">
                    <Wrench className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary -z-10" />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/4 w-[1000px] h-[1000px] border border-white/10 rounded-full -z-10" 
        />
        
        <div className="container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-5xl md:text-8xl font-black mb-10 uppercase tracking-tighter leading-[0.85]">
              Ready for <br />A <span className="text-slate-900">Better Drive?</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto font-medium">
              Join 50,000+ car owners who have switched to a smarter way of car maintenance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/book" className="w-full sm:w-auto">
                <Button size="lg" className="h-20 px-12 rounded-3xl bg-white text-primary hover:bg-slate-100 text-lg font-black uppercase tracking-widest shadow-2xl shadow-black/20 w-full">
                  Book Appointment
                </Button>
              </Link>
              <div className="flex items-center gap-4 px-8 py-4 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/10">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-primary bg-slate-200 overflow-hidden">
                      <img src={`https://picsum.photos/seed/${i+10}/100/100`} alt="User" />
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="text-xs font-black uppercase tracking-widest">4.9/5 Rating</div>
                  <div className="text-[10px] text-white/60 font-bold">From verified owners</div>
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
