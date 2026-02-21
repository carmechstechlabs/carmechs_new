import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Wrench, 
  Car, 
  Battery, 
  Disc, 
  PaintBucket, 
  ShieldCheck, 
  CheckCircle2 
} from "lucide-react";

const services = [
  {
    icon: <Wrench className="h-10 w-10 text-primary" />,
    title: "Periodic Services",
    description: "Comprehensive car service packages for complete peace of mind.",
    features: ["Oil Change", "Filter Replacement", "Brake Check", "Fluid Top-up"],
    price: "₹1999",
  },
  {
    icon: <Disc className="h-10 w-10 text-primary" />,
    title: "Tyres & Wheels",
    description: "Expert tyre services including alignment and balancing.",
    features: ["Wheel Alignment", "Wheel Balancing", "Tyre Rotation", "Puncture Repair"],
    price: "₹999",
  },
  {
    icon: <Battery className="h-10 w-10 text-primary" />,
    title: "Batteries",
    description: "Battery health check and replacement services.",
    features: ["Battery Testing", "Charging System Check", "Terminal Cleaning", "Replacement"],
    price: "₹3499",
  },
  {
    icon: <PaintBucket className="h-10 w-10 text-primary" />,
    title: "Denting & Painting",
    description: "Restore your car's look with our premium painting services.",
    features: ["Scratch Removal", "Dent Repair", "Full Body Paint", "Polishing"],
    price: "Custom",
  },
  {
    icon: <Car className="h-10 w-10 text-primary" />,
    title: "AC Service",
    description: "Keep your car cool with our AC maintenance packages.",
    features: ["Gas Refill", "Cooling Coil Cleaning", "Compressor Check", "Leak Test"],
    price: "₹1499",
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    title: "Car Spa & Cleaning",
    description: "Deep cleaning services for interior and exterior.",
    features: ["Interior Detailing", "Exterior Wash", "Waxing", "Upholstery Cleaning"],
    price: "₹1199",
  },
];

export function Services() {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-slate-900">Our Services</h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            We offer a wide range of car services to keep your vehicle running smoothly. 
            Choose the service that best fits your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-slate-100 flex flex-col">
              <div className="p-8 flex-1">
                <div className="mb-6 bg-primary/5 w-20 h-20 rounded-2xl flex items-center justify-center">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                <p className="text-slate-600 mb-6">{service.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-slate-50 p-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-sm text-slate-500 block">Starting from</span>
                  <span className="text-2xl font-bold text-primary">{service.price}</span>
                </div>
                <Link to="/book">
                  <Button>Book Now</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
