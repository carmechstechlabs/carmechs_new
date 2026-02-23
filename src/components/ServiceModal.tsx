import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2, Clock, IndianRupee } from "lucide-react";
import { ReactNode } from "react";

interface Service {
  id: string;
  icon: ReactNode;
  title: string;
  description: string;
  features: string[];
  price: string;
  duration: string;
  checks: string[];
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
  if (!service) return null;

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

          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Included Checks & Services
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {service.checks.map((check, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-slate-600">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>{check}</span>
                </div>
              ))}
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
