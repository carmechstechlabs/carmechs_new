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
    breakdown.push({ label: "Base Price", value: `₹${service.basePrice}` });

    const make = carMakes.find(m => m.name === vehicleDetails.make);
    if (make && make.price !== 0) {
      breakdown.push({ label: `${vehicleDetails.make} Adjustment`, value: `+₹${make.price}` });
    }

    const model = carModels.find(m => m.name === vehicleDetails.model);
    if (model && model.price !== 0) {
      breakdown.push({ label: `${vehicleDetails.model} Adjustment`, value: `+₹${model.price}` });
    }

    const fuel = fuelTypes.find(f => f.name === vehicleDetails.fuel);
    if (fuel && fuel.price !== 0) {
      breakdown.push({ label: `${vehicleDetails.fuel} Adjustment`, value: `+₹${fuel.price}` });
    }

    return breakdown;
  };

  const priceBreakdown = getBreakdown();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary/10 p-3 rounded-xl">
              {service.icon}
            </div>
            <div>
              <DialogTitle className="text-2xl">{service.title}</DialogTitle>
              <DialogDescription className="text-base mt-1">
                {service.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-slate-500" />
              <span className="font-medium text-slate-700">Estimated Duration:</span>
              <span className="text-slate-900">{service.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-slate-500" />
              <span className="font-medium text-slate-700">{isVehicleSelected ? "Your Price:" : "Starting from:"}</span>
              <span className="text-lg font-bold text-primary">{isVehicleSelected && calculatedPrice ? calculatedPrice : service.price}</span>
            </div>
          </div>

          {isVehicleSelected && priceBreakdown && (
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-primary">
                <Info className="h-4 w-4" />
                Price Breakdown
              </h4>
              <div className="space-y-2">
                {priceBreakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs text-slate-600">
                    <span>{item.label}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
                <div className="pt-2 mt-2 border-t border-primary/20 flex justify-between text-sm font-bold text-primary">
                  <span>Total Amount</span>
                  <span>{calculatedPrice}</span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2 text-slate-900">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Key Features
              </h4>
              <div className="space-y-3">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm text-slate-600">
                    <div className="h-5 w-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2 text-slate-900">
                <Info className="h-5 w-5 text-primary" />
                Included Checks
              </h4>
              <div className="space-y-3">
                {isVehicleSelected && (
                  <div className="flex items-start gap-3 text-sm text-primary font-bold bg-primary/5 p-2 rounded-lg border border-primary/10">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Car className="h-3 w-3 text-primary" />
                    </div>
                    <span>{vehicleDetails?.make} {vehicleDetails?.model} Specific Inspection</span>
                  </div>
                )}
                {service.checks.map((check, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm text-slate-600">
                    <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                    </div>
                    <span>{check}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Link to="/book" state={{ serviceId: service.id, vehicleDetails }} onClick={onClose}>
            <Button className="px-8">Book Now</Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
