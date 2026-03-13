import React from 'react';
import { motion } from 'motion/react';
import { Activity, ShieldCheck, Sparkles, Search, CheckCircle2, Wrench, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface CoreServicesSectionProps {
  title?: string;
  subtitle?: string;
}

export function CoreServicesSection({ title, subtitle }: CoreServicesSectionProps) {
  const coreServices = [
    { title: "Engine Repair", desc: "Complete engine overhauls and precision tuning for peak performance.", icon: Activity },
    { title: "Brake Service", desc: "Advanced braking system diagnostics and component replacement.", icon: ShieldCheck },
    { title: "Tire Rotation", desc: "Laser-guided alignment and high-speed balancing for smooth rides.", icon: Sparkles },
    { title: "Diagnostic Services", desc: "Computerized scanning and electronic system troubleshooting.", icon: Search },
  ];

  return (
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5" />
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6"
            >
              Core Expertise
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
              {title || "Precision Engineering"}
            </h2>
            <p className="text-lg text-white/60 font-medium mb-12 max-w-xl leading-relaxed">
              {subtitle || "Our core services are designed to address the most critical aspects of your vehicle's health with unmatched technical expertise."}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {coreServices.map((service, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all group"
                >
                  <div className="h-12 w-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                    <service.icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight mb-2">{service.title}</h3>
                  <p className="text-xs text-white/40 font-medium leading-relaxed">{service.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-10 bg-primary/20 blur-[120px] rounded-full" />
            <div className="relative bg-white/5 border border-white/10 p-12 rounded-[4rem] backdrop-blur-sm">
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="h-16 w-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black uppercase tracking-tight">Quality Assured</h4>
                    <p className="text-sm text-white/40 font-medium">Every service undergoes a 50-point quality check.</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="h-16 w-16 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
                    <Wrench className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black uppercase tracking-tight">OEM Standards</h4>
                    <p className="text-sm text-white/40 font-medium">We strictly adhere to manufacturer service protocols.</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="h-16 w-16 bg-amber-500/20 rounded-2xl flex items-center justify-center border border-amber-500/30">
                    <Clock className="h-8 w-8 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black uppercase tracking-tight">Express Delivery</h4>
                    <p className="text-sm text-white/40 font-medium">Optimized workflows for faster turnaround times.</p>
                  </div>
                </div>
              </div>
              
              <Link to="/book" className="block mt-12">
                <Button className="w-full h-20 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-lg shadow-2xl shadow-primary/20 border-none">
                  Book A Diagnostic
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
