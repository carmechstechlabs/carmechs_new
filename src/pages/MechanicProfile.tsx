import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { motion } from 'motion/react';
import { Star, MapPin, Clock, Award, ChevronRight, CheckCircle2, ShieldCheck, Mail, Phone, Calendar, MessageSquare, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

const MechanicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { technicians, reviews, currentUser, users, isAdminLoggedIn, updateTechnicianStatus } = useData();
  const tech = technicians.find(t => t.id === id);
  const userProfile = users.find(u => u.id === currentUser?.uid);
  const isMechanicOwner = currentUser?.uid === tech?.userId;
  const canUpdateStatus = isMechanicOwner || isAdminLoggedIn || userProfile?.role === 'admin';

  if (!tech) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">Mechanic Not Found</h1>
          <Button onClick={() => navigate('/mechanics')} className="rounded-xl">Back to Mechanics</Button>
        </div>
      </div>
    );
  }

  const techReviews = reviews.filter(r => r.technicianId === tech.id);
  const averageRating = techReviews.length > 0 
    ? techReviews.reduce((acc, r) => acc + r.rating, 0) / techReviews.length 
    : tech.rating || 5.0;

  const handleBookNow = () => {
    navigate(`/booking?techId=${tech.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="rounded-[2.5rem] border-slate-200 shadow-sm overflow-hidden bg-white">
              <div className="relative h-48 bg-slate-900">
                <div className="absolute -bottom-12 left-8">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
                    <AvatarImage src={tech.avatar} />
                    <AvatarFallback className="bg-primary text-white font-black text-2xl">
                      {tech.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              
              <CardContent className="pt-16 pb-8 px-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                      {tech.name}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-primary font-bold text-sm uppercase tracking-wider">
                        {tech.specialty}
                      </p>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <Badge 
                        variant="outline" 
                        className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border-none ${
                          tech.status === 'available' ? 'bg-emerald-500/10 text-emerald-600' :
                          tech.status === 'busy' ? 'bg-amber-500/10 text-amber-600' :
                          'bg-slate-500/10 text-slate-600'
                        }`}
                      >
                        {tech.status || 'available'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <span className="text-amber-700 font-bold text-sm">{averageRating.toFixed(1)}</span>
                  </div>
                </div>
                
                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                  {tech.bio || 'Expert technician with deep knowledge in luxury car maintenance and repair. Committed to providing high-quality service and ensuring customer satisfaction.'}
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Award className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{tech.experience || '10+ Years'} Experience</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{tech.availability || 'Available Mon-Sat'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">Verified Professional</span>
                  </div>
                </div>

                {/* Availability Toggle - Only for the mechanic themselves or admin */}
                {canUpdateStatus && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-8">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Update My Status</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'available', label: 'Available', color: 'bg-emerald-500' },
                        { id: 'busy', label: 'Busy', color: 'bg-amber-500' },
                        { id: 'off', label: 'Offline', color: 'bg-slate-500' }
                      ].map((status) => (
                        <button
                          key={status.id}
                          onClick={() => {
                            updateTechnicianStatus(tech.id, status.id as any);
                            toast.success(`Status updated to ${status.label}`);
                          }}
                          className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${
                            tech.status === status.id 
                              ? 'border-primary bg-white shadow-md' 
                              : 'border-transparent hover:bg-white/50'
                          }`}
                        >
                          <div className={`h-2 w-2 rounded-full ${status.color} mb-1`} />
                          <span className={`text-[8px] font-black uppercase tracking-widest ${
                            tech.status === status.id ? 'text-primary' : 'text-slate-500'
                          }`}>
                            {status.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col gap-3">
                  <Button onClick={handleBookNow} className="w-full h-12 rounded-xl bg-slate-900 hover:bg-primary text-white font-bold uppercase tracking-wider transition-all">
                    Book Appointment
                  </Button>
                  <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 font-bold uppercase tracking-wider">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message Mechanic
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-[2rem] border-slate-200 shadow-sm bg-white p-8">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6">Contact Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                    <p className="text-sm font-bold text-slate-900">{tech.email || 'contact@carmechs.com'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</p>
                    <p className="text-sm font-bold text-slate-900">{tech.phone || '+91 98765 43210'}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Right Column - Tabs & Details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-8">
              <TabsList className="bg-white border border-slate-200 p-1 rounded-2xl h-14 w-full md:w-auto">
                <TabsTrigger value="overview" className="rounded-xl px-8 font-bold uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-white">Overview</TabsTrigger>
                <TabsTrigger value="services" className="rounded-xl px-8 font-bold uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-white">Services</TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-xl px-8 font-bold uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-white">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-8">
                <Card className="rounded-[2rem] border-slate-200 shadow-sm bg-white p-8">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6">About {tech.name}</h3>
                  <p className="text-slate-600 leading-relaxed mb-8">
                    {tech.bio || `${tech.name} is a highly skilled ${tech.specialty} with over ${tech.experience || '10'} years of experience in the automotive industry. He has worked with numerous luxury car brands and is known for his meticulous attention to detail and commitment to excellence.`}
                  </p>
                  
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-4">Certifications</h3>
                  <div className="flex flex-wrap gap-3">
                    {(tech.certifications || ['Master Technician', 'Engine Specialist', 'Brake Systems Expert']).map((cert, i) => (
                      <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-lg">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="rounded-[2rem] border-slate-200 shadow-sm bg-white p-8">
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6">Specializations</h3>
                    <div className="space-y-4">
                      {['Engine Diagnostics', 'Transmission Repair', 'Electrical Systems', 'Suspension Tuning'].map((spec, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="h-2 w-2 bg-primary rounded-full" />
                          <span className="text-slate-700 font-medium">{spec}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                  
                  <Card className="rounded-[2rem] border-slate-200 shadow-sm bg-white p-8">
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6">Work Experience</h3>
                    <div className="space-y-6">
                      <div className="relative pl-6 border-l-2 border-slate-100">
                        <div className="absolute -left-[9px] top-0 h-4 w-4 bg-primary rounded-full border-4 border-white" />
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">2018 - Present</p>
                        <p className="text-sm font-bold text-slate-900">Senior Mechanic at CarMechs</p>
                      </div>
                      <div className="relative pl-6 border-l-2 border-slate-100">
                        <div className="absolute -left-[9px] top-0 h-4 w-4 bg-slate-200 rounded-full border-4 border-white" />
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">2014 - 2018</p>
                        <p className="text-sm font-bold text-slate-900">Lead Technician at Luxury Motors</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="services" className="space-y-8">
                <Card className="rounded-[2rem] border-slate-200 shadow-sm bg-white p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Services Offered</h3>
                    <div className="text-slate-900 font-black">
                      ₹{tech.hourlyRate || 500}<span className="text-slate-400 text-xs font-medium uppercase tracking-widest ml-1">/hr Base Rate</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(tech.servicesOffered || ['Engine Tuning', 'Brake Service', 'Oil Change', 'AC Repair', 'Suspension Check', 'Electrical Diagnostics']).map((service, i) => (
                      <div key={i} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between group hover:border-primary/20 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                            <Wrench className="h-5 w-5" />
                          </div>
                          <span className="text-slate-900 font-bold">{service}</span>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews" className="space-y-8">
                <Card className="rounded-[2rem] border-slate-200 shadow-sm bg-white p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Customer Reviews</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`h-4 w-4 ${s <= Math.round(averageRating) ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`} />
                        ))}
                      </div>
                      <span className="text-slate-900 font-black">{averageRating.toFixed(1)}</span>
                      <span className="text-slate-400 text-sm font-medium">({techReviews.length} reviews)</span>
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    {techReviews.length > 0 ? techReviews.map((review) => (
                      <div key={review.id} className="border-b border-slate-100 pb-8 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-slate-100 text-slate-600 font-bold">
                                {review.userName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{review.userName}</p>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className={`h-3 w-3 ${s <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    )) : (
                      <div className="text-center py-12">
                        <MessageSquare className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">No reviews yet for this mechanic.</p>
                      </div>
                    )}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MechanicProfile;
