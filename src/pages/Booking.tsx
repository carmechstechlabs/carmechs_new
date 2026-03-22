import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { Check, ChevronRight, ChevronLeft, Calendar as CalendarIcon, Car, Wrench, Info, Search, Wallet, CreditCard, Loader2, Clock, ShieldAlert, ShieldCheck, Zap, ArrowRight, Sparkles, Package, Camera, Building2, MapPin, Star, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useData } from "@/context/DataContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ImageUpload";

const steps = [
  { id: 1, title: "Machine Config", icon: Car },
  { id: 2, title: "Protocol Selection", icon: Wrench },
  { id: 3, title: "Visual Diagnostics", icon: Camera },
  { id: 4, title: "Service Center", icon: Building2 },
  { id: 5, title: "Temporal Sync", icon: CalendarIcon },
  { id: 6, title: "Final Authorization", icon: ShieldCheck },
];

export function Booking() {
  const { 
    services, servicePackages, carMakes, carModels, fuelTypes, 
    addAppointment, users, updateWalletBalance, updateUser, locations,
    currentUser, workshops, technicians, coupons
  } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [useWallet, setUseWallet] = useState(false);
  
  // Use the actual logged in user from context
  const user = users.find(u => u.email === currentUser?.email) || (currentUser ? {
    id: currentUser.uid,
    name: currentUser.displayName || currentUser.email?.split('@')[0] || "User",
    email: currentUser.email || "",
    phone: currentUser.phoneNumber || "",
    walletBalance: 0,
    verified: !!currentUser.emailVerified,
    blocked: false,
    role: 'user'
  } : null);
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    fuel: "",
    year: "",
    licensePlate: "",
    service: "",
    packageId: "",
    date: "",
    time: "",
    name: "",
    phone: "",
    email: "",
    locationId: "",
    workshopId: "",
    technicianId: "",
    issuePhotos: [] as string[],
    paymentMethod: "pay_after_service" as 'razorpay' | 'paytm' | 'pay_after_service'
  });

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  const handleApplyCoupon = () => {
    const coupon = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase() && c.isActive);
    if (!coupon) {
      toast.error("Invalid or inactive coupon code");
      return;
    }
    
    const now = new Date();
    if (coupon.expiryDate && new Date(coupon.expiryDate) < now) {
      toast.error("Coupon has expired");
      return;
    }

    const basePrice = formData.packageId 
      ? (servicePackages.find(p => p.id === formData.packageId)?.basePrice || 0)
      : (services.find(s => s.id === formData.service)?.basePrice || 0);

    const currentTotal = calculatePrice(basePrice);
    if (currentTotal < coupon.minOrderAmount) {
      toast.error(`Minimum order amount for this coupon is ₹${coupon.minOrderAmount}`);
      return;
    }

    setAppliedCoupon(coupon);
    toast.success(`Coupon "${coupon.code}" applied!`);
  };

  const filteredServicesForVehicle = useMemo(() => {
    return services.filter(service => {
      // If no vehicle selected, show all
      if (!formData.make) return true;

      const matchesMake = !service.applicableMakes || service.applicableMakes.length === 0 || service.applicableMakes.includes(formData.make);
      const matchesModel = !service.applicableModels || service.applicableModels.length === 0 || service.applicableModels.includes(formData.model);
      const matchesFuel = !service.applicableFuelTypes || service.applicableFuelTypes.length === 0 || service.applicableFuelTypes.includes(formData.fuel);

      return matchesMake && matchesModel && matchesFuel;
    });
  }, [services, formData.make, formData.model, formData.fuel]);

  const filteredPackagesForVehicle = useMemo(() => {
    return servicePackages.filter(pkg => {
      // A package is applicable if all its services are applicable
      return pkg.serviceIds.every(id => {
        const service = services.find(s => s.id === id);
        if (!service) return true;
        
        if (!formData.make) return true;

        const matchesMake = !service.applicableMakes || service.applicableMakes.length === 0 || service.applicableMakes.includes(formData.make);
        const matchesModel = !service.applicableModels || service.applicableModels.length === 0 || service.applicableModels.includes(formData.model);
        const matchesFuel = !service.applicableFuelTypes || service.applicableFuelTypes.length === 0 || service.applicableFuelTypes.includes(formData.fuel);

        return matchesMake && matchesModel && matchesFuel;
      });
    });
  }, [servicePackages, services, formData.make, formData.model, formData.fuel]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.name || "",
        phone: prev.phone || user.phone || "",
        email: prev.email || user.email || ""
      }));
    }
  }, [user]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const qServiceId = params.get('serviceId');
    const qPackageId = params.get('packageId');
    const qMake = params.get('make');
    const qModel = params.get('model');
    const qFuel = params.get('fuel');

    if (location.state?.serviceId || qServiceId) {
      setFormData(prev => ({ ...prev, service: location.state?.serviceId || qServiceId || "" }));
    }
    if (location.state?.packageId || qPackageId) {
      setFormData(prev => ({ ...prev, packageId: location.state?.packageId || qPackageId || "" }));
    }
    if (location.state?.vehicleDetails || (qMake && qModel && qFuel)) {
      setFormData(prev => ({
        ...prev,
        make: location.state?.vehicleDetails?.make || qMake || "",
        model: location.state?.vehicleDetails?.model || qModel || "",
        fuel: location.state?.vehicleDetails?.fuel || qFuel || "",
        year: location.state?.vehicleDetails?.year || "",
        licensePlate: location.state?.vehicleDetails?.licensePlate || ""
      }));
    }
  }, [location.state, location.search]);

  const calculatePrice = (basePrice: number) => {
    let additionalPrice = 0;
    const { make, model, fuel, packageId } = formData;

    // Packages have their own discounted base price already calculated
    if (packageId) {
      const pkg = servicePackages.find(p => p.id === packageId);
      if (pkg) basePrice = pkg.basePrice;
    }

    const selectedMake = carMakes.find(m => m.name === make);
    if (selectedMake) additionalPrice += selectedMake.price;

    const selectedModel = carModels.find(m => m.name === model);
    if (selectedModel) additionalPrice += selectedModel.price;

    const selectedFuel = fuelTypes.find(f => f.name === fuel);
    if (selectedFuel) additionalPrice += selectedFuel.price;

    let total = Math.round(basePrice + additionalPrice);

    if (appliedCoupon) {
      let discount = 0;
      if (appliedCoupon.discountType === 'percentage') {
        discount = (total * appliedCoupon.discountValue) / 100;
        if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
          discount = appliedCoupon.maxDiscount;
        }
      } else {
        discount = appliedCoupon.discountValue;
      }
      total -= discount;
    }

    return Math.max(0, Math.round(total));
  };

  const getPriceBreakdown = (basePrice: number) => {
    const { make, model, fuel, packageId } = formData;
    const breakdown = [];
    
    if (packageId) {
      const pkg = servicePackages.find(p => p.id === packageId);
      if (pkg) {
        breakdown.push({ label: "Package Base", value: `₹${pkg.basePrice}` });
        basePrice = pkg.basePrice;
      }
    } else {
      breakdown.push({ label: "Base Price", value: `₹${basePrice}` });
    }

    const selectedMake = carMakes.find(m => m.name === make);
    if (selectedMake && selectedMake.price !== 0) {
      breakdown.push({ label: `${make} Adjustment`, value: `+₹${selectedMake.price}` });
    }

    const selectedModel = carModels.find(m => m.name === model);
    if (selectedModel && selectedModel.price !== 0) {
      breakdown.push({ label: `${model} Adjustment`, value: `+₹${selectedModel.price}` });
    }

    const selectedFuel = fuelTypes.find(f => f.name === fuel);
    if (selectedFuel && selectedFuel.price !== 0) {
      breakdown.push({ label: `${fuel} Adjustment`, value: `+₹${selectedFuel.price}` });
    }

    if (appliedCoupon) {
      let totalBeforeDiscount = Math.round(basePrice + (selectedMake?.price || 0) + (selectedModel?.price || 0) + (selectedFuel?.price || 0));
      let discount = 0;
      if (appliedCoupon.discountType === 'percentage') {
        discount = (totalBeforeDiscount * appliedCoupon.discountValue) / 100;
        if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
          discount = appliedCoupon.maxDiscount;
        }
      } else {
        discount = appliedCoupon.discountValue;
      }
      breakdown.push({ label: `Coupon (${appliedCoupon.code})`, value: `-₹${Math.round(discount)}`, isDiscount: true });
    }

    return breakdown;
  };

  const filteredWorkshops = useMemo(() => {
    if (!formData.service && !formData.packageId) return workshops;
    
    return workshops.filter(w => {
      if (formData.packageId) {
        const pkg = servicePackages.find(p => p.id === formData.packageId);
        if (!pkg) return true;
        return pkg.serviceIds.every(sId => w.servicesOffered.includes(sId));
      }
      return w.servicesOffered.includes(formData.service);
    });
  }, [workshops, formData.service, formData.packageId, servicePackages]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
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
    if (user) {
      updateUser(user.id, { verified: true });
    } else {
      // For guest users, we just set a local flag or proceed
      // In this demo, we'll just allow them to proceed
    }
    setGuestVerified(true);
    setShowVerification(false);
    toast.success("Phone number verified successfully!");
    setIsVerifying(false);
  };

  const [guestVerified, setGuestVerified] = useState(false);

  const handleSubmit = async () => {
    if (user?.blocked) {
      toast.error("Your account has been blocked. Please contact support.");
      return;
    }

    if (!user?.verified && !guestVerified) {
      setShowVerification(true);
      toast.error("Please verify your phone number to continue");
      return;
    }

    if (!formData.name || !formData.phone) {
      toast.error("Please enter your name and phone number");
      return;
    }

    setShowConfirmation(true);
  };

  const confirmSubmit = async () => {
    setShowConfirmation(false);
    setIsSubmitting(true);
    
    try {
      const service = services.find(s => s.id === formData.service);
      const pkg = servicePackages.find(p => p.id === formData.packageId);
      const serviceTitle = pkg ? pkg.title : (service?.title || formData.service || "Car Service");
      const serviceId = pkg ? pkg.id : (service?.id || formData.service || "unknown");
      const totalPrice = pkg ? pkg.basePrice : (service ? calculatePrice(service.basePrice) : 0);
      
      let amountToPay = totalPrice;
      let walletDeduction = 0;

      // If using wallet, we subtract from balance
      if (useWallet && user) {
        walletDeduction = Math.min(totalPrice, user.walletBalance || 0);
        await updateWalletBalance(user.id, -walletDeduction);
        amountToPay -= walletDeduction;
      }

      // Simulate Payment Gateway for Razorpay/Paytm if there's still an amount to pay
      if (amountToPay > 0 && (formData.paymentMethod === 'razorpay' || formData.paymentMethod === 'paytm')) {
        toast.info(`Redirecting to ${formData.paymentMethod === 'razorpay' ? 'Razorpay' : 'Paytm'} for ₹${amountToPay.toLocaleString()}...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.success("Payment Successful!");
      }

      addAppointment({
        ...formData,
        service: serviceTitle,
        serviceId: serviceId,
        amount: totalPrice,
        walletUsed: walletDeduction,
        finalPaid: amountToPay,
        locationName: locations.find(l => l.id === formData.locationId)?.name,
        paymentStatus: amountToPay > 0 && formData.paymentMethod === 'pay_after_service' ? 'pending' : 'paid'
      });
      
      if (formData.email) {
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
    if (currentStep < 6) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = () => {
    if (currentStep === 1) return formData.make && formData.model && formData.fuel;
    if (currentStep === 2) return formData.service || formData.packageId;
    if (currentStep === 3) return true; // Visual Diagnostics is optional
    if (currentStep === 4) return formData.workshopId;
    if (currentStep === 5) return formData.date && formData.time && formData.name && formData.phone && formData.locationId;
    if (currentStep === 6) return formData.paymentMethod;
    return false;
  };

  const filteredMakes = carMakes.filter(make => 
    make.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Hero Header */}
      <div className="bg-white pt-40 pb-24 relative overflow-hidden border-b border-slate-100 mb-12">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-6"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Booking Terminal</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-6"
            >
              Secure Your <br /> Slot
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-500 font-medium max-w-xl mx-auto"
            >
              Configure your service parameters and schedule a precision maintenance session in under 60 seconds.
            </motion.p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 max-w-4xl relative z-20">
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
                    backgroundColor: currentStep >= step.id ? "var(--primary)" : "#fff"
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
            className="mb-8 p-6 bg-primary/5 border border-primary/10 rounded-[2rem] flex items-center gap-4 text-primary shadow-xl shadow-primary/5"
          >
            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
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
                  <p className="text-slate-500 font-medium">Specify your machine's parameters for accurate pricing.</p>
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
                            "h-14 rounded-xl border text-xs font-black uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-1",
                            formData.model === model.name 
                              ? "border-primary bg-primary text-white shadow-lg shadow-primary/20" 
                              : "border-slate-100 bg-slate-50 text-slate-500 hover:border-primary/30"
                          )}
                        >
                          <span>{model.name}</span>
                          {model.price > 0 && (
                            <span className={cn(
                              "text-[8px] font-bold",
                              formData.model === model.name ? "text-white/70" : "text-primary/60"
                            )}>
                              +₹{model.price}
                            </span>
                          )}
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
                    <div className="flex gap-3 flex-wrap mb-8">
                      {fuelTypes.map((fuel) => (
                        <button
                          key={fuel.name}
                          onClick={() => setFormData({ ...formData, fuel: fuel.name })}
                          className={cn(
                            "px-6 h-12 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                            formData.fuel === fuel.name 
                              ? "border-primary bg-primary text-white shadow-lg shadow-primary/20" 
                              : "border-slate-100 bg-slate-50 text-slate-500 hover:border-primary/30"
                          )}
                        >
                          {fuel.name}
                          {fuel.price > 0 && (
                            <span className={cn(
                              "text-[8px] font-bold",
                              formData.fuel === fuel.name ? "text-white/70" : "text-primary/60"
                            )}>
                              +₹{fuel.price}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Manufacturing Year (Optional)</label>
                        <Input 
                          placeholder="e.g. 2022"
                          value={formData.year}
                          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                          className="h-14 px-6 rounded-2xl border-slate-100 bg-slate-50 font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">License Plate (Optional)</label>
                        <Input 
                          placeholder="e.g. KA 01 AB 1234"
                          value={formData.licensePlate}
                          onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
                          className="h-14 px-6 rounded-2xl border-slate-100 bg-slate-50 font-bold uppercase"
                        />
                      </div>
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
                  <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2">Service Details</h2>
                  <p className="text-slate-500 font-medium">Choose the maintenance protocol for your vehicle.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {/* Service Packages First */}
                  {filteredPackagesForVehicle.length > 0 && (
                    <div className="space-y-4 mb-6">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Recommended Bundles</p>
                      {filteredPackagesForVehicle.map((pkg) => (
                        <motion.div
                          key={pkg.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => setFormData({ ...formData, packageId: pkg.id, service: "" })}
                          className={cn(
                            "p-8 rounded-3xl border text-left transition-all flex justify-between items-center group cursor-pointer relative overflow-hidden",
                            formData.packageId === pkg.id 
                              ? "border-emerald-600 bg-emerald-50 shadow-xl shadow-emerald-600/5" 
                              : "border-slate-100 bg-white hover:border-emerald-600/30 shadow-sm"
                          )}
                        >
                          <div className="flex items-center gap-6">
                            <div className={cn(
                              "h-16 w-16 rounded-2xl flex items-center justify-center transition-colors",
                              formData.packageId === pkg.id ? "bg-emerald-600 text-white" : "bg-slate-50 text-slate-400 group-hover:text-emerald-600"
                            )}>
                              <Package className="h-8 w-8" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className={cn(
                                  "text-2xl font-black uppercase tracking-tight transition-colors",
                                  formData.packageId === pkg.id ? "text-emerald-600" : "text-slate-900"
                                )}>
                                  {pkg.title}
                                </h3>
                                <span className="bg-emerald-100 text-emerald-600 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">Bundle</span>
                              </div>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-slate-500 font-bold">₹{pkg.basePrice.toLocaleString()}</span>
                                <span className="text-[10px] text-slate-400 line-through font-medium">
                                  ₹{services.filter(s => pkg.serviceIds.includes(s.id)).reduce((sum, s) => sum + s.basePrice, 0).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          {formData.packageId === pkg.id && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="h-10 w-10 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-600/20"
                            >
                              <Check className="h-6 w-6 stroke-[3]" />
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}

                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Individual Services</p>
                  {filteredServicesForVehicle.map((service) => (
                    <motion.div
                      key={service.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setFormData({ ...formData, service: service.id, packageId: "" })}
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
                              <PopoverContent className="w-72 p-6 rounded-[2rem] shadow-2xl border-slate-100 bg-white">
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
                  <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2">Visual Diagnostics</h2>
                  <p className="text-slate-500 font-medium">Upload photos of the issue for a more accurate remote diagnosis.</p>
                </div>

                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50">
                  <div className="flex items-center gap-4 mb-8 p-6 bg-primary/5 rounded-3xl border border-primary/10">
                    <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                      <Camera className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Issue Documentation</h3>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Help our technicians understand the problem</p>
                    </div>
                  </div>

                  <ImageUpload 
                    onUpload={(urls) => setFormData(prev => ({ ...prev, issuePhotos: urls }))}
                    maxFiles={5}
                  />
                  
                  <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-start gap-4">
                    <Info className="h-5 w-5 text-primary mt-0.5" />
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Capturing clear photos of warning lights, fluid leaks, or physical damage allows our diagnostic AI and master technicians to prepare the necessary components before arrival.
                    </p>
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
                  <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2">Service Center</h2>
                  <p className="text-slate-400 font-medium">Select a certified workshop for your vehicle's maintenance.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredWorkshops.map((workshop) => (
                    <button
                      key={workshop.id}
                      onClick={() => setFormData({ ...formData, workshopId: workshop.id })}
                      className={cn(
                        "p-6 rounded-[2.5rem] border text-left transition-all flex flex-col gap-4 group relative overflow-hidden",
                        formData.workshopId === workshop.id 
                          ? "border-primary bg-primary/5 shadow-2xl shadow-primary/10" 
                          : "border-slate-100 bg-white hover:border-primary/30 shadow-sm"
                      )}
                    >
                      <div className="flex justify-between items-start w-full">
                        <div className={cn(
                          "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500",
                          formData.workshopId === workshop.id ? "bg-primary text-white scale-110 shadow-xl shadow-primary/20" : "bg-slate-50 text-slate-400 group-hover:text-primary"
                        )}>
                          <Building2 className="h-7 w-7" />
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          <span className="text-[10px] font-black text-amber-700">{workshop.rating}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className={cn(
                          "text-xl font-black uppercase tracking-tight transition-colors",
                          formData.workshopId === workshop.id ? "text-primary" : "text-slate-900"
                        )}>{workshop.name}</h3>
                        <div className="flex items-center gap-2 mt-1 text-slate-400">
                          <MapPin className="h-3 w-3" />
                          <p className="text-[10px] font-bold uppercase tracking-widest">{workshop.address}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2">
                        {workshop.servicesOffered.slice(0, 3).map(sId => {
                          const s = services.find(srv => srv.id === sId);
                          return s ? (
                            <span key={sId} className="px-2 py-1 bg-slate-100 rounded-md text-[8px] font-black uppercase tracking-widest text-slate-500">
                              {s.title}
                            </span>
                          ) : null;
                        })}
                        {workshop.servicesOffered.length > 3 && (
                          <span className="px-2 py-1 bg-slate-100 rounded-md text-[8px] font-black uppercase tracking-widest text-slate-500">
                            +{workshop.servicesOffered.length - 3} More
                          </span>
                        )}
                      </div>

                      {formData.workshopId === workshop.id && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-6 right-6 h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/20"
                        >
                          <Check className="h-5 w-5 stroke-[3]" />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>

                {filteredWorkshops.length === 0 && (
                  <div className="p-12 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                    <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No workshops found for the selected services.</p>
                  </div>
                )}
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="step5"
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
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Service City</label>
                      <select 
                        className="w-full h-16 px-6 rounded-2xl border border-slate-100 bg-slate-50 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={locations.find(l => l.id === formData.locationId)?.city || ""}
                        onChange={(e) => {
                          const city = e.target.value;
                          const firstLocInCity = locations.find(l => l.city === city);
                          setFormData({ ...formData, locationId: firstLocInCity?.id || "" });
                        }}
                      >
                        <option value="">Select City</option>
                        {Array.from(new Set(locations.map(l => l.city))).map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Service Hub</label>
                      <select 
                        className="w-full h-16 px-6 rounded-2xl border border-slate-100 bg-slate-50 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={formData.locationId}
                        onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                        disabled={!locations.find(l => l.id === formData.locationId)?.city && !Array.from(new Set(locations.map(l => l.city))).length}
                      >
                        <option value="">Select Service Center</option>
                        {locations
                          .filter(loc => !locations.find(l => l.id === formData.locationId)?.city || loc.city === locations.find(l => l.id === formData.locationId)?.city)
                          .map(loc => (
                          <option key={loc.id} value={loc.id}>{loc.name}</option>
                        ))}
                      </select>
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

                {/* Mechanic Selection */}
                <div className="space-y-6 pt-10 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black tracking-tight uppercase">Select Expert Mechanic</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Choose a specialist for your vehicle</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {technicians.map((tech) => (
                      <button
                        key={tech.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, technicianId: tech.id })}
                        className={cn(
                          "p-5 rounded-3xl border-2 text-left transition-all duration-300 group relative overflow-hidden",
                          formData.technicianId === tech.id
                            ? "border-primary bg-primary/5 shadow-xl shadow-primary/10"
                            : "border-slate-50 bg-slate-50/50 hover:border-primary/30 hover:bg-slate-50"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "h-12 w-12 rounded-2xl flex items-center justify-center font-black text-lg transition-colors",
                            formData.technicianId === tech.id ? "bg-primary text-white" : "bg-white text-slate-400 group-hover:bg-primary/10 group-hover:text-primary shadow-sm"
                          )}>
                            {tech.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-black tracking-tight">{tech.name}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tech.specialty}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                tech.status === 'available' ? "bg-emerald-500" :
                                tech.status === 'busy' ? "bg-amber-500" : "bg-rose-500"
                              )} />
                              <span className={cn(
                                "text-[8px] font-black uppercase tracking-widest",
                                tech.status === 'available' ? "text-emerald-600" :
                                tech.status === 'busy' ? "text-amber-600" : "text-rose-600"
                              )}>
                                {tech.status === 'off' ? 'offline' : tech.status}
                              </span>
                            </div>
                          </div>
                          {formData.technicianId === tech.id && (
                            <div className="bg-primary text-white p-1 rounded-full">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 blur-[80px] rounded-full" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-8 border-b border-white/10 pb-4">Configuration Snapshot</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                    <div className="space-y-6">
                      <div className="flex justify-between items-start">
                        <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Machine Unit</span>
                        <div className="text-right">
                          <p className="font-black uppercase tracking-tight text-lg">{formData.make} {formData.model}</p>
                          {(formData.year || formData.licensePlate) && (
                            <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">
                              {formData.year} {formData.licensePlate ? `• ${formData.licensePlate}` : ''}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Operational Hub</span>
                        <span className="font-black uppercase tracking-tight">
                          {locations.find(l => l.id === formData.locationId)?.city || "Awaiting Selection"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Service Center</span>
                        <span className="font-black uppercase tracking-tight text-primary">
                          {workshops.find(w => w.id === formData.workshopId)?.name || "Awaiting Selection"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Active Protocol</span>
                        <span className="font-black uppercase tracking-tight text-primary">
                          {formData.packageId 
                            ? servicePackages.find(p => p.id === formData.packageId)?.title 
                            : services.find(s => s.id === formData.service)?.title || "None Selected"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Assigned Expert</span>
                        <span className="font-black uppercase tracking-tight text-primary">
                          {technicians.find(t => t.id === formData.technicianId)?.name || "Auto Assignment"}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Wallet Credit</span>
                        <div className="flex items-center gap-4">
                          <span className="font-black uppercase tracking-tight text-emerald-400">₹{(user?.walletBalance || 0).toLocaleString()}</span>
                          {user && user.walletBalance > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Apply</span>
                              <input 
                                type="checkbox" 
                                checked={useWallet}
                                onChange={(e) => setUseWallet(e.target.checked)}
                                className="h-5 w-5 rounded-lg border-white/20 bg-white/10 text-primary focus:ring-primary cursor-pointer"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-end pt-6 mt-6 border-t border-white/10">
                        <span className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Estimated Quote</span>
                        <span className="text-5xl font-black text-primary tracking-tighter">
                          ₹{(() => {
                            if (formData.packageId) {
                              return servicePackages.find(p => p.id === formData.packageId)?.basePrice || 0;
                            }
                            const service = services.find(s => s.id === formData.service);
                            return service ? calculatePrice(service.basePrice) : 0;
                          })().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div>
                  <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2">Final Authorization</h2>
                  <p className="text-slate-500 font-medium">Review parameters and initialize payment sequence.</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div className="p-10 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 blur-[80px] rounded-full" />
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-10 border-b border-white/10 pb-4 flex items-center gap-2">
                        <Sparkles className="h-3 w-3 text-primary" /> Transmission Summary
                      </h3>
                      
                      <div className="space-y-8">
                        <div className="flex items-start gap-6">
                          <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                            <Car className="h-7 w-7 text-primary" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Machine Identification</p>
                            <p className="text-2xl font-black uppercase tracking-tight">{formData.make} {formData.model}</p>
                            <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1">{formData.fuel} Propulsion</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-6">
                          <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                            <Wrench className="h-7 w-7 text-primary" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Assigned Protocol</p>
                            <p className="text-2xl font-black uppercase tracking-tight">
                              {formData.packageId 
                                ? servicePackages.find(p => p.id === formData.packageId)?.title 
                                : services.find(s => s.id === formData.service)?.title}
                            </p>
                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">
                              {formData.packageId ? "Bundle Module" : "Standard Procedure"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-6">
                          <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                            <Building2 className="h-7 w-7 text-primary" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Service Center</p>
                            <p className="text-2xl font-black uppercase tracking-tight">
                              {workshops.find(w => w.id === formData.workshopId)?.name || "Not Selected"}
                            </p>
                            <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1">
                              {workshops.find(w => w.id === formData.workshopId)?.address || "No Address"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-6">
                          <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                            <CalendarIcon className="h-7 w-7 text-primary" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Temporal Coordinates</p>
                            <p className="text-2xl font-black uppercase tracking-tight">{formData.date}</p>
                            <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1">@ {formData.time} IST</p>
                          </div>
                        </div>

                        <div className="pt-10 border-t border-white/10 mt-10">
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Total Settlement</p>
                              <p className="text-6xl font-black text-primary tracking-tighter">
                                ₹{(() => {
                                  const basePrice = formData.packageId 
                                    ? (servicePackages.find(p => p.id === formData.packageId)?.basePrice || 0)
                                    : (services.find(s => s.id === formData.service)?.basePrice || 0);
                                  return calculatePrice(basePrice).toLocaleString();
                                })()}
                              </p>
                            </div>
                            {useWallet && (
                              <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2">Wallet Deduction</p>
                                <p className="text-xl font-black text-emerald-500 tracking-tight">-₹{(() => {
                                  const basePrice = formData.packageId 
                                    ? (servicePackages.find(p => p.id === formData.packageId)?.basePrice || 0)
                                    : (services.find(s => s.id === formData.service)?.basePrice || 0);
                                  const total = calculatePrice(basePrice);
                                  return Math.min(total, user?.walletBalance || 0).toLocaleString();
                                })()}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-sm">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                        <Zap className="h-3 w-3 text-primary" /> Promotional Protocol
                      </h3>
                      <div className="flex gap-4">
                        <div className="relative flex-1">
                          <Input
                            placeholder="ENTER COUPON CODE"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            className="h-16 rounded-2xl bg-white border-slate-200 pl-6 font-black uppercase tracking-widest text-slate-900 placeholder:text-slate-300 focus:ring-primary/20"
                            disabled={!!appliedCoupon}
                          />
                          {appliedCoupon && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-emerald-600">
                              <Check className="h-5 w-5" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Applied</span>
                            </div>
                          )}
                        </div>
                        {appliedCoupon ? (
                          <Button 
                            variant="outline"
                            onClick={() => {
                              setAppliedCoupon(null);
                              setCouponCode("");
                            }}
                            className="h-16 px-8 rounded-2xl border-red-100 text-red-600 hover:bg-red-50 font-black uppercase tracking-widest text-[10px]"
                          >
                            Remove
                          </Button>
                        ) : (
                          <Button 
                            onClick={handleApplyCoupon}
                            className="h-16 px-8 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-slate-900/10"
                          >
                            Apply
                          </Button>
                        )}
                      </div>
                      {appliedCoupon && (
                        <p className="mt-4 text-[10px] font-bold text-emerald-600 uppercase tracking-widest ml-2">
                          {appliedCoupon.description}
                        </p>
                      )}
                    </div>

                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Transaction Gateway</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {[
                        { id: 'pay_after_service', title: 'Pay After Service', desc: 'Doorstep Settlement Protocol', icon: Clock },
                        { id: 'razorpay', title: 'Razorpay Secure', desc: 'Instant Digital Authorization', icon: ShieldCheck },
                        { id: 'paytm', title: 'Paytm Wallet', desc: 'Fast-track Mobile Payment', icon: Zap }
                      ].map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setFormData({ ...formData, paymentMethod: method.id as any })}
                          className={cn(
                            "p-8 rounded-[2.5rem] border text-left transition-all flex items-center gap-8 group w-full relative overflow-hidden",
                            formData.paymentMethod === method.id 
                              ? "border-primary bg-primary/5 shadow-2xl shadow-primary/10" 
                              : "border-slate-100 bg-white hover:border-primary/30 shadow-sm"
                          )}
                        >
                          <div className={cn(
                            "h-16 w-16 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500",
                            formData.paymentMethod === method.id ? "bg-primary text-white scale-110 shadow-xl shadow-primary/20" : "bg-slate-50 text-slate-400 group-hover:text-primary"
                          )}>
                            <method.icon className="h-8 w-8" />
                          </div>
                          <div>
                            <p className={cn(
                              "text-xl font-black uppercase tracking-tight transition-colors",
                              formData.paymentMethod === method.id ? "text-primary" : "text-slate-900"
                            )}>{method.title}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{method.desc}</p>
                          </div>
                          {formData.paymentMethod === method.id && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-auto h-10 w-10 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/20"
                            >
                              <Check className="h-6 w-6 stroke-[3]" />
                            </motion.div>
                          )}
                        </button>
                      ))}
                    </div>

                    {user && user.walletBalance > 0 && (
                      <div className={cn(
                        "p-8 rounded-[2.5rem] border transition-all flex items-center justify-between mt-6",
                        useWallet ? "bg-emerald-50 border-emerald-200 shadow-xl shadow-emerald-600/5" : "bg-slate-50 border-slate-100"
                      )}>
                        <div className="flex items-center gap-6">
                          <div className={cn(
                            "h-14 w-14 rounded-2xl flex items-center justify-center transition-colors",
                            useWallet ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "bg-white text-slate-400"
                          )}>
                            <Wallet className="h-7 w-7" />
                          </div>
                          <div>
                            <p className="text-lg font-black uppercase tracking-tight text-slate-900">Apply Wallet Credit</p>
                            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mt-1">Available: ₹{user.walletBalance.toLocaleString()}</p>
                          </div>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={useWallet}
                          onChange={(e) => setUseWallet(e.target.checked)}
                          className="h-8 w-8 rounded-xl border-emerald-200 bg-white text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-12 bg-slate-900 rounded-[3.5rem] text-white shadow-2xl shadow-black/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
                  <div className="flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
                    <div>
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Final Settlement Amount</p>
                      <h3 className="text-7xl font-black text-primary tracking-tighter">
                        ₹{(() => {
                          const pkg = servicePackages.find(p => p.id === formData.packageId);
                          const service = services.find(s => s.id === formData.service);
                          const total = pkg ? pkg.basePrice : (service ? calculatePrice(service.basePrice) : 0);
                          const final = (useWallet && user) ? Math.max(0, total - user.walletBalance) : total;
                          return final.toLocaleString();
                        })()}
                      </h3>
                    </div>
                    <div className="text-center md:text-right">
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Transmission Protocol</p>
                      <p className="text-2xl font-black uppercase tracking-tight text-white">
                        {formData.packageId 
                          ? servicePackages.find(p => p.id === formData.packageId)?.title 
                          : services.find(s => s.id === formData.service)?.title}
                      </p>
                      <div className="flex items-center gap-3 mt-4 justify-center md:justify-end text-white/60 text-sm font-bold uppercase tracking-widest">
                        <Sparkles className="h-4 w-4 text-primary" />
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

          {currentStep < 6 ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid() || user?.blocked || showVerification}
              className="h-16 px-12 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-white border-none"
            >
              Next Step <ChevronRight className="w-5 h-5 ml-3" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!isStepValid() || isSubmitting || user?.blocked || showVerification}
              className="h-16 px-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-900/20 group text-white border-none"
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
                  <span className="font-black text-slate-900 tracking-tight">{user?.phone || formData.phone}</span>
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
                    className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-white border-none" 
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

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirmation && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-[3.5rem] shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100"
              >
                <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full" />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                      <ShieldCheck className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-tight">Final Confirmation</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Review your service parameters</p>
                    </div>
                  </div>
                </div>

                <div className="p-10 space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Vehicle</p>
                        <p className="text-lg font-black text-slate-900 uppercase tracking-tight">{formData.make} {formData.model}</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{formData.fuel} Propulsion</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Service Protocol</p>
                        <p className="text-lg font-black text-slate-900 uppercase tracking-tight">
                          {formData.packageId 
                            ? servicePackages.find(p => p.id === formData.packageId)?.title 
                            : services.find(s => s.id === formData.service)?.title}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Temporal Coordinates</p>
                        <p className="text-lg font-black text-slate-900 uppercase tracking-tight">{formData.date}</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">@ {formData.time} IST</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Service Center</p>
                        <p className="text-lg font-black text-slate-900 uppercase tracking-tight">
                          {workshops.find(w => w.id === formData.workshopId)?.name || "Not Selected"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assigned Mechanic</p>
                        <p className="text-lg font-black text-slate-900 uppercase tracking-tight">
                          {technicians.find(t => t.id === formData.technicianId)?.name || "Auto Assignment"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Estimated Settlement</p>
                        <p className="text-4xl font-black text-primary tracking-tighter">
                          ₹{(() => {
                            const total = formData.packageId 
                              ? (servicePackages.find(p => p.id === formData.packageId)?.basePrice || 0)
                              : (services.find(s => s.id === formData.service) ? calculatePrice(services.find(s => s.id === formData.service)!.basePrice) : 0);
                            return total.toLocaleString();
                          })()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Payment Method</p>
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                          {formData.paymentMethod === 'pay_after_service' ? 'Pay After Service' : 
                           formData.paymentMethod === 'razorpay' ? 'Razorpay Secure' : 'Paytm Wallet'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      className="flex-1 h-16 rounded-2xl font-black uppercase tracking-widest text-xs border-slate-200" 
                      onClick={() => setShowConfirmation(false)}
                    >
                      Go Back
                    </Button>
                    <Button 
                      className="flex-1 h-16 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-white border-none" 
                      onClick={confirmSubmit}
                    >
                      Initialize Session
                    </Button>
                  </div>
                </div>
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
