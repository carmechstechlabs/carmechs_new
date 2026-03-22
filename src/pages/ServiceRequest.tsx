import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Car, Calendar, Clock, Image as ImageIcon, Send, MapPin, Activity, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const ServiceRequest: React.FC = () => {
  const { carMakes, carModels, fuelTypes, addServiceRequest, currentUser } = useData();
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    problemDescription: '',
    preferredDate: '',
    preferredTime: '',
    location: '',
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('Please login to submit a service request');
      return;
    }

    if (!formData.make || !formData.model || !formData.problemDescription) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      addServiceRequest({
        userId: currentUser.uid,
        userName: currentUser.displayName || 'User',
        userPhone: '', 
        ...formData,
      });

      toast.success('Service request submitted successfully!');
      setFormData({
        make: '',
        model: '',
        year: '',
        problemDescription: '',
        preferredDate: '',
        preferredTime: '',
        location: '',
      });
      setPhotos([]);
    } catch (error) {
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const shareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({ ...prev, location: `${latitude}, ${longitude}` }));
        toast.success('Location shared successfully!');
      }, () => {
        toast.error('Unable to retrieve your location');
      });
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-2">
              <Activity className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Diagnostic Terminal</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-foreground leading-none">
              Request <br /><span className="text-primary">Service</span>
            </h1>
            <p className="text-muted-foreground font-medium max-w-xl mx-auto">
              Provide your vehicle parameters and issue description. Our expert mechs will analyze and provide a technical quote.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="border-border bg-card shadow-2xl rounded-[3rem] overflow-hidden">
                <CardHeader className="bg-accent/30 border-b border-border p-10">
                  <CardTitle className="flex items-center gap-3 text-2xl font-black uppercase tracking-tighter text-foreground">
                    <Car className="text-primary" />
                    Vehicle Parameters
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-10">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Manufacturer</label>
                        <Select onValueChange={(val) => handleSelectChange('make', val)} value={formData.make}>
                          <SelectTrigger className="h-14 rounded-2xl bg-accent/50 border-border font-bold text-xs uppercase tracking-widest">
                            <SelectValue placeholder="Select Make" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-border">
                            {carMakes.map(make => (
                              <SelectItem key={make.id} value={make.name} className="font-bold text-xs uppercase tracking-widest">{make.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Model</label>
                        <Select onValueChange={(val) => handleSelectChange('model', val)} value={formData.model} disabled={!formData.make}>
                          <SelectTrigger className="h-14 rounded-2xl bg-accent/50 border-border font-bold text-xs uppercase tracking-widest">
                            <SelectValue placeholder="Select Model" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-border">
                            {carModels.filter(m => m.make === formData.make).map(model => (
                              <SelectItem key={model.id} value={model.name} className="font-bold text-xs uppercase tracking-widest">{model.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Manufacturing Year</label>
                        <Input 
                          name="year" 
                          placeholder="e.g. 2022" 
                          value={formData.year} 
                          onChange={handleInputChange}
                          className="h-14 rounded-2xl bg-accent/50 border-border font-bold text-xs uppercase tracking-widest"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Service Location</label>
                        <div className="flex gap-2">
                          <Input 
                            name="location" 
                            placeholder="Address or Coordinates" 
                            value={formData.location} 
                            onChange={handleInputChange}
                            className="h-14 rounded-2xl bg-accent/50 border-border font-bold text-xs uppercase tracking-widest"
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="icon" 
                            onClick={shareLocation}
                            className="h-14 w-14 shrink-0 rounded-2xl border-border bg-accent/50 hover:bg-primary/10 hover:text-primary transition-all"
                            title="Share current location"
                          >
                            <MapPin size={20} />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Issue Description</label>
                      <Textarea 
                        name="problemDescription" 
                        placeholder="Describe the symptoms, noises, or warnings..." 
                        value={formData.problemDescription} 
                        onChange={handleInputChange}
                        className="min-h-[150px] rounded-3xl bg-accent/50 border-border font-medium p-6 focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Preferred Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                          <Input 
                            name="preferredDate" 
                            type="date" 
                            value={formData.preferredDate} 
                            onChange={handleInputChange}
                            className="h-14 pl-12 rounded-2xl bg-accent/50 border-border font-bold text-xs uppercase tracking-widest"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Preferred Time</label>
                        <div className="relative">
                          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                          <Input 
                            name="preferredTime" 
                            type="time" 
                            value={formData.preferredTime} 
                            onChange={handleInputChange}
                            className="h-14 pl-12 rounded-2xl bg-accent/50 border-border font-bold text-xs uppercase tracking-widest"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Visual Documentation</label>
                      <div className="border-2 border-dashed border-border rounded-[2rem] p-12 text-center hover:border-primary/50 transition-all cursor-pointer relative group bg-accent/20">
                        <input 
                          type="file" 
                          multiple 
                          onChange={handlePhotoUpload} 
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <div className="space-y-4">
                          <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                            <ImageIcon className="text-primary" size={32} />
                          </div>
                          <div>
                            <p className="text-sm font-black uppercase tracking-widest text-foreground">Drop images or click to browse</p>
                            <p className="text-xs text-muted-foreground font-medium mt-1">Upload photos of the damaged area or warning lights.</p>
                          </div>
                        </div>
                        {photos.length > 0 && (
                          <div className="mt-8 flex flex-wrap gap-3 justify-center">
                            {photos.map((photo, i) => (
                              <div key={i} className="bg-primary/10 text-primary text-[10px] px-4 py-2 rounded-full font-black uppercase tracking-widest border border-primary/20">
                                {photo.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full h-20 bg-primary hover:bg-primary/90 text-white text-lg font-black uppercase tracking-widest rounded-[2rem] shadow-2xl shadow-primary/20 border-none"
                    >
                      {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                        <div className="flex items-center gap-3">
                          Transmit Request <Send size={20} />
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="border-border bg-card shadow-xl rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-8 pb-4">
                  <h4 className="text-sm font-black uppercase tracking-widest text-foreground">Guidelines</h4>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-6">
                  {[
                    { title: "Clear Photos", desc: "Take photos in good lighting for better diagnosis." },
                    { title: "Detail Symptoms", desc: "Mention any specific noises or behaviors." },
                    { title: "Location Accuracy", desc: "Ensure your address is correct for pick-up." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="h-8 w-8 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs font-black uppercase tracking-widest text-foreground mb-1">{item.title}</div>
                        <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-border bg-slate-900 dark:bg-slate-950 shadow-xl rounded-[2.5rem] overflow-hidden text-white">
                <CardContent className="p-8 space-y-6">
                  <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black uppercase tracking-tighter mb-2">Secure Processing</h4>
                    <p className="text-xs text-white/60 font-medium leading-relaxed">
                      Your data is encrypted and handled by certified technical advisors only.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ServiceRequest;
