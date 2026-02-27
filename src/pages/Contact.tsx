import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export function Contact() {
  return (
    <div className="bg-[#fdfcfb] min-h-screen">
      {/* Hero Header */}
      <div className="bg-slate-900 pt-40 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute top-0 left-0 w-1/2 h-full bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/2" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm mb-6"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Support Terminal</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-8"
            >
              Direct <br /> Connection
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/60 font-medium max-w-2xl leading-relaxed"
            >
              Have a technical query or need immediate assistance? Our support engineers are standing by to help you navigate your vehicle's needs.
            </motion.p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
          {/* Contact Info - Bento Style */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-black/5 border border-slate-100"
            >
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-10">Terminal Access</h2>
              
              <div className="space-y-10">
                <div className="flex items-start gap-6 group">
                  <div className="bg-slate-900 h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors shadow-xl">
                    <MapPin className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Base Operations</h3>
                    <p className="text-lg font-bold text-slate-900 leading-tight">Newtown, Kolkata 700156</p>
                    <p className="text-sm text-slate-500 font-medium mt-1">West Bengal, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="bg-slate-900 h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors shadow-xl">
                    <Phone className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Voice Uplink</h3>
                    <p className="text-lg font-bold text-slate-900">+91-70034-35356</p>
                    <p className="text-sm text-slate-500 font-medium mt-1">Mon-Sat 09:00 - 19:00</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="bg-slate-900 h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors shadow-xl">
                    <Mail className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Data Transmission</h3>
                    <p className="text-lg font-bold text-slate-900 lowercase">assist@carmechs.in</p>
                    <p className="text-sm text-slate-500 font-medium mt-1">Average response: 2 hours</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-primary p-10 rounded-[3rem] text-white shadow-2xl shadow-primary/20"
            >
              <MessageSquare className="h-10 w-10 mb-6" />
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Live Chat</h3>
              <p className="text-white/80 font-medium mb-8 leading-relaxed">Need a quick diagnostic? Our technical advisors are available for real-time consultation.</p>
              <Button className="w-full h-14 bg-white text-primary hover:bg-slate-100 rounded-2xl font-black uppercase tracking-widest text-xs">
                Start Session
              </Button>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-7 bg-white p-10 md:p-16 rounded-[3.5rem] shadow-2xl shadow-black/5 border border-slate-100"
          >
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-12">Submit Inquiry</h2>
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">First Name</label>
                  <input 
                    type="text" 
                    className="w-full h-16 px-6 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Last Name</label>
                  <input 
                    type="text" 
                    className="w-full h-16 px-6 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email Address</label>
                <input 
                  type="email" 
                  className="w-full h-16 px-6 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Subject</label>
                <input 
                  type="text" 
                  className="w-full h-16 px-6 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                  placeholder="Service Inquiry"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Message</label>
                <textarea 
                  rows={5}
                  className="w-full p-6 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold resize-none"
                  placeholder="Describe your vehicle's symptoms or your specific inquiry..."
                ></textarea>
              </div>

              <Button size="lg" className="w-full h-20 rounded-[2rem] font-black uppercase tracking-widest text-lg shadow-2xl shadow-primary/20 group">
                Send Transmission <Send className="ml-3 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
