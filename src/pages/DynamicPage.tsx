import React from "react";
import { useParams } from "react-router-dom";
import { useData, PageSection } from "@/context/DataContext";
import { NotFound } from "./NotFound";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShieldCheck, Clock, IndianRupee, Wrench, Star, ChevronRight, Image as ImageIcon } from "lucide-react";

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
  
  const pageSlug = slug || 'home';
  const page = uiSettings.pages?.find(p => p.slug === pageSlug);

  if (!page || (!page.isPublished && pageSlug !== 'home')) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-[#fdfcfb]">
      {page.sections.map((section, idx) => (
        <React.Fragment key={section.id}>
          <SectionRenderer 
            section={section} 
            primaryColor={uiSettings.primaryColor}
            heroBgOpacity={uiSettings.heroBgOpacity}
            services={services}
            brands={brands}
            idx={idx}
          />
        </React.Fragment>
      ))}
    </div>
  );
}

interface SectionRendererProps {
  section: PageSection;
  primaryColor: string;
  heroBgOpacity?: number;
  services: any[];
  brands: any[];
  idx: number;
}

function SectionRenderer({ section, primaryColor, heroBgOpacity, services, brands, idx }: SectionRendererProps) {
  switch (section.type) {
    case 'hero':
      return (
        <section 
          className="relative text-white py-32 lg:py-48 flex items-center overflow-hidden"
          style={{ backgroundColor: primaryColor || '#0A0A0A' }}
        >
          {section.image && (
            <div className="absolute inset-0 z-0">
              <motion.img 
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: heroBgOpacity || 0.3 }}
                transition={{ duration: 1.5 }}
                src={section.image} 
                className="w-full h-full object-cover" 
                alt="" 
              />
              <div 
                className="absolute inset-0" 
                style={{ 
                  background: `linear-gradient(to right, ${primaryColor || '#0A0A0A'} 0%, ${primaryColor || '#0A0A0A'}F2 30%, ${primaryColor || '#0A0A0A'}80 100%)` 
                }}
              />
            </div>
          )}
          
          {/* Floating Glows */}
          <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full blur-[120px] opacity-20" style={{ backgroundColor: primaryColor || '#fc9c0a' }} />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm mb-6"
              >
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Premium Automotive Solutions</span>
              </motion.div>
              
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85] mb-8">
                {section.title}
              </h1>
              <p className="text-xl md:text-2xl text-white/70 font-medium mb-12 max-w-2xl leading-relaxed">
                {section.subtitle}
              </p>
              <div className="flex flex-wrap gap-6">
                <Link to="/book">
                  <Button size="lg" className="h-20 px-12 rounded-3xl bg-white text-black hover:bg-slate-100 font-black uppercase tracking-widest text-lg shadow-2xl shadow-black/20 transition-all hover:scale-105">
                    Book Appointment
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      );

    case 'features':
      return (
        <section className="py-32 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2 -z-10" />
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div className="max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4"
                >
                  The Advantage
                </motion.div>
                <h2 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                  {section.title}
                </h2>
              </div>
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
                  whileHover={{ y: -10 }}
                  className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 hover:border-primary/20 transition-all hover:shadow-2xl hover:shadow-primary/5 group"
                >
                  <div className="h-16 w-16 bg-slate-900 rounded-[1.25rem] flex items-center justify-center mb-8 shadow-xl group-hover:bg-primary transition-colors">
                    <item.icon className="h-7 w-7 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">{item.title}</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'content':
      return (
        <section className="py-32 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className={cn(
              "flex flex-col lg:flex-row items-center gap-24",
              idx % 2 === 0 ? "" : "lg:flex-row-reverse"
            )}>
              <motion.div 
                initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex-1"
              >
                <h2 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter mb-8 leading-[0.9]">
                  {section.title}
                </h2>
                <p className="text-xl text-slate-500 font-medium leading-relaxed mb-10">
                  {section.content}
                </p>
                <Button variant="outline" className="h-16 px-10 rounded-2xl border-slate-200 font-black uppercase tracking-widest text-xs hover:bg-primary hover:border-primary hover:text-white transition-all">
                  Explore More
                </Button>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="flex-1 w-full"
              >
                {section.image ? (
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-primary/10 rounded-[4rem] -z-10 group-hover:scale-105 transition-transform duration-700" />
                    <img src={section.image} className="rounded-[3.5rem] shadow-2xl w-full h-[600px] object-cover group-hover:scale-[1.02] transition-transform duration-700" alt="" />
                    <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-primary rounded-[3rem] -z-20 animate-pulse" />
                  </div>
                ) : (
                  <div className="bg-slate-100 rounded-[3.5rem] h-[600px] flex items-center justify-center border-4 border-dashed border-slate-200">
                    <ImageIcon className="h-24 w-24 text-slate-200" />
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      );

    case 'services':
      return (
        <section className="py-32 bg-[#0A0A0A] text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-10 -z-10" />
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-widest mb-4"
                >
                  Service Catalog
                </motion.div>
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">{section.title}</h2>
              </div>
              <Link to="/services">
                <Button variant="outline" className="h-14 px-8 rounded-2xl border-white/10 bg-white/5 text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all">
                  View Full Catalog <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.slice(0, 3).map((service, i) => (
                <motion.div 
                  key={service.id} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 border border-white/5 rounded-[3rem] p-10 hover:bg-white/10 transition-all group"
                >
                  <div className="h-16 w-16 bg-primary rounded-2xl mb-8 flex items-center justify-center shadow-2xl shadow-primary/20 group-hover:scale-110 transition-transform">
                    <Wrench className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tight mb-4">{service.title}</h3>
                  <p className="text-white/40 text-sm font-medium mb-10 line-clamp-2 leading-relaxed">{service.description}</p>
                  <div className="flex items-center justify-between pt-8 border-t border-white/5">
                    <span className="text-3xl font-black text-primary tracking-tighter">₹{service.basePrice}</span>
                    <Link to="/book">
                      <Button className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/10">Book Now</Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'brands':
      return (
        <section className="py-24 bg-white border-y border-slate-100 overflow-hidden">
          <div className="container mx-auto px-4 mb-12">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{section.title}</span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>
          </div>
          <div className="flex overflow-hidden group">
            <div className="flex animate-marquee whitespace-nowrap gap-20 items-center py-4">
              {[...brands, ...brands].map((brand, i) => (
                <div key={i} className="h-12 w-40 flex items-center justify-center opacity-30 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                  <img src={brand.imageUrl} alt={brand.name} className="max-h-full max-w-full object-contain" />
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'cta':
      return (
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary -z-10" />
          <div className="container mx-auto px-4 text-center text-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-10">
                {section.title}
              </h2>
              <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                {section.content}
              </p>
              <Link to="/book">
                <Button size="lg" className="h-20 px-16 rounded-[2.5rem] bg-white text-primary hover:bg-slate-100 font-black uppercase tracking-widest text-xl shadow-2xl shadow-black/20 transition-all hover:scale-105">
                  Get Started Now
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

// Helper for cn
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}


