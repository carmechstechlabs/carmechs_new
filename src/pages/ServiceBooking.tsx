import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useData, Service, Appointment } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Clock, Car, MapPin, CreditCard, CheckCircle2, ArrowRight, ArrowLeft, Loader2, Sparkles, ShieldCheck, Wrench, Star } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

import AddressInput from '@/components/AddressInput';

const steps = [
  { id: 'vehicle', title: 'Vehicle', description: 'Select your car' },
  { id: 'service', title: 'Service', description: 'Choose maintenance' },
  { id: 'mechanic', title: 'Mechanic', description: 'Expert technician' },
  { id: 'schedule', title: 'Schedule', description: 'Pick date & time' },
  { id: 'payment', title: 'Payment', description: 'Secure checkout' },
];

const defaultTimeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", 
  "05:00 PM", "06:00 PM"
];

export default function ServiceBooking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { services, currentUser, vehicles, addAppointment, servicePackages, technicians } = useData();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [bookingData, setBookingData] = useState({
    vehicleId: '',
    serviceId: searchParams.get('serviceId') || '',
    packageId: searchParams.get('packageId') || '',
    technicianId: '',
    date: new Date(),
    time: '',
    paymentMethod: 'pay_after_service' as Appointment['paymentMethod'],
    location: '',
  });

  const selectedService = services.find(s => s.id === bookingData.serviceId);
  const selectedPackage = servicePackages.find(p => p.id === bookingData.packageId);
  const selectedVehicle = vehicles.find(v => v.id === bookingData.vehicleId);
  const selectedTechnician = technicians.find(t => t.id === bookingData.technicianId);

  const getAvailableTimeSlots = () => {
    if (!bookingData.technicianId) return defaultTimeSlots;
    
    const tech = technicians.find(t => t.id === bookingData.technicianId);
    if (!tech || !tech.availabilitySchedule) return defaultTimeSlots;
    
    const date = bookingData.date;
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[date.getDay()];
    
    const dayConfig = tech.availabilitySchedule[dayName];
    if (!dayConfig || !dayConfig.enabled) return [];
    
    return dayConfig.slots;
  };

  const availableSlots = getAvailableTimeSlots();

  const totalPrice = selectedPackage ? selectedPackage.basePrice : (selectedService ? selectedService.basePrice : 0);

  const handleNext = () => {
    if (currentStep === 0 && !bookingData.vehicleId) {
      toast.error("Please select a vehicle");
      return;
    }
    if (currentStep === 1 && !bookingData.serviceId && !bookingData.packageId) {
      toast.error("Please select a service or package");
      return;
    }
    if (currentStep === 2 && !bookingData.technicianId) {
      toast.error("Please select a mechanic");
      return;
    }
    if (currentStep === 3 && (!bookingData.date || !bookingData.time || !bookingData.location)) {
      toast.error("Please select date, time and location");
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      toast.error("Please login to book a service");
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      const appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'status' | 'priority'> = {
        name: currentUser.displayName || 'User',
        email: currentUser.email || '',
        phone: '', // Should be fetched from profile
        service: selectedPackage ? selectedPackage.title : (selectedService ? selectedService.title : 'Custom Service'),
        serviceId: bookingData.packageId || bookingData.serviceId,
        make: selectedVehicle?.make || 'Unknown',
        model: selectedVehicle?.model || 'Unknown',
        fuel: selectedVehicle?.fuelType || 'Petrol',
        date: format(bookingData.date, 'yyyy-MM-dd'),
        time: bookingData.time,
        userId: currentUser.uid,
        paymentMethod: bookingData.paymentMethod,
        amount: totalPrice,
        locationName: bookingData.location,
        technicianId: bookingData.technicianId,
      };

      await addAppointment(appointmentData);
      setIsSuccess(true);
      toast.success("Service booked successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to book service. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md mx-auto bg-card border border-border p-12 rounded-[3rem] shadow-2xl"
        >
          <div className="h-24 w-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          </div>
          <h1 className="text-4xl font-bold tracking-tighter mb-4">Booking Confirmed!</h1>
          <p className="text-muted-foreground mb-10 leading-relaxed">
            Your service for <span className="text-foreground font-bold">{selectedVehicle?.make} {selectedVehicle?.model}</span> has been scheduled for <span className="text-foreground font-bold">{format(bookingData.date, 'PPP')}</span> at <span className="text-foreground font-bold">{bookingData.time}</span>.
          </p>
          <div className="space-y-4">
            <Button 
              className="w-full h-14 rounded-2xl bg-primary font-bold text-lg shadow-lg shadow-primary/20"
              onClick={() => navigate("/profile")}
            >
              View My Bookings
            </Button>
            <Button 
              variant="ghost" 
              className="w-full h-14 rounded-2xl font-bold text-muted-foreground hover:text-foreground"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter mb-4">Book Your Service</h1>
        <p className="text-muted-foreground">Premium automotive care in just a few steps</p>
      </div>

      {/* Stepper */}
      <div className="flex justify-between mb-16 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 z-0" />
        {steps.map((step, index) => (
          <div key={step.id} className="relative z-10 flex flex-col items-center group">
            <div 
              className={`h-12 w-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-500 ${
                index <= currentStep ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'bg-card border border-border text-muted-foreground'
              }`}
            >
              {index < currentStep ? <CheckCircle2 className="h-6 w-6" /> : index + 1}
            </div>
            <div className="absolute top-16 text-center whitespace-nowrap">
              <p className={`text-sm font-bold ${index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>{step.title}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-50">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Car className="h-6 w-6 text-primary" />
                    Select Your Vehicle
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {vehicles.length > 0 ? (
                      vehicles.map((vehicle) => (
                        <div 
                          key={vehicle.id}
                          onClick={() => setBookingData({ ...bookingData, vehicleId: vehicle.id })}
                          className={`p-6 rounded-3xl border-2 transition-all cursor-pointer group ${
                            bookingData.vehicleId === vehicle.id 
                              ? 'border-primary bg-primary/5 shadow-xl' 
                              : 'border-border hover:border-primary/30 bg-card'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-colors ${
                              bookingData.vehicleId === vehicle.id ? 'bg-primary text-white' : 'bg-accent text-primary'
                            }`}>
                              <Car className="h-6 w-6" />
                            </div>
                            {bookingData.vehicleId === vehicle.id && (
                              <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                                <CheckCircle2 className="h-4 w-4 text-white" />
                              </div>
                            )}
                          </div>
                          <h3 className="text-xl font-bold">{vehicle.make} {vehicle.model}</h3>
                          <p className="text-sm text-muted-foreground font-mono uppercase tracking-widest mt-1">{vehicle.licensePlate}</p>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-12 text-center bg-accent/20 rounded-3xl border-2 border-dashed border-border">
                        <p className="text-muted-foreground font-medium mb-4">No vehicles found in your profile.</p>
                        <Button variant="outline" onClick={() => navigate("/profile")} className="rounded-xl font-bold">
                          Add Vehicle
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Sparkles className="h-6 w-6 text-primary" />
                    Select Service
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {services.map((service) => (
                      <div 
                        key={service.id}
                        onClick={() => setBookingData({ ...bookingData, serviceId: service.id, packageId: '' })}
                        className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                          bookingData.serviceId === service.id 
                            ? 'border-primary bg-primary/5 shadow-xl' 
                            : 'border-border hover:border-primary/30 bg-card'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                            bookingData.serviceId === service.id ? 'bg-primary text-white' : 'bg-accent text-primary'
                          }`}>
                            <CalendarIcon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-bold">{service.title}</h3>
                            <p className="text-sm text-muted-foreground">{service.duration}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-primary">{service.price}</p>
                          {bookingData.serviceId === service.id && (
                            <Badge className="bg-primary text-white border-none mt-1">Selected</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Wrench className="h-6 w-6 text-primary" />
                    Select Mechanic
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {technicians.map((tech) => (
                      <div 
                        key={tech.id}
                        onClick={() => setBookingData({ ...bookingData, technicianId: tech.id })}
                        className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                          bookingData.technicianId === tech.id 
                            ? 'border-primary bg-primary/5 shadow-xl' 
                            : 'border-border hover:border-primary/30 bg-card'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <img src={tech.avatar} alt={tech.name} className="h-16 w-16 rounded-2xl object-cover border-2 border-border" />
                          <div>
                            <h3 className="font-bold text-lg">{tech.name}</h3>
                            <p className="text-sm text-primary font-bold">{tech.specialty}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center text-amber-500">
                                <Star className="h-3 w-3 fill-current" />
                                <span className="text-xs font-bold ml-1">{tech.rating}</span>
                              </div>
                              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">• {tech.experience} Exp</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={tech.status === 'available' ? 'default' : 'secondary'} className="rounded-lg">
                            {tech.status}
                          </Badge>
                          {bookingData.technicianId === tech.id && (
                            <div className="mt-2 flex justify-end">
                              <CheckCircle2 className="h-6 w-6 text-primary" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Clock className="h-6 w-6 text-primary" />
                    Schedule Service
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Select Date</label>
                      <div className="p-4 bg-card border border-border rounded-3xl shadow-sm">
                        <Calendar
                          mode="single"
                          selected={bookingData.date}
                          onSelect={(date) => date && setBookingData({ ...bookingData, date })}
                          disabled={(date) => date < new Date() || date.getDay() === 0}
                          className="rounded-2xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-4">
                        <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Select Time Slot</label>
                        {availableSlots.length > 0 ? (
                          <div className="grid grid-cols-3 gap-3">
                            {availableSlots.map((slot) => (
                              <button
                                key={slot}
                                onClick={() => setBookingData({ ...bookingData, time: slot })}
                                className={`py-3 rounded-xl text-sm font-bold transition-all border-2 ${
                                  bookingData.time === slot 
                                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                                    : 'bg-card border-border hover:border-primary/30 text-foreground'
                                }`}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="p-8 rounded-2xl bg-amber-50 border border-amber-100 text-center">
                            <Clock className="h-8 w-8 text-amber-500 mx-auto mb-3" />
                            <p className="text-sm font-bold text-amber-700">No slots available for this date.</p>
                            <p className="text-xs text-amber-600 mt-1">Please try another date or technician.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Service Location</label>
                      <AddressInput
                        value={bookingData.location}
                        onChange={(value) => setBookingData({ ...bookingData, location: value })}
                        placeholder="Enter pickup address"
                        className="w-full bg-accent/50 border border-border rounded-2xl pl-12 pr-4 py-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <CreditCard className="h-6 w-6 text-primary" />
                    Payment Method
                  </h2>

                  <div className="grid grid-cols-1 gap-4">
                    <div 
                      onClick={() => setBookingData({ ...bookingData, paymentMethod: 'pay_after_service' })}
                      className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                        bookingData.paymentMethod === 'pay_after_service' 
                          ? 'border-primary bg-primary/5 shadow-xl' 
                          : 'border-border hover:border-primary/30 bg-card'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                          bookingData.paymentMethod === 'pay_after_service' ? 'bg-primary text-white' : 'bg-accent text-primary'
                        }`}>
                          <Clock className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-bold">Pay After Service</h3>
                          <p className="text-sm text-muted-foreground">Cash or UPI after work is done</p>
                        </div>
                      </div>
                      {bookingData.paymentMethod === 'pay_after_service' && (
                        <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>

                    <div 
                      onClick={() => setBookingData({ ...bookingData, paymentMethod: 'razorpay' })}
                      className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                        bookingData.paymentMethod === 'razorpay' 
                          ? 'border-primary bg-primary/5 shadow-xl' 
                          : 'border-border hover:border-primary/30 bg-card'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                          bookingData.paymentMethod === 'razorpay' ? 'bg-primary text-white' : 'bg-accent text-primary'
                        }`}>
                          <CreditCard className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-bold">Online Payment</h3>
                          <p className="text-sm text-muted-foreground">Credit/Debit Card, UPI, Net Banking</p>
                        </div>
                      </div>
                      {bookingData.paymentMethod === 'razorpay' && (
                        <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 space-y-4">
                    <div className="flex items-center gap-3 text-primary">
                      <ShieldCheck className="h-5 w-5" />
                      <p className="text-sm font-bold uppercase tracking-widest">Secure Checkout Guarantee</p>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Your payment information is encrypted and secure. We use industry-standard security protocols to protect your data.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-12">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="h-14 px-8 rounded-2xl font-bold text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back
                </Button>
                
                {currentStep < steps.length - 1 ? (
                  <Button
                    onClick={handleNext}
                    className="h-14 px-12 rounded-2xl bg-primary font-bold text-lg shadow-lg shadow-primary/20 group"
                  >
                    Continue
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="h-14 px-12 rounded-2xl bg-primary font-bold text-lg shadow-lg shadow-primary/20"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Confirm Booking"
                    )}
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1">
          <Card className="rounded-[2.5rem] border-border shadow-2xl sticky top-8 overflow-hidden">
            <div className="bg-primary px-8 py-6 text-white">
              <h3 className="text-xl font-bold tracking-tight">Booking Summary</h3>
            </div>
            <CardContent className="p-8 space-y-8">
              {selectedVehicle && (
                <div className="space-y-2">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Vehicle</p>
                  <div className="flex items-center gap-3">
                    <Car className="h-5 w-5 text-primary" />
                    <span className="font-bold">{selectedVehicle.make} {selectedVehicle.model}</span>
                  </div>
                </div>
              )}

              {(selectedService || selectedPackage) && (
                <div className="space-y-2">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Service</p>
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span className="font-bold">{selectedPackage?.title || selectedService?.title}</span>
                  </div>
                </div>
              )}

              {selectedTechnician && (
                <div className="space-y-2">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Mechanic</p>
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full overflow-hidden">
                      <img src={selectedTechnician.avatar} alt="" className="h-full w-full object-cover" />
                    </div>
                    <span className="font-bold">{selectedTechnician.name}</span>
                  </div>
                </div>
              )}

              {bookingData.time && (
                <div className="space-y-2">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Schedule</p>
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    <span className="font-bold">{format(bookingData.date, 'PPP')} at {bookingData.time}</span>
                  </div>
                </div>
              )}

              <div className="pt-8 border-t border-border space-y-4">
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Service Base Price</span>
                  <span className="font-mono">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Pickup & Drop</span>
                  <span className="text-emerald-500 font-bold uppercase text-xs tracking-widest">Free</span>
                </div>
                <div className="flex justify-between items-center text-2xl font-bold pt-4">
                  <span>Total</span>
                  <span className="text-primary">₹{totalPrice}</span>
                </div>
              </div>

              <div className="bg-accent/30 p-4 rounded-2xl flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <p className="text-xs text-muted-foreground font-medium">
                  Price includes all taxes and service charges.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
