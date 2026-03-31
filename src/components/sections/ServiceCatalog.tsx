import React from 'react';
import { motion } from 'motion/react';
import { IndianRupee, Clock, CheckCircle2, ShieldCheck, Zap, Activity, Disc, PaintBucket, Sparkles, Wrench, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useData } from '@/context/DataContext';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';

export function ServiceCatalog() {
  const { services, categories } = useData();

  const getIcon = (service: any) => {
    if (service.iconUrl) {
      return <img src={service.iconUrl} alt={service.title} className="h-8 w-8 object-contain group-hover:scale-110 transition-transform duration-500" />;
    }
    
    if (service.iconName) {
      const Icon = (LucideIcons as any)[service.iconName] || LucideIcons.Wrench;
      return <Icon className="h-8 w-8 text-primary group-hover:text-white transition-colors" />;
    }

    return <Wrench className="h-8 w-8 text-primary group-hover:text-white transition-colors" />;
  };

  return (
    <section className="py-24 bg-white" id="services">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-6"
          >
            Service Catalog
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-8">
            Premium Care for Your Luxury Vehicle
          </h2>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            Transparent pricing and expert care for premium and luxury brands. We use only genuine parts and manufacturer-approved protocols.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 hover:bg-white hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:text-white transition-colors duration-500 overflow-hidden">
                    {getIcon(service)}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Starting From</p>
                    <p className="text-2xl font-black text-slate-900">₹{service.basePrice?.toLocaleString()}</p>
                  </div>
                </div>

                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 line-clamp-2">
                  {service.description}
                </p>

                <div className="space-y-3 mb-8">
                  {service.features?.slice(0, 4).map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-xs text-slate-600 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-6 border-t border-slate-200">
                  <Link to={`/book?serviceId=${service.id}`} className="flex-1">
                    <Button className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[10px] bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                      Book Now
                    </Button>
                  </Link>
                  <Link to={`/services/${service.id}`}>
                    <Button variant="outline" className="h-12 px-4 rounded-xl font-black uppercase tracking-widest text-[10px] border-slate-100 hover:bg-slate-50">
                      Details
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
