import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  Car, 
  Calendar, 
  Clock, 
  Image as ImageIcon, 
  Send, 
  MapPin, 
  Activity, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck, 
  Search, 
  Wrench, 
  AlertCircle, 
  Camera, 
  Upload, 
  Navigation,
  User,
  Star,
  ChevronRight,
  Phone,
  MessageSquare,
  Zap,
  Wifi,
  Cpu,
  Navigation2
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet default icon issue
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const mechanicIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="bg-primary p-2 rounded-full shadow-lg border-2 border-white animate-pulse"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const userIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="bg-slate-900 p-2 rounded-full shadow-lg border-2 border-white"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const ServiceRequest: React.FC = () => {
  const { carMakes, carModels, services, technicians, addServiceRequest, currentUser, vehicles } = useData();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    serviceType: '',
    make: '',
    model: '',
    year: '',
    problemDescription: '',
    preferredDate: '',
    preferredTime: '',
    location: '',
    userPhone: '',
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [matchingMechanics, setMatchingMechanics] = useState(false);
  const [foundMechanics, setFoundMechanics] = useState<any[]>([]);
  const [selectedMechanic, setSelectedMechanic] = useState<any>(null);
  const [matchingStep, setMatchingStep] = useState(0);
  
  // GPS Tracking State
  const [userCoords, setUserCoords] = useState<[number, number]>([28.6139, 77.2090]); // Default Delhi
  const [mechanicCoords, setMechanicCoords] = useState<[number, number]>([28.6239, 77.2190]);
  const [distance, setDistance] = useState(2.4);
  const [eta, setEta] = useState(12);

  const matchingSteps = [
    "Analyzing technical requirements...",
    "Scanning nearby GPS coordinates...",
    "Verifying technician availability...",
    "Matching specialty expertise...",
    "Finalizing connection protocol..."
  ];

  const currentStep = selectedMechanic ? 'confirmed' : (matchingMechanics || foundMechanics.length > 0) ? 'matching' : 'request';

  // Simulate mechanic movement
  React.useEffect(() => {
    if (selectedMechanic) {
      const interval = setInterval(() => {
        setMechanicCoords(prev => {
          const latDiff = (userCoords[0] - prev[0]) * 0.05;
          const lngDiff = (userCoords[1] - prev[1]) * 0.05;
          
          const newLat = prev[0] + latDiff;
          const newLng = prev[1] + lngDiff;
          
          // Calculate new distance (rough approximation)
          const newDist = Math.sqrt(Math.pow(userCoords[0] - newLat, 2) + Math.pow(userCoords[1] - newLng, 2)) * 111;
          setDistance(Number(newDist.toFixed(2)));
          setEta(Math.ceil(newDist * 5)); // 5 mins per km
          
          return [newLat, newLng];
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedMechanic, userCoords]);

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

  const shareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords([latitude, longitude]);
        // Set mechanic slightly away
        setMechanicCoords([latitude + 0.01, longitude + 0.01]);
        setFormData(prev => ({ ...prev, location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
        toast.success('Location shared successfully!');
      }, () => {
        toast.error('Unable to retrieve your location');
      });
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('Please login to submit a service request');
      navigate('/login');
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
        userPhone: formData.userPhone,
        make: formData.make,
        model: formData.model,
        year: formData.year,
        problemDescription: formData.problemDescription,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        location: formData.location,
      });

      setIsSubmitting(false);
      setMatchingMechanics(true);
      
      // Simulate matching steps
      let step = 0;
      const stepInterval = setInterval(() => {
        step++;
        setMatchingStep(step);
        if (step >= matchingSteps.length - 1) clearInterval(stepInterval);
      }, 800);

      // Simulate finding nearby mechanics
      setTimeout(() => {
        const nearby = technicians.slice(0, 3).map(t => ({
          ...t,
          distance: (Math.random() * 5 + 1).toFixed(1) + ' km away',
          eta: Math.floor(Math.random() * 15 + 5) + ' mins'
        }));
        setFoundMechanics(nearby);
        setMatchingMechanics(false);
        clearInterval(stepInterval);
      }, 4000);

    } catch (error) {
      toast.error('Failed to submit request. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleAcceptMechanic = (mechanic: any) => {
    setSelectedMechanic(mechanic);
    toast.success(`Request accepted by ${mechanic.name}!`);
  };

  if (selectedMechanic) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-slate-100"
          >
            <div className="text-center mb-12">
              <div className="h-24 w-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-12 w-12 text-emerald-600" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Booking Confirmed!</h2>
              <p className="text-slate-500 mt-2 font-medium">Your mechanic is on the way to your location.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                  <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Assigned Mechanic
                  </h3>
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <img 
                        src={selectedMechanic.avatar || `https://picsum.photos/seed/${selectedMechanic.id}/100/100`} 
                        alt={selectedMechanic.name}
                        className="h-20 w-20 rounded-2xl object-cover shadow-lg"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-emerald-500 h-6 w-6 rounded-full border-4 border-white" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 uppercase tracking-tight text-xl">{selectedMechanic.name}</p>
                      <p className="text-primary text-xs font-black uppercase tracking-widest mt-1">{selectedMechanic.specialty}</p>
                      <div className="flex items-center gap-1 mt-2 bg-amber-100 px-2 py-0.5 rounded-full w-fit">
                        <Star className="h-3 w-3 text-amber-600 fill-amber-600" />
                        <span className="text-[10px] font-black text-amber-700">{selectedMechanic.rating || 5.0}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-8 border-t border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Distance</span>
                      <span className="text-sm font-black text-slate-900">{distance} km</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estimated Arrival</span>
                      <span className="text-sm font-black text-primary">{eta} mins</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
                  <h3 className="font-black uppercase tracking-widest text-xs mb-6 flex items-center gap-2 text-white/60">
                    <Navigation2 className="h-4 w-4 text-primary" />
                    Live Status
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <Loader2 className="h-5 w-5 text-primary animate-spin" />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest">En Route</p>
                        <p className="text-[10px] text-white/50">Mechanic has started the journey</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 opacity-40">
                      <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <Wrench className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest">Arrival</p>
                        <p className="text-[10px] text-white/50">Technician reaches your location</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 bg-slate-50 rounded-[2rem] p-4 border border-slate-100 min-h-[400px] relative overflow-hidden">
                <div className="absolute top-8 left-8 z-[1000] bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                  <div className="h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Live GPS Tracking Active</span>
                </div>
                
                <MapContainer 
                  center={userCoords} 
                  zoom={13} 
                  style={{ height: '100%', width: '100%', borderRadius: '1.5rem' }}
                  zoomControl={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={userCoords} icon={userIcon}>
                    <Popup>Your Location</Popup>
                  </Marker>
                  <Marker position={mechanicCoords} icon={mechanicIcon}>
                    <Popup>{selectedMechanic.name} is here</Popup>
                  </Marker>
                  <MapUpdater center={mechanicCoords} />
                </MapContainer>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="flex-1 rounded-2xl h-16 font-black uppercase tracking-widest text-xs flex items-center gap-2" onClick={() => navigate('/profile')}>
                <Calendar className="h-4 w-4" />
                View My Bookings
              </Button>
              <Button className="flex-1 rounded-2xl h-16 bg-slate-900 hover:bg-primary text-white font-black uppercase tracking-widest text-xs transition-all flex items-center gap-2" onClick={() => navigate('/')}>
                <CheckCircle2 className="h-4 w-4" />
                Back to Home
              </Button>
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-center gap-8">
              <button className="flex flex-col items-center gap-2 group" type="button">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  <Phone className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-600">Call</span>
              </button>
              <button className="flex flex-col items-center gap-2 group" type="button">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all text-primary">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary">Message</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const steps = [
    { id: 'request', title: 'Request', icon: Send },
    { id: 'matching', title: 'Matching', icon: Search },
    { id: 'confirmed', title: 'Confirmed', icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Activity className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Service Request Terminal</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-6"
          >
            Request <span className="text-primary">Service</span>
          </motion.h1>
          
          <div className="flex items-center justify-center mt-12 mb-8">
            {steps.map((step, idx) => {
              const isActive = step.id === currentStep;
              const isPast = steps.findIndex(s => s.id === currentStep) > idx;
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center relative">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                      isActive ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110' : 
                      isPast ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span className={`absolute -bottom-6 text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${
                      isActive ? 'text-primary' : isPast ? 'text-emerald-500' : 'text-slate-400'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="w-16 h-0.5 mx-4 bg-slate-100 relative overflow-hidden">
                      <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: isPast ? '0%' : '-100%' }}
                        className="absolute inset-0 bg-emerald-500"
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {matchingMechanics ? (
            <motion.div
              key="matching"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-[3rem] p-16 shadow-2xl border border-slate-100 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)]" />
              <div className="relative z-10">
                <div className="relative h-48 w-48 mx-auto mb-10">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-4 border-primary/10 border-t-primary rounded-full shadow-2xl shadow-primary/20"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-4 border-2 border-slate-100 border-b-emerald-500 rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white h-24 w-24 rounded-3xl shadow-xl flex items-center justify-center">
                      <Search className="h-10 w-10 text-primary animate-pulse" />
                    </div>
                  </div>
                  
                  {/* Floating data points */}
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 1, 0.3],
                        x: [0, (i % 2 === 0 ? 40 : -40)],
                        y: [0, (i < 2 ? 40 : -40)]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                      className="absolute top-1/2 left-1/2 h-2 w-2 bg-primary rounded-full"
                    />
                  ))}
                </div>
                
                <div className="space-y-6">
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Scanning Nearby Mechanics</h2>
                  
                  <div className="max-w-xs mx-auto space-y-3">
                    {matchingSteps.map((s, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ 
                          opacity: matchingStep >= i ? 1 : 0.3,
                          x: matchingStep >= i ? 0 : -10,
                          color: matchingStep === i ? '#3b82f6' : matchingStep > i ? '#10b981' : '#94a3b8'
                        }}
                        className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest"
                      >
                        {matchingStep > i ? (
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        ) : matchingStep === i ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <div className="h-3 w-3 rounded-full border border-slate-300" />
                        )}
                        {s}
                      </motion.div>
                    ))}
                  </div>

                  <div className="pt-8 flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2">
                      <Wifi className="h-4 w-4 text-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Signal: Strong</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-primary animate-spin-slow" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Processing: AI Match</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : foundMechanics.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-4">
                  <div className="h-10 w-10 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <Wrench className="h-6 w-6 text-primary" />
                  </div>
                  Available Mechanics
                </h2>
                <Badge className="bg-emerald-500 text-white font-black px-4 py-1.5 rounded-full uppercase tracking-widest text-[10px]">
                  {foundMechanics.length} Matches Found
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {foundMechanics.map((tech, idx) => (
                  <motion.div
                    key={tech.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-8 group hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center gap-8 w-full lg:w-auto">
                      <div className="relative shrink-0">
                        <img 
                          src={tech.avatar || `https://picsum.photos/seed/${tech.id}/120/120`} 
                          alt={tech.name}
                          className="h-28 w-28 rounded-[2rem] object-cover shadow-2xl group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 h-8 w-8 rounded-full border-4 border-white shadow-lg" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight group-hover:text-primary transition-colors">{tech.name}</h3>
                        <p className="text-primary font-black text-xs uppercase tracking-widest mt-1">{tech.specialty}</p>
                        <div className="flex flex-wrap items-center gap-6 mt-4">
                          <div className="flex items-center gap-2 bg-amber-50 px-3 py-1 rounded-full">
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            <span className="text-sm font-black text-amber-700">{tech.rating || 5.0}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-500">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="text-xs font-black uppercase tracking-widest">{tech.distance}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-500">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="text-xs font-black uppercase tracking-widest">ETA: {tech.eta}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full lg:w-auto">
                      <Link to={`/mechanics/${tech.id}`} className="flex-1 lg:flex-none">
                        <Button variant="outline" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] border-slate-200">
                          Profile
                        </Button>
                      </Link>
                      <Button 
                        className="flex-1 lg:flex-none h-14 px-8 rounded-2xl bg-slate-900 hover:bg-primary text-white font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-slate-200"
                        onClick={() => handleAcceptMechanic(tech)}
                      >
                        Accept Request
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex justify-center pt-8">
                <Button 
                  variant="ghost" 
                  className="text-slate-400 hover:text-primary font-black uppercase tracking-widest text-[10px]"
                  onClick={() => {
                    setFoundMechanics([]);
                    setMatchingMechanics(false);
                  }}
                >
                  Cancel and Edit Request
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border border-slate-100"
            >
              <form onSubmit={handleSubmit} className="space-y-12">
                {currentUser && vehicles.filter(v => v.userId === currentUser.uid).length > 0 && (
                  <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 mb-12">
                    <div className="flex items-center justify-between mb-6">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Quick Select Vehicle</p>
                      <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-slate-200">
                        {vehicles.filter(v => v.userId === currentUser.uid).length} Registered
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {vehicles.filter(v => v.userId === currentUser.uid).map(vehicle => (
                        <button
                          key={vehicle.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, make: vehicle.make, model: vehicle.model, year: vehicle.year }))}
                          className={`px-8 py-4 rounded-2xl border-2 transition-all flex items-center gap-4 group ${
                            formData.make === vehicle.make && formData.model === vehicle.model
                              ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105'
                              : 'bg-white border-slate-100 text-slate-600 hover:border-primary/30'
                          }`}
                        >
                          <div className={`h-8 w-8 rounded-xl flex items-center justify-center transition-colors ${
                            formData.make === vehicle.make && formData.model === vehicle.model ? 'bg-white/20 text-white' : 'bg-slate-50 text-primary group-hover:bg-primary/10'
                          }`}>
                            <Car className="h-4 w-4" />
                          </div>
                          <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-widest leading-none">{vehicle.make} {vehicle.model}</p>
                            <p className={`text-[8px] font-bold uppercase tracking-widest mt-1 ${formData.make === vehicle.make ? 'text-white/70' : 'text-slate-400'}`}>{vehicle.year} • {vehicle.licensePlate}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="md:col-span-2 space-y-6">
                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2 ml-2">
                      <Wrench className="h-3 w-3 text-primary" />
                      Select Service Type
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {services.slice(0, 9).map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => handleSelectChange('serviceType', s.id)}
                          className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 text-center group ${
                            formData.serviceType === s.id 
                              ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105' 
                              : 'bg-white border-slate-100 text-slate-600 hover:border-primary/30'
                          }`}
                        >
                          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${
                            formData.serviceType === s.id ? 'bg-white/20 text-white' : 'bg-slate-50 text-primary group-hover:bg-primary/10'
                          }`}>
                            {s.title.toLowerCase().includes('oil') ? <Activity className="h-6 w-6" /> : 
                             s.title.toLowerCase().includes('brake') ? <ShieldCheck className="h-6 w-6" /> :
                             s.title.toLowerCase().includes('engine') ? <Zap className="h-6 w-6" /> :
                             <Wrench className="h-6 w-6" />}
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest leading-tight">{s.title}</span>
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleSelectChange('serviceType', 'other')}
                        className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 text-center group ${
                          formData.serviceType === 'other' 
                            ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105' 
                            : 'bg-white border-slate-100 text-slate-600 hover:border-primary/30'
                        }`}
                      >
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${
                          formData.serviceType === 'other' ? 'bg-white/20 text-white' : 'bg-slate-50 text-primary group-hover:bg-primary/10'
                        }`}>
                          <AlertCircle className="h-6 w-6" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest leading-tight">Other / General</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2 ml-2">
                      <Car className="h-3 w-3 text-primary" />
                      Vehicle Make
                    </label>
                    <Select 
                      value={formData.make} 
                      onValueChange={(val) => {
                        handleSelectChange('make', val);
                        handleSelectChange('model', '');
                      }}
                    >
                      <SelectTrigger className="h-16 rounded-[1.5rem] border-slate-200 bg-slate-50/50 font-bold text-xs uppercase tracking-widest">
                        <SelectValue placeholder="Select make" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-slate-200">
                        {carMakes.map((make) => (
                          <SelectItem key={make.id || make.name} value={make.name} className="font-bold text-xs uppercase tracking-widest">{make.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2 ml-2">
                      <Car className="h-3 w-3 text-primary" />
                      Vehicle Model
                    </label>
                    <Select 
                      value={formData.model} 
                      onValueChange={(val) => handleSelectChange('model', val)}
                      disabled={!formData.make}
                    >
                      <SelectTrigger className="h-16 rounded-[1.5rem] border-slate-200 bg-slate-50/50 font-bold text-xs uppercase tracking-widest">
                        <SelectValue placeholder={formData.make ? "Select model" : "Select make first"} />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-slate-200">
                        {carModels
                          .filter(m => m.make === formData.make)
                          .map((model) => (
                            <SelectItem key={model.id || model.name} value={model.name} className="font-bold text-xs uppercase tracking-widest">{model.name}</SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2 ml-2">
                      <Calendar className="h-3 w-3 text-primary" />
                      Vehicle Year
                    </label>
                    <Input 
                      name="year"
                      type="number"
                      placeholder="e.g. 2022"
                      value={formData.year}
                      onChange={handleInputChange}
                      className="h-16 rounded-[1.5rem] border-slate-200 bg-slate-50/50 font-bold text-xs uppercase tracking-widest"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2 ml-2">
                      <Phone className="h-3 w-3 text-primary" />
                      Contact Number
                    </label>
                    <Input 
                      name="userPhone"
                      type="tel"
                      placeholder="e.g. +1 234 567 890"
                      value={formData.userPhone}
                      onChange={handleInputChange}
                      className="h-16 rounded-[1.5rem] border-slate-200 bg-slate-50/50 font-bold text-xs uppercase tracking-widest"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2 ml-2">
                    <AlertCircle className="h-3 w-3 text-primary" />
                    Describe the Issue
                  </label>
                  <Textarea 
                    name="problemDescription"
                    placeholder="Tell us about the symptoms, noises, or warnings you're experiencing..."
                    value={formData.problemDescription}
                    onChange={handleInputChange}
                    className="min-h-[160px] rounded-[2rem] border-slate-200 bg-slate-50/50 resize-none p-6 font-medium focus:ring-4 focus:ring-primary/5 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2 ml-2">
                      <Calendar className="h-3 w-3 text-primary" />
                      Preferred Date
                    </label>
                    <Input 
                      name="preferredDate"
                      type="date"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      className="h-16 rounded-[1.5rem] border-slate-200 bg-slate-50/50 font-bold text-xs uppercase tracking-widest"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2 ml-2">
                      <Clock className="h-3 w-3 text-primary" />
                      Preferred Time
                    </label>
                    <Input 
                      name="preferredTime"
                      type="time"
                      value={formData.preferredTime}
                      onChange={handleInputChange}
                      className="h-16 rounded-[1.5rem] border-slate-200 bg-slate-50/50 font-bold text-xs uppercase tracking-widest"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2 ml-2">
                    <MapPin className="h-3 w-3 text-primary" />
                    Service Location
                  </label>
                  <div className="flex gap-3">
                    <Input 
                      name="location"
                      placeholder="Enter address or share current location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="h-16 rounded-[1.5rem] border-slate-200 bg-slate-50/50 font-bold text-xs uppercase tracking-widest"
                    />
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={shareLocation}
                      className="h-16 w-16 rounded-[1.5rem] border-slate-200 hover:bg-primary hover:text-white transition-all shrink-0 shadow-sm"
                    >
                      <Navigation className="h-6 w-6" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2 ml-2">
                    <Camera className="h-3 w-3 text-primary" />
                    Visual Documentation
                  </label>
                  <div className="border-4 border-dashed border-slate-100 rounded-[2.5rem] p-12 text-center hover:border-primary/30 transition-all cursor-pointer bg-slate-50/30 relative group">
                    <input 
                      type="file" 
                      multiple 
                      onChange={handlePhotoUpload} 
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="h-20 w-20 bg-white rounded-[1.5rem] shadow-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                      <Upload className="h-8 w-8 text-slate-400 group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-slate-900 font-black uppercase tracking-widest text-xs">Drop photos or click to upload</p>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">JPG, PNG (Max 10MB per file)</p>
                    
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

                <div className="pt-10">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-24 rounded-[2rem] bg-slate-900 hover:bg-primary text-white text-xl font-black uppercase tracking-[0.2em] transition-all shadow-2xl shadow-slate-300 hover:shadow-primary/30 active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-4">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        Transmitting...
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        Transmit Request
                        <Send className="h-6 w-6" />
                      </div>
                    )}
                  </Button>
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <div className="h-px bg-slate-100 flex-1" />
                    <p className="text-slate-400 text-[10px] uppercase tracking-[0.3em] font-black">
                      Secure Technical Protocol
                    </p>
                    <div className="h-px bg-slate-100 flex-1" />
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: ShieldCheck, title: "Verified Experts", desc: "All mechanics are background checked and certified.", color: "blue" },
            { icon: Clock, title: "Fast Response", desc: "Get matched with a mechanic in under 5 minutes.", color: "amber" },
            { icon: MapPin, title: "Real-time Tracking", desc: "Track your mechanic's location in real-time.", color: "emerald" }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + (i * 0.1) }}
              className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col items-center text-center gap-6 group hover:border-primary/20 transition-all"
            >
              <div className={`h-16 w-16 bg-${feature.color}-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                <feature.icon className={`h-8 w-8 text-${feature.color}-600`} />
              </div>
              <div>
                <h4 className="font-black text-slate-900 uppercase tracking-tighter text-lg mb-2">{feature.title}</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceRequest;
