import React from 'react';
import { motion } from 'motion/react';
import { Camera } from 'lucide-react';

export interface GalleryImage {
  url?: string;
  image?: string;
  title: string;
  category: string;
}

interface GallerySectionProps {
  title?: string;
  subtitle?: string;
  items?: GalleryImage[];
}

export function GallerySection({ title, subtitle, items }: GallerySectionProps) {
  const defaultImages: GalleryImage[] = [
    { url: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=800&auto=format&fit=crop", title: "Modern Workshop", category: "Facilities" },
    { url: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Engine Diagnostics", category: "Equipment" },
    { url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop", title: "Premium Detailing", category: "Luxury Cars" },
    { url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop", title: "Precision Tuning", category: "Equipment" },
    { url: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800&auto=format&fit=crop", title: "BMW Service", category: "Luxury Cars" },
    { url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop", title: "Customer Lounge", category: "Facilities" },
  ];

  const images = items && items.length > 0 ? items : defaultImages;

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest mb-4"
          >
            Visual Showcase
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-6">
            {title || "Our Gallery"}
          </h2>
          <p className="text-slate-500 font-medium">{subtitle || "Take a look at our state-of-the-art facilities and the premium vehicles we care for."}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((img: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative h-[400px] rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <img 
                src={img.url || img.image} 
                alt={img.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">{img.category}</span>
                <h4 className="text-2xl font-black text-white uppercase tracking-tight">{img.title}</h4>
              </div>
              <div className="absolute top-6 right-6 h-12 w-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <Camera className="h-5 w-5 text-white" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
