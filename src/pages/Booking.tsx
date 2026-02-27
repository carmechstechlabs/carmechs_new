import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { Check, ChevronRight, ChevronLeft, Calendar as CalendarIcon, Car, Wrench, Info, Search, Wallet, CreditCard, Loader2, Clock, ShieldAlert, ShieldCheck, Zap, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useData } from "@/context/DataContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

const steps = [
  { id: 1, title: "Vehicle", icon: Car },
  { id: 2, title: "Service", icon: Wrench },
  { id: 3, title: "Schedule", icon: CalendarIcon },
  { id: 4, title: "Confirm", icon: CreditCard },
];

export function Booking() {
  const { services, carMakes, carModels, fuelTypes, addAppointment, users, updateWalletBalance, updateUser } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [useWallet, setUseWallet] = useState(false);
  
  // Simulate logged in user
  const user = users[0];
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    fuel: "",
    service: "",
    date: "",
    time: "",
    name: "",
    phone: "",
    email: "",
    paymentMethod: "pay_after_service" as 'razorpay' | 'paytm' | 'pay_after_service'
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
  const [showVerification, setShowVerification] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyPhone = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    setIsVerifying(true);
    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    updateUser(user.id, { verified: true });
    setShowVerification(false);
    toast.success("Phone number verified successfully!");
    setIsVerifying(false);
  };

  const handleSubmit = async () => {
    if (user?.blocked) {
      toast.error("Your account has been blocked. Please contact support.");
      return;
    }

    if (!user?.verified) {
      setShowVerification(true);
      toast.error("Please verify your phone number to continue");
      return;
    }

    if (!formData.name || !formData.phone) {
      toast.error("Please enter your name and phone number");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const service = services.find(s => s.id === formData.service);
      const totalPrice = service ? calculatePrice(service.basePrice) : 0;
      
      // If using wallet, we subtract from balance first
      if (useWallet && user) {
        if (user.walletBalance < totalPrice) {
          toast.error("Insufficient wallet balance");
          setIsSubmitting(false);
          return;
        }
        updateWalletBalance(user.id, -totalPrice);
      }

      // Simulate Payment Gateway for Razorpay/Paytm
      if (formData.paymentMethod === 'razorpay' || formData.paymentMethod === 'paytm') {
        toast.info(`Redirecting to ${formData.paymentMethod === 'razorpay' ? 'Razorpay' : 'Paytm'}...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.success("Payment Successful!");
      }

      addAppointment({
        ...formData,
        amount: totalPrice,
      });
      
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
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = () => {
    if (currentStep === 1) return formData.make && formData.model && formData.fuel;
    if (currentStep === 2) return formData.service;
    if (currentStep === 3) return formData.date && formData.time && formData.name && formData.phone;
    if (currentStep === 4) return formData.paymentMethod;
    return false;
  };

  const filteredMakes = carMakes.filter(make => 
    make.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fdfcfb] pb-32">
      {/* Hero Header */}
      <div className="bg-slate-900 pt-40 pb-24 relative overflow-hidden mb-12">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-slate-900 to-transparent z-10" />
        
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm mb-6"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Booking Terminal</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-6"
            >
              Secure Your <br /> Slot
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-white/40 font-medium max-w-xl mx-auto"
            >
              Configure your service parameters and schedule a precision maintenance session in under 60 seconds.
            </motion.p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl relative z-20">
        {/* Progress Steps */}
        <div className="mb-16">
          <div className="flex justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-200 -z-10 -translate-y-1/2 rounded-full"></div>
            <div 
              className="absolute top-1/2 left-0 h-[2px] bg-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
            
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <motion.div 
                  initial={false}
                  animate={{
                    scale: currentStep >= step.id ? 1.1 : 1,
                    backgroundColor: currentStep >= step.id ? "var(--color-primary)" : "#fff"
                  }}
                  className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 shadow-xl",
                    currentStep >= step.id 
                      ? "border-primary text-white shadow-primary/20" 
                      : "border-slate-200 text-slate-400 bg-white"
                  )}
                >
                  {currentStep > step.id ? <Check className="w-6 h-6 stroke-[3]" /> : <step.icon className="w-6 h-6" />}
                </motion.div>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest mt-4 transition-colors duration-300",
                  currentStep >= step.id ? "text-slate-900" : "text-slate-400"
                )}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        {user?.blocked && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-6 bg-red-50 border border-red-100 rounded-[2rem] flex items-center gap-4 text-red-700 shadow-xl shadow-red-900/5"
          >
            <div className="h-12 w-12 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <p className="font-black uppercase tracking-tight text-lg">Account Restricted</p>
              <p className="text-sm font-medium opacity-80">Your access to the booking terminal has been limited. Contact support for resolution.</p>
            </div>
          </motion.div>
        )}

        {!user?.verified && !user?.blocked && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-6 bg-amber-50 border border-amber-100 rounded-[2rem] flex items-center justify-between gap-4 text-amber-700 shadow-xl shadow-amber-900/5"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <p className="font-black uppercase tracking-tight text-lg">Identity Verification</p>
                <p className="text-sm font-medium opacity-80">A verified phone number is required to finalize your transmission.</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="h-12 px-6 border-amber-200 text-amber-700 hover:bg-amber-100 rounded-xl font-black uppercase tracking-widest text-[10px]" 
              onClick={() => setShowVerification(true)}
            >
              Verify Now
            </Button>
          </motion.div>
        )}

        {/* Form Content */}
        <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-black/5 border border-slate-100 p-10 md:p-16 min-h-[500px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 -z-10" />
          
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div>
                  <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2">Vehicle Config</h2>
                  <p className="text-slate-400 font-medium">Specify your machine's parameters for accurate pricing.</p>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-3 block">1. Select Manufacturer</label>
                    <div className="relative mb-4">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input 
                        placeholder="Search manufacturer..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-16 pl-14 rounded-2xl border-slate-100 bg-slate-50 focus:ring-primary/20 font-bold"
                      />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-2 custom-scrollbar">
                      {filteredMakes.map((make) => (
                        <button
                          key={make.name}
                          onClick={() => setFormData({ ...formData, make: make.name })}
                          className={cn(
                            "h-14 rounded-xl border text-xs font-black uppercase tracking-widest transition-all",
                            formData.make === make.name 
                              ? "border-primary bg-primary text-white shadow-lg shadow-primary/20" 
                              : "border-slate-100 bg-slate-50 text-slate-500 hover:border-primary/30"
                          )}
                        >
                          {make.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <motion.div
                    animate={{ opacity: formData.make ? 1 : 0.5 }}
                  >
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-3 block">2. Select Model</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {carModels.filter(m => m.make === formData.make).map((model) => (
                        <button
                          key={model.name}
                          onClick={() => setFormData({ ...formData, model: model.name })}
                          className={cn(
                            "h-14 rounded-xl border text-xs font-black uppercase tracking-widest transition-all",
                            formData.model === model.name 
                              ? "border-primary bg-primary text-white shadow-lg shadow-primary/20" 
                              : "border-slate-100 bg-slate-50 text-slate-500 hover:border-primary/30"
                          )}
                        >
                          {model.name}
                        </button>
                      ))}
                      {!formData.make && (
                        <div className="col-span-full text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                          Awaiting Manufacturer Selection
                        </div>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ opacity: formData.model ? 1 : 0.5 }}
                  >
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-3 block">3. Propulsion System</label>
                    <div className="flex gap-3 flex-wrap">
                      {fuelTypes.map((fuel) => (
                        <button
                          key={fuel.name}
                          onClick={() => setFormData({ ...formData, fuel: fuel.name })}
                          className={cn(
                            "px-6 h-12 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all",
                            formData.fuel === fuel.name 
                              ? "border-primary bg-primary text-white shadow-lg shadow-primary/20" 
                              : "border-slate-100 bg-slate-50 text-slate-500 hover:border-primary/30"
                          )}
                        >
                          {fuel.name}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div>
                  <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2">Service Selection</h2>
                  <p className="text-slate-400 font-medium">Choose the maintenance protocol for your vehicle.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {services.map((service) => (
                    <motion.div
                      key={service.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setFormData({ ...formData, service: service.id })}
                      className={cn(
                        "p-8 rounded-3xl border text-left transition-all flex justify-between items-center group cursor-pointer relative overflow-hidden",
                        formData.service === service.id 
                          ? "border-primary bg-primary/5 shadow-xl shadow-primary/5" 
                          : "border-slate-100 bg-slate-50 hover:border-primary/30"
                      )}
                    >
                      <div className="flex items-center gap-6">
                        <div className={cn(
                          "h-16 w-16 rounded-2xl flex items-center justify-center transition-colors",
                          formData.service === service.id ? "bg-primary text-white" : "bg-white text-slate-400 group-hover:text-primary"
                        )}>
                          <Zap className="h-8 w-8" />
                        </div>
                        <div>
                          <h3 className={cn(
                            "text-2xl font-black uppercase tracking-tight transition-colors",
                            formData.service === service.id ? "text-primary" : "text-slate-900"
                          )}>
                            {service.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-slate-500 font-bold">₹{calculatePrice(service.basePrice)}</span>
                            <Popover>
                              <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-300 hover:text-primary rounded-full">
                                  <Info className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-72 p-6 rounded-[2rem] shadow-2xl border-slate-100">
                                <div className="space-y-4">
                                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-3">Cost Breakdown</h4>
                                  {getPriceBreakdown(service.basePrice).map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm font-bold">
                                      <span className="text-slate-500">{item.label}</span>
                                      <span className="text-slate-900">{item.value}</span>
                                    </div>
                                  ))}
                                  <div className="flex justify-between text-lg font-black uppercase tracking-tight border-t border-slate-100 pt-4 mt-2">
                                    <span className="text-slate-900">Total</span>
                                    <span className="text-primary">₹{calculatePrice(service.basePrice)}</span>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>
                      {formData.service === service.id && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="h-10 w-10 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/20"
                        >
                          <Check className="h-6 w-6 stroke-[3]" />
                        </motion.div>
                      )}
                    </motion.div>
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
                className="space-y-10"
              >
                <div>
                  <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2">Scheduling</h2>
                  <p className="text-slate-400 font-medium">Define your temporal coordinates and contact details.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Full Name</label>
                      <Input 
                        placeholder="Operator Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="h-16 px-6 rounded-2xl border-slate-100 bg-slate-50 font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Phone Uplink</label>
                      <Input 
                        placeholder="+91 XXXXX XXXXX"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="h-16 px-6 rounded-2xl border-slate-100 bg-slate-50 font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email Address</label>
                      <Input 
                        placeholder="operator@domain.com"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="h-16 px-6 rounded-2xl border-slate-100 bg-slate-50 font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Target Date</label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input 
                          type="date" 
                          className="w-full h-16 pl-14 pr-6 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          value={formData.date}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Time Slot</label>
                      <div className="grid grid-cols-2 gap-3">
                        {["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"].map((time) => (
                          <button
                            key={time}
                            onClick={() => setFormData({ ...formData, time })}
                            className={cn(
                              "h-14 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                              formData.time === time 
                                ? "border-primary bg-primary text-white shadow-lg shadow-primary/20" 
                                : "border-slate-100 bg-slate-50 text-slate-500 hover:border-primary/30"
                            )}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-6">Configuration Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/40 text-xs font-bold uppercase">Machine</span>
                        <span className="font-black uppercase tracking-tight">{formData.make} {formData.model}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/40 text-xs font-bold uppercase">Protocol</span>
                        <span className="font-black uppercase tracking-tight">{services.find(s => s.id === formData.service)?.title}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/40 text-xs font-bold uppercase">Wallet Credit</span>
                        <div className="flex items-center gap-3">
                          <span className="font-black uppercase tracking-tight">₹{user?.walletBalance || 0}</span>
                          {user && user.walletBalance > 0 && (
                            <input 
                              type="checkbox" 
                              checked={useWallet}
                              onChange={(e) => setUseWallet(e.target.checked)}
                              className="h-5 w-5 rounded-lg border-white/20 bg-white/10 text-primary focus:ring-primary"
                            />
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-white/10">
                        <span className="text-white/40 text-xs font-bold uppercase">Estimated Total</span>
                        <span className="text-3xl font-black text-primary">
                          ₹{(() => {
                            const service = services.find(s => s.id === formData.service);
                            return service ? calculatePrice(service.basePrice) : 0;
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div>
                  <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2">Finalization</h2>
                  <p className="text-slate-400 font-medium">Select your preferred transaction gateway.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: 'razorpay', title: 'Razorpay', desc: 'Cards, Netbanking, UPI', icon: CreditCard, color: 'blue' },
                    { id: 'paytm', title: 'Paytm', desc: 'Wallet, UPI, Bank', icon: CreditCard, color: 'sky' },
                    { id: 'pay_after_service', title: 'Pay After Service', desc: 'Doorstep Settlement', icon: Clock, color: 'slate' }
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setFormData({ ...formData, paymentMethod: method.id as any })}
                      className={cn(
                        "p-8 rounded-3xl border text-left transition-all flex items-center gap-6 group",
                        formData.paymentMethod === method.id 
                          ? "border-primary bg-primary/5 shadow-xl shadow-primary/5" 
                          : "border-slate-100 bg-slate-50 hover:border-primary/30"
                      )}
                    >
                      <div className={cn(
                        "h-16 w-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                        formData.paymentMethod === method.id ? "bg-primary text-white" : "bg-white text-slate-400 group-hover:text-primary"
                      )}>
                        <method.icon className="h-8 w-8" />
                      </div>
                      <div>
                        <p className={cn(
                          "text-2xl font-black uppercase tracking-tight",
                          formData.paymentMethod === method.id ? "text-primary" : "text-slate-900"
                        )}>{method.title}</p>
                        <p className="text-sm font-medium text-slate-500">{method.desc}</p>
                      </div>
                      {formData.paymentMethod === method.id && (
                        <div className="ml-auto h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white">
                          <Check className="h-5 w-5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {user && user.walletBalance > 0 && (
                  <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="h-14 w-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-lg shadow-emerald-900/5">
                        <Wallet className="h-7 w-7" />
                      </div>
                      <div>
                        <p className="text-lg font-black uppercase tracking-tight text-slate-900">Apply Wallet Credit</p>
                        <p className="text-sm font-medium text-emerald-700">Available Balance: ₹{user.walletBalance}</p>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={useWallet}
                      onChange={(e) => setUseWallet(e.target.checked)}
                      className="h-8 w-8 rounded-xl border-emerald-200 bg-white text-emerald-600 focus:ring-emerald-500"
                    />
                  </div>
                )}

                <div className="p-10 bg-slate-900 rounded-[3rem] text-white shadow-2xl shadow-black/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 blur-[80px] rounded-full" />
                  <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                    <div>
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Settlement Amount</p>
                      <h3 className="text-6xl font-black text-primary tracking-tighter">
                        ₹{(() => {
                          const service = services.find(s => s.id === formData.service);
                          const total = service ? calculatePrice(service.basePrice) : 0;
                          return useWallet ? Math.max(0, total - user.walletBalance) : total;
                        })()}
                      </h3>
                    </div>
                    <div className="text-center md:text-right">
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Active Protocol</p>
                      <p className="text-xl font-black uppercase tracking-tight">{services.find(s => s.id === formData.service)?.title}</p>
                      <div className="flex items-center gap-2 mt-2 justify-center md:justify-end text-white/60 text-xs font-bold">
                        <Sparkles className="h-3 w-3 text-primary" />
                        {formData.make} {formData.model}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-12">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1 || showVerification}
            className="h-16 px-10 rounded-2xl border-slate-200 text-slate-600 font-black uppercase tracking-widest text-xs hover:bg-slate-50"
          >
            <ChevronLeft className="w-5 h-5 mr-3" /> Back
          </Button>

          {currentStep < 4 ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid() || user?.blocked || showVerification}
              className="h-16 px-12 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20"
            >
              Next Step <ChevronRight className="w-5 h-5 ml-3" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!isStepValid() || isSubmitting || user?.blocked || showVerification}
              className="h-16 px-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-900/20 group"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Confirm Booking <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          )}
        </div>

        {/* Verification Modal */}
        <AnimatePresence>
          {showVerification && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-[3.5rem] shadow-2xl max-w-md w-full p-12 text-center border border-slate-100"
              >
                <div className="h-24 w-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <ShieldCheck className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">Verification</h3>
                <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                  We've transmitted a 6-digit access code to <br />
                  <span className="font-black text-slate-900 tracking-tight">{user.phone}</span>
                </p>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Access Code</label>
                    <Input 
                      className="text-center text-4xl tracking-[0.5em] font-black h-20 rounded-2xl border-slate-100 bg-slate-50 focus:ring-primary/20"
                      maxLength={6}
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                  <Button 
                    className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20" 
                    onClick={handleVerifyPhone}
                    disabled={isVerifying || otp.length !== 6}
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      "Authorize Transmission"
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full h-12 rounded-xl text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-slate-600" 
                    onClick={() => setShowVerification(false)}
                    disabled={isVerifying}
                  >
                    Abort Session
                  </Button>
                </div>
                
                <p className="text-xs font-bold text-slate-400 mt-10 uppercase tracking-widest">
                  No transmission? <button className="text-primary hover:underline">Resend Code</button>
                </p>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
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
