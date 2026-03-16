import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2, Clock, IndianRupee, Info, ChevronRight, Car } from "lucide-react";
import { ReactNode } from "react";
import { useData } from "@/context/DataContext";

interface Service {
  id: string;
  icon: ReactNode;
  title: string;
  description: string;
  features: string[];
  price: string;
  duration: string;
  checks: string[];
  basePrice: number;
  estimatedPrice?: number;
  estimatedDuration?: string;
}

interface ServiceModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  calculatedPrice?: string;
  isVehicleSelected?: boolean;
  vehicleDetails?: {
    make: string;
    model: string;
    fuel: string;
  };
}

export function ServiceModal({ service, isOpen, onClose, calculatedPrice, isVehicleSelected, vehicleDetails }: ServiceModalProps) {
  const { carMakes, carModels, fuelTypes } = useData();
  if (!service) return null;

  const getBreakdown = () => {
    if (!isVehicleSelected || !vehicleDetails) return null;
    
    const breakdown = [];
    breakdown.push({ label: "Base Service Protocol", value: `₹${service.basePrice}` });

    const make = carMakes.find(m => m.name === vehicleDetails.make);
    if (make && make.price !== 0) {
      breakdown.push({ label: `${vehicleDetails.make} Calibration`, value: `+₹${make.price}` });
    }

    const model = carModels.find(m => m.name === vehicleDetails.model);
    if (model && model.price !== 0) {
      breakdown.push({ label: `${vehicleDetails.model} Specification`, value: `+₹${model.price}` });
    }

    const fuel = fuelTypes.find(f => f.name === vehicleDetails.fuel);
    if (fuel && fuel.price !== 0) {
      breakdown.push({ label: `${vehicleDetails.fuel} System Adjustment`, value: `+₹${fuel.price}` });
    }

    return breakdown;
  };

  const priceBreakdown = getBreakdown();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-none rounded-[3rem] bg-white shadow-2xl">
        <div className="relative h-48 bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="absolute inset-0 p-10 flex items-end justify-between">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-xl">
                <div className="brightness-0 invert scale-125">
                  {service.icon}
                </div>
              </div>
              <div>
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-2">{service.title}</h2>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Technical Module</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">ID: {service.id.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-10 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Module Specification</h3>
                <p className="text-slate-600 font-medium leading-relaxed">{service.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">
                    <Clock className="h-3 w-3" />
                    Est. Duration
                  </div>
                  <div className="text-lg font-black text-slate-900 uppercase tracking-tight">
                    {service.estimatedDuration || service.duration}
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">
                    <IndianRupee className="h-3 w-3" />
                    Base Quote
                  </div>
                  <div className="text-lg font-black text-primary uppercase tracking-tight">
                    {isVehicleSelected && calculatedPrice ? calculatedPrice : service.price}
                  </div>
                </div>
              </div>

              {isVehicleSelected && priceBreakdown && (
                <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                    <Info className="h-3 w-3" />
                    Dynamic Price Calibration
                  </h4>
                  <div className="space-y-3">
                    {priceBreakdown.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-[11px] font-bold text-slate-500">
                        <span>{item.label}</span>
                        <span className="text-slate-900">{item.value}</span>
                      </div>
                    ))}
                    <div className="pt-4 mt-4 border-t border-primary/20 flex justify-between text-base font-black text-primary uppercase tracking-tight">
                      <span>Total Quote</span>
                      <span>{calculatedPrice}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Core Features</h3>
                <div className="space-y-3">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                      <div className="h-6 w-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Quality Protocol</h3>
                <div className="space-y-3">
                  {isVehicleSelected && (
                    <div className="flex items-center gap-3 text-xs font-black text-primary uppercase tracking-widest bg-primary/5 p-3 rounded-xl border border-primary/10">
                      <Car className="h-4 w-4" />
                      {vehicleDetails?.make} {vehicleDetails?.model} Specifics
                    </div>
                  )}
                  <div className="grid grid-cols-1 gap-2">
                    {service.checks.map((check, index) => (
                      <div key={index} className="flex items-center gap-3 text-[11px] font-bold text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        <span>{check}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-10 border-t border-slate-100">
            <button onClick={onClose} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
              Dismiss Module
            </button>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs border-slate-200"
              >
                Close
              </Button>
              <Button 
                className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-white border-none"
                asChild
              >
                <Link to="/book" state={{ serviceId: service.id, vehicleDetails }} onClick={onClose}>
                  Initialize Booking <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
