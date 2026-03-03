import { Link } from "react-router-dom";
import { Wrench, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Shield, Zap, ArrowRight } from "lucide-react";
import { useData } from "@/context/DataContext";
import { motion } from "motion/react";

export function Footer() {
  const { settings } = useData();

  return (
    <footer className="bg-white text-slate-500 pt-24 pb-12 relative overflow-hidden border-t border-slate-100">
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          {/* Brand */}
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center shadow-xl shadow-primary/20 group-hover:scale-105 transition-transform">
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt={settings.logoText} className="h-7 w-7 object-contain" />
                ) : (
                  <Wrench className="h-6 w-6 text-white" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl uppercase tracking-tighter text-slate-900 leading-none">
                  {settings.logoText || "CarMechs"}
                </span>
                <span className="text-[8px] font-bold text-primary uppercase tracking-[0.3em] mt-1">Automotive Excellence</span>
              </div>
            </Link>
            
            <p className="text-sm leading-relaxed max-w-sm font-medium text-slate-500">
              {settings.footerDescription || "India's leading car service network. We provide high-quality car maintenance and repair services with genuine parts and expert mechanics."}
            </p>

            <div className="flex gap-3">
              {[
                { icon: Facebook, href: settings.facebook },
                { icon: Twitter, href: settings.twitter },
                { icon: Instagram, href: settings.instagram },
                { icon: Linkedin, href: settings.linkedin }
              ].filter(s => s.href).map((social, i) => (
                <motion.a 
                  key={i}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  whileHover={{ y: -4, scale: 1.1 }}
                  className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all border border-slate-100"
                >
                  <social.icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Quick Links</h3>
            <ul className="space-y-4 text-xs font-bold text-slate-600">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Services</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Popular Services</h3>
            <ul className="space-y-4 text-xs font-bold text-slate-600">
              <li><Link to="/services" className="hover:text-primary transition-colors">Periodic Maintenance</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">AC Service & Repair</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Batteries & Electrical</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Tyres & Wheel Care</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Get In Touch</h3>
            <ul className="space-y-6 text-xs font-bold">
              <li className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span className="text-slate-600 leading-relaxed">{settings.address}</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span className="text-slate-600">{settings.phone}</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span className="text-slate-600 lowercase">{settings.email}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            &copy; {new Date().getFullYear()} {settings.logoText} / All Rights Reserved.
          </p>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {settings.privacyPolicyUrl && <Link to={settings.privacyPolicyUrl} className="hover:text-primary transition-colors">Privacy Policy</Link>}
            {settings.termsOfServiceUrl && <Link to={settings.termsOfServiceUrl} className="hover:text-primary transition-colors">Terms of Use</Link>}
            <Link to="/admin" className="hover:text-primary transition-colors flex items-center gap-2">
              <Shield className="h-3 w-3" /> Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
