import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MapPin, Clock, Award, ChevronRight, Search, Filter, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const Mechanics = () => {
  const { technicians, workshops, nearbyWorkshops, userLocation, findNearbyWorkshops } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [showNearbyOnly, setShowNearbyOnly] = useState(false);

  const specialties = ['All', ...Array.from(new Set(technicians.map(t => t.specialty)))];

  const filteredMechanics = technicians.filter(tech => {
    const matchesSearch = tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tech.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || tech.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const displayList = showNearbyOnly ? nearbyWorkshops : filteredMechanics;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight mb-4"
          >
            {showNearbyOnly ? 'Nearby' : 'Our Expert'} <span className="text-primary">{showNearbyOnly ? 'Workshops' : 'Mechanics'}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg max-w-2xl mx-auto"
          >
            {showNearbyOnly 
              ? 'Find the closest certified service centers to your current location for immediate assistance.'
              : 'Choose from our highly skilled and certified technicians to get the best care for your luxury vehicle.'}
          </motion.p>
          
          <div className="mt-8 flex justify-center gap-4">
            <Button 
              onClick={() => setShowNearbyOnly(false)}
              variant={!showNearbyOnly ? "default" : "outline"}
              className="rounded-full px-8"
            >
              All Mechanics
            </Button>
            <Button 
              onClick={() => {
                setShowNearbyOnly(true);
                findNearbyWorkshops();
              }}
              variant={showNearbyOnly ? "default" : "outline"}
              className="rounded-full px-8 flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              Find Nearby
            </Button>
          </div>
        </div>

        {!showNearbyOnly && (
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search by name or specialty..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 rounded-2xl border-slate-200 bg-white shadow-sm"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
              {specialties.map((spec) => (
                <Button
                  key={spec}
                  variant={selectedSpecialty === spec ? "default" : "outline"}
                  onClick={() => setSelectedSpecialty(spec)}
                  className="rounded-full px-6 whitespace-nowrap"
                >
                  {spec}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {showNearbyOnly ? (
              nearbyWorkshops.map((workshop, index) => (
                <motion.div
                  key={workshop.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="rounded-[2.5rem] border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 overflow-hidden bg-white group h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={workshop.logoUrl || `https://picsum.photos/seed/${workshop.id}/400/300`} 
                        alt={workshop.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-primary">
                          {workshop.isVerified ? 'VERIFIED' : 'ACTIVE'}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-8 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight group-hover:text-primary transition-colors">
                            {workshop.name}
                          </h3>
                          <p className="text-primary font-bold text-sm uppercase tracking-wider">
                            {workshop.address}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <span className="text-amber-700 font-bold text-sm">{workshop.rating || 4.5}</span>
                        </div>
                      </div>
                      
                      <p className="text-slate-500 text-sm line-clamp-2 mb-6 flex-1">
                        {workshop.description || 'Premium service center equipped with state-of-the-art tools and technology.'}
                      </p>
                      
                      <div className="space-y-3 mb-8">
                        <div className="flex items-center gap-3 text-slate-600 text-sm">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>Nearby Workshop</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600 text-sm">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>Open Mon-Sat, 9AM - 7PM</span>
                        </div>
                      </div>
                      
                      <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                        <div className="text-slate-900 font-black">
                          Verified <span className="text-primary">Partner</span>
                        </div>
                        <Link to={`/booking?workshopId=${workshop.id}`}>
                          <Button className="rounded-xl bg-slate-900 hover:bg-primary text-white transition-all group/btn">
                            Book Now
                            <ChevronRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              filteredMechanics.map((tech, index) => (
                <motion.div
                  key={tech.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="rounded-[2.5rem] border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 overflow-hidden bg-white group h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={tech.avatar || `https://picsum.photos/seed/${tech.id}/400/300`} 
                        alt={tech.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className={tech.status === 'available' ? 'bg-emerald-500' : 'bg-slate-400'}>
                          {tech.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-8 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight group-hover:text-primary transition-colors">
                            {tech.name}
                          </h3>
                          <p className="text-primary font-bold text-sm uppercase tracking-wider">
                            {tech.specialty}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <span className="text-amber-700 font-bold text-sm">{tech.rating || 5.0}</span>
                        </div>
                      </div>
                      
                      <p className="text-slate-500 text-sm line-clamp-2 mb-6 flex-1">
                        {tech.bio || 'Experienced technician specializing in high-end vehicle maintenance and complex repairs.'}
                      </p>
                      
                      <div className="space-y-3 mb-8">
                        <div className="flex items-center gap-3 text-slate-600 text-sm">
                          <Award className="h-4 w-4 text-primary" />
                          <span>{tech.experience || '10+ Years'} Experience</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600 text-sm">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>{tech.availability || 'Available Mon-Sat'}</span>
                        </div>
                      </div>
                      
                      <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                        <div className="text-slate-900 font-black">
                          ₹{tech.hourlyRate || 500}<span className="text-slate-400 text-xs font-medium uppercase tracking-widest ml-1">/hr</span>
                        </div>
                        <Link to={`/mechanics/${tech.id}`}>
                          <Button className="rounded-xl bg-slate-900 hover:bg-primary text-white transition-all group/btn">
                            View Profile
                            <ChevronRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {((!showNearbyOnly && filteredMechanics.length === 0) || (showNearbyOnly && nearbyWorkshops.length === 0)) && (
          <div className="text-center py-20">
            <div className="h-20 w-20 bg-slate-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <Wrench className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">No {showNearbyOnly ? 'workshops' : 'mechanics'} found</h3>
            <p className="text-slate-500">
              {showNearbyOnly 
                ? "We couldn't find any workshops near your location. Try expanding your search area."
                : "Try adjusting your search or filter to find what you're looking for."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mechanics;
