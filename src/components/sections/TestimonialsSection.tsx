import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { useData } from '@/context/DataContext';

export function TestimonialsSection() {
  const { testimonials } = useData();

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6"
            >
              Testimonials
            </motion.div>
            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
              What Our Clients Say
            </h2>
            <p className="text-xl text-white/60 font-medium leading-relaxed">
              Trusted by premium and luxury car owners across Kolkata and Howrah for precision engineering and radical transparency.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 p-10 rounded-[3rem] relative group hover:bg-white/10 transition-all duration-500"
            >
              <Quote className="absolute top-10 right-10 h-12 w-12 text-primary/20 group-hover:text-primary/40 transition-colors" />
              
              <div className="flex gap-1 mb-8">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={i < testimonial.rating ? "h-5 w-5 fill-amber-400 text-amber-400" : "h-5 w-5 text-white/20"} 
                  />
                ))}
              </div>

              <p className="text-lg text-white/80 font-medium leading-relaxed mb-10 italic">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-black text-xl overflow-hidden">
                  {testimonial.avatar ? (
                    <img src={testimonial.avatar} alt={testimonial.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    testimonial.name.charAt(0)
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-black uppercase tracking-tight">{testimonial.name}</h4>
                  <p className="text-xs text-white/40 font-bold uppercase tracking-widest">
                    {testimonial.carModel} • {testimonial.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
