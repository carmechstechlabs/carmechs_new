import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2, Users, Award, History, ArrowRight, ShieldCheck, Zap, Globe } from "lucide-react";
import { motion } from "motion/react";

export function About() {
  return (
    <div className="bg-[#fdfcfb] min-h-screen">
      {/* Hero */}
      <section className="bg-slate-900 pt-40 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-slate-900 to-transparent z-10" />
        
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm mb-6"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Our Identity</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-8"
            >
              Engineering <br /> Trust
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/60 font-medium max-w-2xl leading-relaxed"
            >
              We are on a mission to redefine automotive care through radical transparency, technical excellence, and a customer-first philosophy.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-primary/10 rounded-[4rem] -z-10 rotate-3" />
              <img 
                src="https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Our Workshop" 
                className="rounded-[3.5rem] shadow-2xl w-full h-[600px] object-cover"
              />
              <div className="absolute -bottom-10 -right-10 bg-slate-900 p-10 rounded-[3rem] shadow-2xl border border-white/5">
                <div className="text-5xl font-black text-primary mb-1">2020</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Established</div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter mb-8 leading-[0.9]">The Genesis</h2>
              <p className="text-xl text-slate-500 font-medium mb-8 leading-relaxed">
                CarMechs started with a simple observation: car service shouldn't be a black box. We saw owners struggling with opaque pricing, inconsistent quality, and a lack of accountability.
              </p>
              <p className="text-xl text-slate-500 font-medium mb-12 leading-relaxed">
                Today, we operate a network of technology-enabled workshops that prioritize data over guesswork. Every bolt tightened and every filter changed is logged, verified, and shared with you.
              </p>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="p-8 bg-white rounded-[2.5rem] shadow-xl shadow-black/5 border border-slate-100">
                  <div className="text-4xl font-black text-primary mb-2">50k+</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Engines Optimized</div>
                </div>
                <div className="p-8 bg-white rounded-[2.5rem] shadow-xl shadow-black/5 border border-slate-100">
                  <div className="text-4xl font-black text-primary mb-2">4.9/5</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trust Index</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values - Bento Grid */}
      <section className="py-32 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-widest mb-4"
            >
              The Core
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">Our Principles</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Radical Transparency", desc: "No hidden costs. No jargon. Just clear, data-driven insights into your vehicle's health.", icon: Globe },
              { title: "Technical Mastery", desc: "Our mechanics are engineers at heart, trained in the latest automotive technologies.", icon: Award },
              { title: "Customer Obsession", desc: "We don't just fix cars; we solve problems and build lasting relationships.", icon: Users }
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-12 bg-white/5 border border-white/5 rounded-[3.5rem] hover:bg-white/10 transition-all group"
              >
                <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center mb-10 shadow-2xl shadow-primary/20 group-hover:scale-110 transition-transform">
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-6">{value.title}</h3>
                <p className="text-white/40 text-lg font-medium leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team/Culture Section */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="bg-slate-50 rounded-[4rem] p-12 md:p-24 flex flex-col lg:flex-row items-center gap-16 border border-slate-100">
            <div className="flex-1">
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter mb-8 leading-[0.9]">Built by <br /> Enthusiasts</h2>
              <p className="text-xl text-slate-500 font-medium mb-10 leading-relaxed">
                We are a team of car lovers, technology geeks, and service professionals united by a single goal: to make car maintenance as seamless as ordering a coffee.
              </p>
              <div className="space-y-4">
                {[
                  "Certified Master Technicians",
                  "Proprietary Diagnostic Software",
                  "Ethical Sourcing of Parts",
                  "24/7 Support Ecosystem"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-slate-700">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Zap className="h-3 w-3 text-primary" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" className="rounded-[2rem] h-64 w-full object-cover" alt="" />
              <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" className="rounded-[2rem] h-64 w-full object-cover mt-12" alt="" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-primary relative overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-10">
              Experience the <br /> Difference
            </h2>
            <Link to="/book">
              <Button size="lg" className="h-20 px-16 rounded-[2.5rem] bg-white text-primary hover:bg-slate-100 font-black uppercase tracking-widest text-xl shadow-2xl shadow-black/20 transition-all hover:scale-105">
                Book Your Service <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
