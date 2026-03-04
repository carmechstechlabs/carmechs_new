import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData, PageSection } from "@/context/DataContext";
import { NotFound } from "./NotFound";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShieldCheck, Clock, IndianRupee, Wrench, Star, ChevronRight, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { Home } from "./Home";

const IconMap: Record<string, any> = {
  ShieldCheck,
  Clock,
  IndianRupee,
  Wrench,
  Star
};

export function DynamicPage() {
  const { slug } = useParams();
  const { uiSettings, services, brands } = useData();
  const [carSelection, setCarSelection] = React.useState({ make: '', model: '', fuel: '' });
  
  const pageSlug = slug || 'home';
  const page = uiSettings.pages?.find(p => p.slug === pageSlug);

  if (!page || (!page.isPublished && pageSlug !== 'home')) {
    if (pageSlug === 'home') {
      return <Home />;
    }
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-[#fdfcfb]">
      {page.sections.map((section, idx) => (
        <React.Fragment key={section.id}>
          <SectionRenderer 
            section={section} 
            uiSettings={uiSettings}
            primaryColor={uiSettings.primaryColor}
            heroBgOpacity={uiSettings.heroBgOpacity}
            services={services}
            brands={brands}
            idx={idx}
            carSelection={carSelection}
            setCarSelection={setCarSelection}
          />
        </React.Fragment>
      ))}
    </div>
  );
}

interface SectionRendererProps {
  section: PageSection;
  uiSettings: any;
  primaryColor: string;
  heroBgOpacity?: number;
  services: any[];
  brands: any[];
  idx: number;
  carSelection: { make: string; model: string; fuel: string };
  setCarSelection: React.Dispatch<React.SetStateAction<{ make: string; model: string; fuel: string }>>;
}

function SectionRenderer({ section, uiSettings, primaryColor, heroBgOpacity, services, brands, idx, carSelection, setCarSelection }: SectionRendererProps) {
  const { carMakes, carModels, fuelTypes } = useData();
  const navigate = useNavigate();

  const calculatePrice = (basePrice: number) => {
    let additionalPrice = 0;
    const make = carMakes.find(m => m.name === carSelection.make);
    if (make) additionalPrice += make.price;
    const model = carModels.find(m => m.name === carSelection.model);
    if (model) additionalPrice += model.price;
    const fuel = fuelTypes.find(f => f.name === carSelection.fuel);
    if (fuel) additionalPrice += fuel.price;
    return Math.round(basePrice + additionalPrice);
  };

  const isVehicleSelected = carSelection.make && carSelection.model && carSelection.fuel;

  switch (section.type) {
    case 'hero':
      return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-slate-50 overflow-hidden">
          {uiSettings.heroBgImage && (
            <div className="absolute inset-0 z-0">
              <img 
                src={uiSettings.heroBgImage} 
                alt="Hero Background" 
                className="w-full h-full object-cover opacity-10"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent" />
            </div>
          )}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4 -z-10" />
          
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6"
                >
                  <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">India's #1 Car Service Network</span>
                </motion.div>
                
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-8 text-slate-900">
                  {section.title}
                </h1>
                <p className="text-lg md:text-xl text-slate-500 font-medium mb-10 max-w-xl leading-relaxed">
                  {section.subtitle}
                </p>

                {/* Trust Badges */}
                <div className="flex flex-wrap gap-8 mb-10">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Genuine</p>
                      <p className="text-xs font-bold text-slate-900">Spare Parts</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">60 Min</p>
                      <p className="text-xs font-bold text-slate-900">Express Service</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 lg:p-12 relative"
              >
                <div className="absolute -top-6 -right-6 h-20 w-20 bg-primary rounded-3xl flex items-center justify-center shadow-xl shadow-primary/20 -rotate-12">
                  <Wrench className="h-10 w-10 text-white" />
                </div>

                <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-8">Select Your Car</h3>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Make</label>
                      <select 
                        className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        value={carSelection.make}
                        onChange={(e) => setCarSelection({ ...carSelection, make: e.target.value, model: '', fuel: '' })}
                      >
                        <option value="">Select Make</option>
                        {carMakes.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Model</label>
                      <select 
                        className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        value={carSelection.model}
                        onChange={(e) => setCarSelection({ ...carSelection, model: e.target.value, fuel: '' })}
                        disabled={!carSelection.make}
                      >
                        <option value="">Select Model</option>
                        {carModels.filter(m => m.make === carSelection.make).map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fuel</label>
                      <select 
                        className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        value={carSelection.fuel}
                        onChange={(e) => setCarSelection({ ...carSelection, fuel: e.target.value })}
                        disabled={!carSelection.model}
                      >
                        <option value="">Select Fuel</option>
                        {fuelTypes.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <Link to="/book" state={{ vehicleDetails: carSelection }}>
                    <Button className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] mt-4">
                      Check Service Price
                    </Button>
                  </Link>
                  
                  <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Free Pickup & Drop Included
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      );

    case 'features':
      return (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block px-3 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest mb-4"
              >
                Why CarMechs?
              </motion.div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-6">
                {section.title}
              </h2>
              <p className="text-slate-500 font-medium">{section.subtitle}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "Expert Care", desc: "Highly trained and certified mechanics for your vehicle.", icon: Wrench },
                { title: "Genuine Parts", desc: "100% authentic OEM/OES spare parts guaranteed.", icon: ShieldCheck },
                { title: "Timely Service", desc: "We value your time with express turnaround options.", icon: Clock },
                { title: "Best Value", desc: "Transparent pricing with no hidden diagnostic fees.", icon: IndianRupee }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:border-primary/20 transition-all hover:shadow-xl hover:shadow-primary/5 group"
                >
                  <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:bg-primary transition-colors">
                    <item.icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-3">{item.title}</h3>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'content':
      return (
        <section className="py-24 bg-slate-50 overflow-hidden">
          <div className="container mx-auto px-4 lg:px-8">
            <div className={cn(
              "flex flex-col lg:flex-row items-center gap-20",
              idx % 2 === 0 ? "" : "lg:flex-row-reverse"
            )}>
              <motion.div 
                initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex-1"
              >
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter mb-8 leading-[0.9]">
                  {section.title}
                </h2>
                <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10">
                  {section.content}
                </p>
                <Button variant="outline" className="h-14 px-8 rounded-xl border-slate-200 font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:border-primary hover:text-white transition-all">
                  Learn More
                </Button>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="flex-1 w-full"
              >
                {section.image ? (
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-primary/5 rounded-[3rem] -z-10 group-hover:scale-105 transition-transform duration-700" />
                    <img src={section.image} className="rounded-[2.5rem] shadow-2xl w-full h-[500px] object-cover" alt="" />
                  </div>
                ) : (
                  <div className="bg-white rounded-[2.5rem] h-[500px] flex items-center justify-center border-2 border-dashed border-slate-200">
                    <ImageIcon className="h-16 w-16 text-slate-200" />
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      );

    case 'services':
      return (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4"
                >
                  Service Categories
                </motion.div>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none text-slate-900">{section.title}</h2>
              </div>
              <Link to="/services">
                <Button variant="ghost" className="h-12 px-6 rounded-xl text-primary font-black uppercase tracking-widest text-[10px] hover:bg-primary/10 transition-all">
                  View All Services <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {services.slice(0, 12).map((service, i) => (
                <motion.div 
                  key={service.id} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-slate-50 border border-slate-100 rounded-3xl p-6 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:border-primary/20 transition-all group text-center cursor-pointer relative"
                  onClick={() => navigate(`/book?serviceId=${service.id}&make=${carSelection.make}&model=${carSelection.model}&fuel=${carSelection.fuel}`)}
                >
                  <div className="h-12 w-12 bg-white rounded-xl mx-auto mb-4 flex items-center justify-center shadow-sm border border-slate-100 group-hover:bg-primary transition-colors">
                    <Wrench className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-tight text-slate-900 group-hover:text-primary transition-colors mb-2">{service.title}</h3>
                  <div className="text-[10px] font-bold text-primary">
                    {isVehicleSelected ? `₹${calculatePrice(service.basePrice)}` : service.price}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'brands':
      return (
        <section className="py-20 bg-white border-y border-slate-100 overflow-hidden">
          <div className="container mx-auto px-4 mb-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center">{section.title}</h3>
          </div>
          <div className="flex overflow-hidden group">
            <div className="flex animate-marquee whitespace-nowrap gap-20 items-center py-4">
              {[...brands, ...brands].map((brand, i) => (
                <div key={i} className="h-10 w-32 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                  <img src={brand.imageUrl} alt={brand.name} className="max-h-full max-w-full object-contain" />
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'cta':
      return (
        <section className="py-24 relative overflow-hidden bg-slate-900">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="container mx-auto px-4 lg:px-8 text-center text-white relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-8 text-white">
                {section.title}
              </h2>
              <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto font-medium leading-relaxed">
                {section.content}
              </p>
              <Link to="/book">
                <Button size="lg" className="h-16 px-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20 transition-all hover:scale-105 border-none">
                  Book Your Service Now
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      );

    default:
      return null;
  }
}



