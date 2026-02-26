import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Wrench, 
  Car, 
  Battery, 
  Disc, 
  PaintBucket, 
  ShieldCheck, 
  CheckCircle2,
  Info
} from "lucide-react";
import { useState } from "react";
import { ServiceModal } from "@/components/ServiceModal";
import { useData } from "@/context/DataContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const getIcon = (service: any) => {
  if (service.iconUrl) {
    return <img src={service.iconUrl} alt={service.title} className="h-10 w-10 object-contain" />;
  }
  switch (service.id) {
    case "periodic": return <Wrench className="h-10 w-10 text-primary" />;
    case "tyres": return <Disc className="h-10 w-10 text-primary" />;
    case "batteries": return <Battery className="h-10 w-10 text-primary" />;
    case "denting": return <PaintBucket className="h-10 w-10 text-primary" />;
    case "ac": return <Car className="h-10 w-10 text-primary" />;
    case "spa": return <ShieldCheck className="h-10 w-10 text-primary" />;
    default: return <Wrench className="h-10 w-10 text-primary" />;
  }
};

export function Services() {
  const { services, carMakes, carModels, fuelTypes } = useData();
  const [selectedService, setSelectedService] = useState<any>(null);
  
  // Vehicle Selection State
  const [selectedMake, setSelectedMake] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedFuel, setSelectedFuel] = useState<string>("");

  const calculatePrice = (basePrice: number) => {
    let multiplier = 1;

    const make = carMakes.find(m => m.name === selectedMake);
    if (make) multiplier *= make.multiplier;

    const model = carModels.find(m => m.name === selectedModel);
    if (model) multiplier *= model.multiplier;

    const fuel = fuelTypes.find(f => f.name === selectedFuel);
    if (fuel) multiplier *= fuel.multiplier;

    return Math.round(basePrice * multiplier);
  };

  const isVehicleSelected = selectedMake && selectedModel && selectedFuel;

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-slate-900">Our Services</h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg mb-8">
            We offer a wide range of car services to keep your vehicle running smoothly. 
            Choose the service that best fits your needs.
          </p>

          {/* Vehicle Selector */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 max-w-4xl mx-auto">
            <h2 className="text-lg font-semibold mb-4 text-left">Check Price for Your Car</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={selectedMake} onValueChange={setSelectedMake}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Make" />
                </SelectTrigger>
                <SelectContent>
                  {carMakes.map((make) => (
                    <SelectItem key={make.name} value={make.name}>{make.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedModel} onValueChange={setSelectedModel} disabled={!selectedMake}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Model" />
                </SelectTrigger>
                <SelectContent>
                  {carModels.filter(m => m.make === selectedMake).map((model) => (
                    <SelectItem key={model.name} value={model.name}>{model.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedFuel} onValueChange={setSelectedFuel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Fuel" />
                </SelectTrigger>
                <SelectContent>
                  {fuelTypes.map((fuel) => (
                    <SelectItem key={fuel.name} value={fuel.name}>{fuel.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {isVehicleSelected && (
              <div className="mt-4 text-sm text-green-600 font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Prices updated for {selectedMake} {selectedModel} ({selectedFuel})
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden border border-slate-100 flex flex-col group"
              onClick={() => setSelectedService({ ...service, icon: getIcon(service) })}
            >
              <div className="p-8 flex-1">
                <div className="mb-6 bg-primary/5 w-20 h-20 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors overflow-hidden">
                  {getIcon(service)}
                </div>
                <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                <p className="text-slate-600 mb-6">{service.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {service.features.slice(0, 4).map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-slate-50 p-6 border-t border-slate-100 flex items-center justify-between group-hover:bg-slate-100 transition-colors">
                <div>
                  <span className="text-sm text-slate-500 block">
                    {isVehicleSelected ? "Your Price" : "Starting from"}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary">
                      {isVehicleSelected 
                        ? `₹${calculatePrice(service.basePrice)}` 
                        : service.price}
                    </span>
                    {isVehicleSelected && (
                      <Popover>
                        <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Info className="h-4 w-4 text-slate-400 cursor-help hover:text-primary" />
                        </PopoverTrigger>
                        <PopoverContent className="w-60 text-xs">
                          <p>Base Price: ₹{service.basePrice}</p>
                          <p>Make Multiplier: x{carMakes.find(m => m.name === selectedMake)?.multiplier || 1}</p>
                          <p>Model Multiplier: x{carModels.find(m => m.name === selectedModel)?.multiplier || 1}</p>
                          <p>Fuel Multiplier: x{fuelTypes.find(f => f.name === selectedFuel)?.multiplier || 1}</p>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </div>
                <Button onClick={(e) => {
                  e.stopPropagation();
                  // Navigate to book
                }} asChild>
                  <Link 
                    to="/book" 
                    state={{ 
                      serviceId: service.id,
                      vehicleDetails: isVehicleSelected ? {
                        make: selectedMake,
                        model: selectedModel,
                        fuel: selectedFuel
                      } : undefined
                    }}
                  >
                    Book Now
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ServiceModal 
        service={selectedService} 
        isOpen={!!selectedService} 
        onClose={() => setSelectedService(null)}
        calculatedPrice={selectedService && isVehicleSelected ? `₹${calculatePrice(selectedService.basePrice)}` : undefined}
        isVehicleSelected={!!isVehicleSelected}
        vehicleDetails={isVehicleSelected ? {
          make: selectedMake,
          model: selectedModel,
          fuel: selectedFuel
        } : undefined}
      />
    </div>
  );
}
