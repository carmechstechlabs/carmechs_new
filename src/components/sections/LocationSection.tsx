import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Clock, ExternalLink, Map, Navigation, Phone, Mail, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useData } from '@/context/DataContext';
import { cn } from '@/lib/utils';

interface LocationSectionProps {
  title?: string;
  content?: string;
}

export function LocationSection({ title, content }: LocationSectionProps) {
  const { locations, settings } = useData();
  const [selectedLocation, setSelectedLocation] = useState(locations[0] || null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (locations.length > 0 && !selectedLocation) {
      setSelectedLocation(locations[0]);
    }
  }, [locations, selectedLocation]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  const findNearest = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoords({ lat: latitude, lng: longitude });
          
          let nearest = locations[0];
          let minDistance = calculateDistance(latitude, longitude, locations[0].latitude, locations[0].longitude);

          locations.forEach((loc) => {
            const dist = calculateDistance(latitude, longitude, loc.latitude, loc.longitude);
            if (dist < minDistance) {
              minDistance = dist;
              nearest = loc;
            }
          });

          setSelectedLocation(nearest);
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocating(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setIsLocating(false);
    }
  };

  if (!selectedLocation) return null;

  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
              Our Network
            </div>
            <h2 className="text-4xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-6">
              {title || "Find Your Nearest Workshop"}
            </h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">
              {content || "With a growing network of premium workshops across India, we are always close to your vehicle."}
            </p>
          </div>
          <Button 
            onClick={findNearest}
            disabled={isLocating}
            className="h-16 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs border-none shadow-xl shadow-primary/20 group"
          >
            {isLocating ? "Locating..." : "Find Nearest Workshop"} <Navigation className="ml-2 h-4 w-4 group-hover:rotate-45 transition-transform" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Location List */}
          <div className="lg:col-span-4 space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
            {locations.map((loc) => (
              <motion.div
                key={loc.id}
                whileHover={{ x: 5 }}
                onClick={() => setSelectedLocation(loc)}
                className={cn(
                  "p-6 rounded-3xl border cursor-pointer transition-all duration-300",
                  selectedLocation.id === loc.id 
                    ? "bg-white border-primary shadow-xl shadow-primary/5" 
                    : "bg-white/50 border-slate-100 hover:border-slate-200"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">{loc.name}</h3>
                  {loc.isPopular && (
                    <span className="text-[8px] font-black uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded-full">Popular</span>
                  )}
                </div>
                <p className="text-sm text-slate-500 font-medium line-clamp-1 mb-4">{loc.address}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{loc.city}</span>
                  <ChevronRight className={cn("h-4 w-4 transition-transform", selectedLocation.id === loc.id ? "text-primary translate-x-1" : "text-slate-300")} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Selected Location Detail */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedLocation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <div className="space-y-6">
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">{selectedLocation.name}</h3>
                      <p className="text-slate-500 font-medium">{selectedLocation.address}, {selectedLocation.city}</p>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                          <Phone className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Call Us</p>
                          <p className="text-sm font-bold text-slate-900">{selectedLocation.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                          <Mail className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Email Us</p>
                          <p className="text-sm font-bold text-slate-900">{selectedLocation.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                          <Clock className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Working Hours</p>
                          <p className="text-sm font-bold text-slate-900">{selectedLocation.workingHours}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex gap-4">
                      <Button className="flex-1 h-14 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[10px]">
                        Get Directions
                      </Button>
                      <Button variant="outline" className="h-14 px-6 rounded-xl border-slate-200">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="relative h-full min-h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200">
                  {/* Google Maps Iframe */}
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={selectedLocation.googleMapsUrl || `https://www.google.com/maps/embed/v1/place?key=${settings.googleMapsApiKey || ''}&q=${encodeURIComponent(selectedLocation.address + ', ' + selectedLocation.city)}`}
                    className="absolute inset-0"
                  ></iframe>
                  
                  <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">{selectedLocation.city}</p>
                        <p className="text-lg font-bold text-slate-900">Active Workshop</p>
                      </div>
                      <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
