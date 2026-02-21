import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { Check, ChevronRight, ChevronLeft, Calendar as CalendarIcon, Car, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, title: "Select Car", icon: Car },
  { id: 2, title: "Choose Service", icon: Wrench },
  { id: 3, title: "Schedule", icon: CalendarIcon },
];

const carMakes = ["Toyota", "Honda", "Ford", "BMW", "Mercedes", "Audi", "Hyundai", "Kia"];
const carModels = ["Sedan", "SUV", "Hatchback", "Convertible", "Coupe"];
const fuelTypes = ["Petrol", "Diesel", "CNG", "Electric"];

const servicesList = [
  { id: "periodic", title: "Periodic Service", price: 1999 },
  { id: "ac", title: "AC Service", price: 1499 },
  { id: "batteries", title: "Battery Replacement", price: 3499 },
  { id: "tyres", title: "Tyre Replacement", price: 999 },
  { id: "denting", title: "Denting & Painting", price: 4999 },
  { id: "spa", title: "Car Spa", price: 1199 },
];

export function Booking() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    fuel: "",
    service: "",
    date: "",
    time: "",
  });

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = () => {
    if (currentStep === 1) return formData.make && formData.model && formData.fuel;
    if (currentStep === 2) return formData.service;
    if (currentStep === 3) return formData.date && formData.time;
    return false;
  };

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
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {carMakes.map((make) => (
                        <button
                          key={make}
                          onClick={() => setFormData({ ...formData, make })}
                          className={cn(
                            "p-3 rounded-lg border text-sm font-medium transition-all hover:border-primary",
                            formData.make === make 
                              ? "border-primary bg-primary/5 text-primary ring-1 ring-primary" 
                              : "border-slate-200 text-slate-600"
                          )}
                        >
                          {make}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Select Model</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {carModels.map((model) => (
                        <button
                          key={model}
                          onClick={() => setFormData({ ...formData, model })}
                          className={cn(
                            "p-3 rounded-lg border text-sm font-medium transition-all hover:border-primary",
                            formData.model === model 
                              ? "border-primary bg-primary/5 text-primary ring-1 ring-primary" 
                              : "border-slate-200 text-slate-600"
                          )}
                        >
                          {model}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Fuel Type</label>
                    <div className="flex gap-3 flex-wrap">
                      {fuelTypes.map((fuel) => (
                        <button
                          key={fuel}
                          onClick={() => setFormData({ ...formData, fuel })}
                          className={cn(
                            "px-4 py-2 rounded-full border text-sm font-medium transition-all hover:border-primary",
                            formData.fuel === fuel 
                              ? "border-primary bg-primary/5 text-primary ring-1 ring-primary" 
                              : "border-slate-200 text-slate-600"
                          )}
                        >
                          {fuel}
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
                  {servicesList.map((service) => (
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
                        <span className="text-slate-500 text-sm">Starting from ₹{service.price}</span>
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
                  <div>
                    <label className="block text-sm font-medium mb-3">Select Date</label>
                    <input 
                      type="date" 
                      className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      value={formData.date}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-3">Select Time Slot</label>
                    <div className="grid grid-cols-2 gap-3">
                      {["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"].map((time) => (
                        <button
                          key={time}
                          onClick={() => setFormData({ ...formData, time })}
                          className={cn(
                            "p-3 rounded-lg border text-sm font-medium transition-all hover:border-primary",
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
                        {servicesList.find(s => s.id === formData.service)?.title}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-200 mt-2">
                      <span>Estimated Total:</span>
                      <span className="font-bold text-primary text-lg">
                        ₹{servicesList.find(s => s.id === formData.service)?.price}
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
              onClick={() => alert("Booking Confirmed! Thank you.")}
              disabled={!isStepValid()}
              className="w-40 bg-green-600 hover:bg-green-700"
            >
              Confirm Booking
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
