import { useData } from "@/context/DataContext";
import { motion } from "motion/react";

export function BrandsCarousel() {
  const { brands } = useData();

  if (!brands || brands.length === 0) return null;

  // Duplicate brands for seamless infinite scroll
  const displayBrands = [...brands, ...brands, ...brands];

  return (
    <section className="py-24 bg-white overflow-hidden border-y border-slate-100">
      <div className="container mx-auto px-4 mb-12 text-center">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">Trusted by Owners of</h2>
        <p className="text-4xl font-black uppercase tracking-tighter text-slate-900">World-Class Automotive Engineering</p>
      </div>
      
      <div className="relative flex">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="flex items-center gap-16 whitespace-nowrap"
        >
          {displayBrands.map((brand, index) => (
            <div 
              key={`${brand.id}-${index}`}
              className="flex flex-col items-center justify-center gap-4 group grayscale hover:grayscale-0 transition-all duration-500"
            >
              <div className="h-24 w-24 relative flex items-center justify-center p-4 bg-slate-50 rounded-3xl border border-slate-100 group-hover:border-primary/20 group-hover:bg-primary/5 transition-colors">
                <img 
                  src={brand.imageUrl} 
                  alt={brand.name} 
                  className="max-h-full max-w-full object-contain opacity-40 group-hover:opacity-100 transition-opacity"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">
                {brand.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
