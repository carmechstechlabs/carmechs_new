import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { motion } from 'motion/react';
import { Car, Wrench, Calendar, Clock, MapPin, Send, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const ServiceRequest = () => {
  const { addServiceRequest, currentUser, carMakes, carModels, fuelTypes } = useData();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    fuelType: '',
    problemDescription: '',
    preferredDate: '',
    preferredTime: '',
    location: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Please login to submit a service request');
      navigate('/login');
      return;
    }

    if (!formData.make || !formData.model || !formData.problemDescription || !formData.preferredDate || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      addServiceRequest({
        userId: currentUser.uid,
        userName: currentUser.displayName || 'User',
        userPhone: '', // Should ideally be from user profile
        make: formData.make,
        model: formData.model,
        year: formData.year,
        problemDescription: formData.problemDescription,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        location: formData.location
      });
      
      setIsSubmitted(true);
      toast.success('Service request submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-24 pb-12 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="rounded-[3rem] border-slate-200 shadow-2xl overflow-hidden bg-white p-12 text-center">
            <div className="h-24 w-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">Request Sent!</h2>
            <p className="text-slate-500 mb-10 leading-relaxed">
              Your service request has been broadcasted to our expert mechanics. You'll receive a notification as soon as a mechanic accepts your request.
            </p>
            <div className="space-y-4">
              <Button onClick={() => navigate('/profile')} className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-primary text-white font-bold uppercase tracking-wider transition-all">
                View My Requests
              </Button>
              <Button onClick={() => setIsSubmitted(false)} variant="outline" className="w-full h-14 rounded-2xl border-slate-200 font-bold uppercase tracking-wider">
                Submit Another
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight mb-4"
          >
            Submit a <span className="text-primary">Service Request</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg"
          >
            Describe your car problem and our expert mechanics will get back to you with quotes.
          </motion.p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vehicle Details */}
            <Card className="rounded-[2.5rem] border-slate-200 shadow-sm bg-white overflow-hidden">
              <div className="bg-slate-900 px-8 py-6 flex items-center gap-4">
                <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-white">
                  <Car className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">Vehicle Details</h3>
              </div>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Car Make</label>
                  <Select onValueChange={(val) => setFormData({...formData, make: val})}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-200">
                      <SelectValue placeholder="Select Make" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {carMakes.map(make => (
                        <SelectItem key={make.id || make.name} value={make.name}>{make.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Car Model</label>
                  <Select onValueChange={(val) => setFormData({...formData, model: val})}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-200">
                      <SelectValue placeholder="Select Model" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {carModels.filter(m => m.make === formData.make).map(model => (
                        <SelectItem key={model.id || model.name} value={model.name}>{model.name}</SelectItem>
                      ))}
                      {carModels.filter(m => m.make === formData.make).length === 0 && (
                        <SelectItem value="other">Other Model</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Year</label>
                    <Input 
                      placeholder="e.g., 2022" 
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: e.target.value})}
                      className="h-12 rounded-xl border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fuel Type</label>
                    <Select onValueChange={(val) => setFormData({...formData, fuelType: val})}>
                      <SelectTrigger className="h-12 rounded-xl border-slate-200">
                        <SelectValue placeholder="Fuel" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {fuelTypes.map(fuel => (
                          <SelectItem key={fuel.id || fuel.name} value={fuel.name}>{fuel.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Details */}
            <Card className="rounded-[2.5rem] border-slate-200 shadow-sm bg-white overflow-hidden">
              <div className="bg-slate-900 px-8 py-6 flex items-center gap-4">
                <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-white">
                  <Wrench className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">Service Details</h3>
              </div>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Problem Description</label>
                  <Textarea 
                    placeholder="Describe the issue you're facing with your car..." 
                    value={formData.problemDescription}
                    onChange={(e) => setFormData({...formData, problemDescription: e.target.value})}
                    className="rounded-2xl min-h-[120px] border-slate-200 resize-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preferred Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input 
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                        className="pl-10 h-12 rounded-xl border-slate-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preferred Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input 
                        type="time"
                        value={formData.preferredTime}
                        onChange={(e) => setFormData({...formData, preferredTime: e.target.value})}
                        className="pl-10 h-12 rounded-xl border-slate-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location / Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      placeholder="Your current location or workshop preference" 
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="pl-10 h-12 rounded-xl border-slate-200"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 shrink-0">
                <AlertCircle className="h-5 w-5" />
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                By submitting this request, you agree to share your vehicle details and problem description with our network of mechanics.
              </p>
            </div>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full md:w-auto h-14 px-12 rounded-2xl bg-slate-900 hover:bg-primary text-white font-bold uppercase tracking-wider transition-all shadow-lg shadow-slate-200"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceRequest;
