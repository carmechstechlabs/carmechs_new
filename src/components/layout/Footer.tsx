import { Link } from "react-router-dom";
import { Wrench, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { useData } from "@/context/DataContext";

export function Footer() {
  const { settings } = useData();

  return (
    <footer className="bg-[#0A0A0A] text-slate-400 pt-32 pb-12 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          {/* Brand */}
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform">
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt={settings.logoText} className="h-7 w-7 object-contain brightness-0 invert" />
                ) : (
                  <Wrench className="h-6 w-6 text-white" />
                )}
              </div>
              <span className="font-black text-2xl uppercase tracking-tighter text-white">{settings.logoText}</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm font-medium">
              {settings.footerDescription || "Redefining automotive care through technical excellence and radical transparency. Your vehicle's lifecycle, managed with precision."}
            </p>
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: settings.facebook },
                { icon: Twitter, href: settings.twitter },
                { icon: Instagram, href: settings.instagram },
                { icon: Linkedin, href: settings.linkedin }
              ].filter(s => s.href).map((social, i) => (
                <a 
                  key={i}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all border border-white/5"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-8">Platform</h3>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Services</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-8">Service Modules</h3>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
              <li><Link to="/services" className="hover:text-primary transition-colors">Periodic Maintenance</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">AC Service & Repair</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Batteries & Electrical</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Tyres & Wheel Care</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Denting & Painting</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-8">Terminal</h3>
            <ul className="space-y-6 text-xs font-bold">
              <li className="flex items-start gap-4 group">
                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-primary/50 transition-colors">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <span className="leading-relaxed">{settings.address}</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-primary/50 transition-colors">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <span>{settings.phone}</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-primary/50 transition-colors">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <span className="lowercase">{settings.email}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/20">
            &copy; {new Date().getFullYear()} {settings.logoText} / Automotive Systems / All Rights Reserved.
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-white/20">
            {settings.privacyPolicyUrl && <Link to={settings.privacyPolicyUrl} className="hover:text-white transition-colors">Privacy</Link>}
            {settings.termsOfServiceUrl && <Link to={settings.termsOfServiceUrl} className="hover:text-white transition-colors">Terms</Link>}
            <Link to="/admin/login" className="hover:text-white transition-colors">Admin Terminal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
