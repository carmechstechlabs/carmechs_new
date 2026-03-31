import React, { useState, useEffect } from 'react';
import { useData, ServiceRequest } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, User, Clock, CheckCircle2, XCircle, Navigation } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

export default function MechanicDashboard() {
  const { currentUser, serviceRequests, updateServiceRequests, technicians, updateTechnicianStatus, updateTechnicianLocation } = useData();
  const [activeRequest, setActiveRequest] = useState<ServiceRequest | null>(null);
  const [isOnline, setIsOnline] = useState(false);

  // Find the technician profile for the current user
  const technician = technicians.find(t => t.userId === currentUser?.uid);

  useEffect(() => {
    if (technician) {
      setIsOnline(technician.status === 'available');
    }
  }, [technician]);

  // Update location periodically if online and has active request
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOnline && activeRequest && technician) {
      interval = setInterval(() => {
        // Simulate movement for demo purposes
        // In a real app, use navigator.geolocation.getCurrentPosition
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              updateTechnicianLocation(technician.id, position.coords.latitude, position.coords.longitude);
            },
            (error) => {
              console.error("Error getting location:", error);
            }
          );
        }
      }, 10000); // Every 10 seconds
    }
    return () => clearInterval(interval);
  }, [isOnline, activeRequest, technician, updateTechnicianLocation]);

  const handleToggleStatus = () => {
    if (!technician) return;
    const newStatus = isOnline ? 'off' : 'available';
    updateTechnicianStatus(technician.id, newStatus);
    setIsOnline(!isOnline);
    toast.success(`You are now ${newStatus === 'available' ? 'Online' : 'Offline'}`);
  };

  const handleAcceptRequest = (request: ServiceRequest) => {
    if (!technician) return;
    const updatedRequests = serviceRequests.map(r => 
      r.id === request.id ? { ...r, status: 'accepted' as const, technicianId: technician.id, assignedTechnician: technician } : r
    );
    updateServiceRequests(updatedRequests);
    setActiveRequest({ ...request, status: 'accepted', technicianId: technician.id, assignedTechnician: technician });
    toast.success("Request accepted! Navigate to customer location.");
  };

  const handleCompleteRequest = (request: ServiceRequest) => {
    const updatedRequests = serviceRequests.map(r => 
      r.id === request.id ? { ...r, status: 'completed' as const } : r
    );
    updateServiceRequests(updatedRequests);
    setActiveRequest(null);
    toast.success("Service completed successfully!");
  };

  const handleCancelRequest = (request: ServiceRequest) => {
    const updatedRequests = serviceRequests.map(r => 
      r.id === request.id ? { ...r, status: 'cancelled' as const } : r
    );
    updateServiceRequests(updatedRequests);
    setActiveRequest(null);
    toast.error("Request cancelled.");
  };

  if (!technician) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Technician Profile Not Found</h2>
        <p className="text-muted-foreground">Please contact admin to set up your technician account.</p>
      </div>
    );
  }

  const pendingRequests = serviceRequests.filter(r => r.status === 'pending');

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mechanic Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {technician.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-sm font-medium">{isOnline ? 'Online' : 'Offline'}</span>
          </div>
          <Button 
            variant={isOnline ? "destructive" : "default"}
            onClick={handleToggleStatus}
            className="rounded-xl font-bold"
          >
            {isOnline ? 'Go Offline' : 'Go Online'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {activeRequest ? (
            <Card className="border-primary/20 shadow-lg overflow-hidden">
              <div className="bg-primary/5 px-6 py-3 border-b border-primary/10 flex justify-between items-center">
                <Badge variant="default" className="bg-primary text-white">Active Job</Badge>
                <span className="text-xs text-muted-foreground font-mono">{activeRequest.id}</span>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">{activeRequest.make} {activeRequest.model}</CardTitle>
                <CardDescription>{activeRequest.problemDescription}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-accent/30 rounded-xl">
                    <User className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Customer</p>
                      <p className="font-bold">{activeRequest.userName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-accent/30 rounded-xl">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Contact</p>
                      <p className="font-bold">{activeRequest.userPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-accent/30 rounded-xl">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Location</p>
                      <p className="font-bold">{activeRequest.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-accent/30 rounded-xl">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Scheduled</p>
                      <p className="font-bold">{activeRequest.preferredDate} at {activeRequest.preferredTime}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-4">
                  <Button className="flex-1 h-12 rounded-xl bg-primary font-bold shadow-lg shadow-primary/20">
                    <Navigation className="h-4 w-4 mr-2" />
                    Navigate
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 h-12 rounded-xl border-green-500 text-green-600 hover:bg-green-50 font-bold"
                    onClick={() => handleCompleteRequest(activeRequest)}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Complete
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="h-12 rounded-xl text-destructive hover:bg-destructive/5 font-bold"
                    onClick={() => handleCancelRequest(activeRequest)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                Incoming Requests
                {pendingRequests.length > 0 && (
                  <Badge variant="secondary" className="rounded-full px-2">{pendingRequests.length}</Badge>
                )}
              </h2>
              
              <AnimatePresence mode="popLayout">
                {pendingRequests.length > 0 ? (
                  pendingRequests.map((request) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                    >
                      <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                                {request.make} {request.model} ({request.year})
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-1">{request.problemDescription}</p>
                            </div>
                            <Badge variant="outline" className="font-mono">{request.preferredTime}</Badge>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4" />
                              {request.location}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <User className="h-4 w-4" />
                              {request.userName}
                            </div>
                          </div>

                          <Button 
                            className="w-full rounded-xl font-bold"
                            disabled={!isOnline}
                            onClick={() => handleAcceptRequest(request)}
                          >
                            {isOnline ? 'Accept Request' : 'Go Online to Accept'}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-12 text-center bg-accent/20 rounded-3xl border-2 border-dashed border-border">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <p className="text-muted-foreground font-medium">No pending requests at the moment.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="rounded-3xl overflow-hidden border-none shadow-xl bg-primary text-white">
            <CardHeader>
              <CardTitle className="text-lg">Today's Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="opacity-80">Earnings</span>
                <span className="text-2xl font-bold">₹2,450</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="opacity-80">Completed</span>
                <span className="text-2xl font-bold">4</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="opacity-80">Rating</span>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold">4.9</span>
                  <Badge className="bg-white/20 text-white border-none">★</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-accent flex items-center justify-center font-bold text-primary">
                  {technician.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold">{technician.name}</p>
                  <p className="text-xs text-muted-foreground">{technician.specialty}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={isOnline ? "default" : "secondary"}>{isOnline ? 'Available' : 'Offline'}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Experience</span>
                  <span className="font-medium">{technician.experience || '5+ Years'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
