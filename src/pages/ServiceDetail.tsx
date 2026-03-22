import { useParams, useNavigate } from "react-router-dom";
import { useData } from "@/context/DataContext";
import { motion } from "motion/react";
import { 
  ArrowLeft, Clock, ShieldCheck, CheckCircle2, 
  ArrowRight, IndianRupee, Wrench, Zap, Sparkles, 
  Shield, Disc, PaintBucket, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ServiceDetail() {
  const { id } = useParams();
  const { services, categories } = useData();
  const navigate = useNavigate();
  const [service, setService] = useState<any>(null);

  useEffect(() => {
    if (id) {
      const found = services.find(s => s.id === id);
      if (found) {
        setService(found);
      }
    }
  }, [id, services]);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="h-20 w-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto">
            <Wrench className="h-10 w-10 text-primary animate-spin" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Service Not Found</h2>
          <Button onClick={() => navigate("/")} variant="outline" className="rounded-xl">
            Return to Base
          </Button>
        </div>
      </div>
    );
  }

  const category = categories.find(c => c.id === service.categoryId);
  const relatedServices = services
    .filter(s => s.categoryId === service.categoryId && s.id !== service.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Hero Header */}
      <div className="bg-white pt-40 pb-24 relative overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-20">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/services")}
            className="mb-12 text-slate-400 hover:text-primary font-bold uppercase tracking-widest text-[10px] group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Services
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
                  <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                    {category?.name || "Premium Service"}
                  </span>
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-slate-900 uppercase tracking-tighter leading-[0.85]">
                  {service.title.split(' ').map((word: string, i: number) => (
                    <span key={i} className={i === 1 ? "text-primary" : ""}>{word} </span>
                  ))}
                </h1>
                <p className="text-xl text-slate-500 font-medium max-w-xl leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-8">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estimated Time</p>
                    <p className="text-lg font-black text-slate-900 uppercase tracking-tight">{service.duration || "2-4 Hours"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                    <IndianRupee className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Starting From</p>
                    <p className="text-lg font-black text-slate-900 uppercase tracking-tight">₹{(service.basePrice || service.price).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <Button 
                  size="lg"
                  onClick={() => navigate(`/book?serviceId=${service.id}`)}
                  className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest shadow-2xl shadow-primary/20 group"
                >
                  Initiate Booking <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="aspect-square rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white">
                <img 
                  src={service.imageUrl || `https://picsum.photos/seed/${service.id}/800/800`} 
                  alt={service.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-xs hidden md:block">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-emerald-600" />
                  </div>
                  <p className="font-black uppercase tracking-tight text-slate-900">Certified Quality</p>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Every {service.title} session is executed by master technicians using OEM-grade diagnostic tools.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-4 lg:px-8 mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-16">
            <section className="space-y-8">
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Service Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(service.features || [
                  "Comprehensive multi-point inspection",
                  "OEM-grade diagnostic scanning",
                  "Precision fluid level calibration",
                  "Detailed technical health report",
                  "Complimentary exterior wash",
                  "6-month service warranty"
                ]).map((feature: string, i: number) => (
                  <div key={i} className="flex items-start gap-4 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-primary/20 transition-all">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                    <p className="font-bold text-slate-700 leading-relaxed">{feature}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-8">
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Technical Checks</h2>
              <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                  {(service.checks || [
                    "Engine Oil & Filter Replacement",
                    "Air & Cabin Filter Inspection",
                    "Brake Pad & Rotor Thickness Check",
                    "Battery Health & Voltage Analysis",
                    "Coolant & Brake Fluid Top-up",
                    "Suspension & Steering Linkage Check"
                  ]).map((check: string, i: number) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-sm font-bold uppercase tracking-widest text-white/80">{check}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {relatedServices.length > 0 && (
              <section className="space-y-8">
                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Related Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedServices.map((rs: any) => (
                    <div 
                      key={rs.id}
                      onClick={() => {
                        navigate(`/services/${rs.id}`);
                        window.scrollTo(0, 0);
                      }}
                      className="group cursor-pointer bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-primary/20 transition-all shadow-sm"
                    >
                      <div className="aspect-video rounded-2xl overflow-hidden mb-4">
                        <img 
                          src={rs.imageUrl || `https://picsum.photos/seed/${rs.id}/400/300`} 
                          alt={rs.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 group-hover:text-primary transition-colors mb-2">{rs.title}</h4>
                      <p className="text-[10px] font-black text-primary">₹{rs.price}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-8 sticky top-32">
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Base Price</span>
                  <span className="text-lg font-black text-slate-900">₹{(service.basePrice || service.price).toLocaleString()}</span>
                </div>
                <div className="space-y-2 pb-6 border-b border-slate-100">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <span>Labor Charges</span>
                    <span>Included</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <span>Consumables</span>
                    <span>Included</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <span>Taxes (GST)</span>
                    <span>Extra</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => navigate(`/book?serviceId=${service.id}`)}
                  className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20 group"
                >
                  Book This Service <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest">Instant Confirmation Available</p>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">Need Assistance?</h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-8">
                  Not sure if this is the right service for your vehicle? Speak with our technical advisors.
                </p>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-200 font-black uppercase tracking-widest text-xs">
                    Request Callback
                  </Button>
                  <Button className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-xs">
                    Chat with Expert
                  </Button>
                </div>
              </div>
              
              <div className="pt-8 border-t border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-white overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span className="text-slate-900 font-black">500+</span> Booked this month
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
