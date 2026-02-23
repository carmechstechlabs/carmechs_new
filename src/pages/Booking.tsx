import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { Check, ChevronRight, ChevronLeft, Calendar as CalendarIcon, Car, Wrench, Info, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useData } from "@/context/DataContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

const steps = [
  { id: 1, title: "Select Car", icon: Car },
  { id: 2, title: "Choose Service", icon: Wrench },
  { id: 3, title: "Schedule", icon: CalendarIcon },
];

export function Booking() {
  const { services, carMakes, carModels, fuelTypes, addAppointment } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    fuel: "",
    service: "",
    date: "",
    time: "",
    name: "",
    phone: "",
    email: ""
  });

  useEffect(() => {
    if (location.state?.serviceId) {
      setFormData(prev => ({ ...prev, service: location.state.serviceId }));
    }
    if (location.state?.vehicleDetails) {
      setFormData(prev => ({
        ...prev,
        make: location.state.vehicleDetails.make,
        model: location.state.vehicleDetails.model,
        fuel: location.state.vehicleDetails.fuel
      }));
    }
  }, [location.state]);

  const calculatePrice = (basePrice: number) => {
    let multiplier = 1;
    const { make, model, fuel } = formData;

    const selectedMake = carMakes.find(m => m.name === make);
    if (selectedMake) multiplier *= selectedMake.multiplier;

    const selectedModel = carModels.find(m => m.name === model);
    if (selectedModel) multiplier *= selectedModel.multiplier;

    const selectedFuel = fuelTypes.find(f => f.name === fuel);
    if (selectedFuel) multiplier *= selectedFuel.multiplier;

    return Math.round(basePrice * multiplier);
  };

  const getPriceBreakdown = (basePrice: number) => {
    const { make, model, fuel } = formData;
    const breakdown = [];
    let currentPrice = basePrice;
    
    breakdown.push({ label: "Base Price", value: `₹${basePrice}` });

    const selectedMake = carMakes.find(m => m.name === make);
    if (selectedMake && selectedMake.multiplier !== 1) {
      breakdown.push({ label: `${make} Surcharge`, value: `x${selectedMake.multiplier}` });
    }

    const selectedModel = carModels.find(m => m.name === model);
    if (selectedModel && selectedModel.multiplier !== 1) {
      breakdown.push({ label: `${model} Surcharge`, value: `x${selectedModel.multiplier}` });
    }

    const selectedFuel = fuelTypes.find(f => f.name === fuel);
    if (selectedFuel && selectedFuel.multiplier !== 1) {
      breakdown.push({ label: `${fuel} Surcharge`, value: `x${selectedFuel.multiplier}` });
    }

    return breakdown;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone) {
      toast.error("Please enter your name and phone number");
      return;
    }

    setIsSubmitting(true);
    
    try {
      addAppointment(formData);
      
      if (formData.email) {
        const serviceTitle = services.find(s => s.id === formData.service)?.title || "Car Service";
        
        const response = await fetch('/api/send-confirmation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            serviceTitle
          }),
        });
        
        const data = await response.json();
        
        if (data.previewUrl) {
          console.log("Email preview URL:", data.previewUrl);
          toast.success("Booking Confirmed! Confirmation email sent.", {
            description: `Your appointment is scheduled for ${formData.date} at ${formData.time}.`
          });
        } else {
          toast.success("Booking Confirmed! Thank you.", {
            description: `Your appointment is scheduled for ${formData.date} at ${formData.time}.`
          });
        }
      } else {
        toast.success("Booking Confirmed! Thank you.", {
          description: `Your appointment is scheduled for ${formData.date} at ${formData.time}.`
        });
      }

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast.error("There was an error processing your booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = () => {
    if (currentStep === 1) return formData.make && formData.model && formData.fuel;
    if (currentStep === 2) return formData.service;
    if (currentStep === 3) return formData.date && formData.time && formData.name && formData.phone;
    return false;
  };

  const filteredMakes = carMakes.filter(make => 
    make.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Book a Service</h1>
          <p className="text-slate-600">Complete the steps below to schedule your car service.</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 -translate-y-1/2 rounded-full"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
          
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center bg-slate-50 px-2">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 mb-2",
                  currentStep >= step.id 
                    ? "bg-primary border-primary text-white" 
                    : "bg-white border-slate-300 text-slate-400"
                )}
              >
                {currentStep > step.id ? <Check className="w-6 h-6" /> : <step.icon className="w-5 h-5" />}
              </div>
              <span className={cn(
                "text-sm font-medium transition-colors duration-300",
                currentStep >= step.id ? "text-slate-900" : "text-slate-400"
              )}>
                {step.title}
              </span>
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 min-h-[400px]">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold mb-6">Vehicle Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Make</label>
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input 
                        placeholder="Search car make..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-1">
                      {filteredMakes.map((make) => (
                        <button
                          key={make.name}
                          onClick={() => setFormData({ ...formData, make: make.name })}
                          className={cn(
                            "p-3 rounded-lg border text-sm font-medium transition-all hover:border-primary",
                            formData.make === make.name 
                              ? "border-primary bg-primary/5 text-primary ring-1 ring-primary" 
                              : "border-slate-200 text-slate-600"
                          )}
                        >
                          {make.name}
                        </button>
                      ))}
                      {filteredMakes.length === 0 && (
                        <div className="col-span-full text-center py-4 text-slate-500 text-sm">
                          No car makes found matching "{searchTerm}"
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Select Model</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {carModels.filter(m => m.make === formData.make).map((model) => (
                        <button
                          key={model.name}
                          onClick={() => setFormData({ ...formData, model: model.name })}
                          className={cn(
                            "p-3 rounded-lg border text-sm font-medium transition-all hover:border-primary",
                            formData.model === model.name 
                              ? "border-primary bg-primary/5 text-primary ring-1 ring-primary" 
                              : "border-slate-200 text-slate-600"
                          )}
                        >
                          {model.name}
                        </button>
                      ))}
                      {formData.make && carModels.filter(m => m.make === formData.make).length === 0 && (
                        <div className="col-span-full text-center py-4 text-slate-500 text-sm">
                          No models found for {formData.make}
                        </div>
                      )}
                      {!formData.make && (
                        <div className="col-span-full text-center py-4 text-slate-500 text-sm">
                          Please select a make first
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Fuel Type</label>
                    <div className="flex gap-3 flex-wrap">
                      {fuelTypes.map((fuel) => (
                        <button
                          key={fuel.name}
                          onClick={() => setFormData({ ...formData, fuel: fuel.name })}
                          className={cn(
                            "px-4 py-2 rounded-full border text-sm font-medium transition-all hover:border-primary",
                            formData.fuel === fuel.name 
                              ? "border-primary bg-primary/5 text-primary ring-1 ring-primary" 
                              : "border-slate-200 text-slate-600"
                          )}
                        >
                          {fuel.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-xl font-semibold mb-6">Select Service</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setFormData({ ...formData, service: service.id })}
                      className={cn(
                        "p-4 rounded-xl border text-left transition-all hover:border-primary flex justify-between items-center group",
                        formData.service === service.id 
                          ? "border-primary bg-primary/5 ring-1 ring-primary" 
                          : "border-slate-200"
                      )}
                    >
                      <div>
                        <h3 className={cn(
                          "font-semibold mb-1 group-hover:text-primary transition-colors",
                          formData.service === service.id ? "text-primary" : "text-slate-900"
                        )}>
                          {service.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 text-sm">₹{calculatePrice(service.basePrice)}</span>
                          <Popover>
                            <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-5 w-5 text-slate-400 hover:text-primary">
                                <Info className="h-3 w-3" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-60">
                              <div className="space-y-2">
                                <h4 className="font-medium text-sm border-b pb-1 mb-2">Price Breakdown</h4>
                                {getPriceBreakdown(service.basePrice).map((item, idx) => (
                                  <div key={idx} className="flex justify-between text-xs">
                                    <span className="text-slate-600">{item.label}</span>
                                    <span className="font-medium">{item.value}</span>
                                  </div>
                                ))}
                                <div className="flex justify-between text-sm font-bold border-t pt-2 mt-2">
                                  <span>Total</span>
                                  <span>₹{calculatePrice(service.basePrice)}</span>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      {formData.service === service.id && (
                        <CheckCircle2 className="text-primary h-5 w-5" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-xl font-semibold mb-6">Schedule Appointment</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name *</label>
                      <Input 
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone *</label>
                      <Input 
                        placeholder="Your phone number"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email (Optional)</label>
                      <Input 
                        placeholder="Your email address"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Select Date *</label>
                      <input 
                        type="date" 
                        className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        value={formData.date}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Select Time Slot *</label>
                      <div className="grid grid-cols-2 gap-2">
                        {["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"].map((time) => (
                          <button
                            key={time}
                            onClick={() => setFormData({ ...formData, time })}
                            className={cn(
                              "p-2 rounded-lg border text-sm font-medium transition-all hover:border-primary",
                              formData.time === time 
                                ? "border-primary bg-primary/5 text-primary ring-1 ring-primary" 
                                : "border-slate-200 text-slate-600"
                            )}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-slate-50 p-6 rounded-xl border border-slate-100">
                  <h3 className="font-semibold mb-4">Booking Summary</h3>
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex justify-between">
                      <span>Car:</span>
                      <span className="font-medium text-slate-900">{formData.make} {formData.model} ({formData.fuel})</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service:</span>
                      <span className="font-medium text-slate-900">
                        {services.find(s => s.id === formData.service)?.title}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-200 mt-2">
                      <span>Estimated Total:</span>
                      <span className="font-bold text-primary text-lg">
                        ₹{(() => {
                          const service = services.find(s => s.id === formData.service);
                          return service ? calculatePrice(service.basePrice) : 0;
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="w-32"
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Back
          </Button>

          {currentStep < 3 ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="w-32"
            >
              Next <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!isStepValid() || isSubmitting}
              className="w-40 bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? "Confirming..." : "Confirm Booking"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper component for the check icon in step 2
function CheckCircle2({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
