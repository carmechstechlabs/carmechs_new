import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useData, Technician } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation, Phone, User, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Fix Leaflet marker icon issue
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Mechanic Icon
const mechanicIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #3b82f6; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

// Custom User Icon
const userIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #10b981; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px rgba(16, 185, 129, 0.5);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

import { useParams } from 'react-router-dom';

interface MechanicTrackerProps {
  technicianId?: string;
  userLocation?: [number, number];
  requestId?: string;
}

export default function MechanicTracker({ technicianId: propTechId, userLocation = [22.5726, 88.3639], requestId: propRequestId }: MechanicTrackerProps) {
  const { technicianId: paramTechId, requestId: paramRequestId } = useParams();
  const { technicians, serviceRequests } = useData();
  
  const technicianId = propTechId || paramTechId;
  const requestId = propRequestId || paramRequestId;

  const technician = technicians.find(t => t.id === technicianId);
  const request = serviceRequests.find(r => r.id === requestId);

  const [mechanicPos, setMechanicPos] = useState<[number, number] | null>(
    technician?.latitude && technician?.longitude 
      ? [technician.latitude, technician.longitude] 
      : null
  );

  useEffect(() => {
    if (technician?.latitude && technician?.longitude) {
      setMechanicPos([technician.latitude, technician.longitude]);
    }
  }, [technician?.latitude, technician?.longitude]);

  if (!technician) return <div>Technician not found</div>;

  return (
    <div className="space-y-6">
      <Card className="rounded-3xl border-border shadow-xl overflow-hidden">
        <div className="h-[400px] relative">
          <MapContainer 
            center={mechanicPos || userLocation} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {mechanicPos && (
              <Marker position={mechanicPos} icon={mechanicIcon}>
                <Popup>
                  <div className="font-bold">{technician.name} (Mechanic)</div>
                  <div className="text-xs text-muted-foreground">On the way to your location</div>
                </Popup>
              </Marker>
            )}
            <Marker position={userLocation} icon={userIcon}>
              <Popup>
                <div className="font-bold">Your Location</div>
              </Popup>
            </Marker>
            {mechanicPos && <MapUpdater center={mechanicPos} />}
          </MapContainer>

          <div className="absolute bottom-6 left-6 right-6 z-[1000]">
            <div className="bg-card/90 backdrop-blur-xl border border-border p-4 rounded-2xl shadow-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Navigation className="h-6 w-6 text-primary animate-pulse" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Estimated Arrival</p>
                  <p className="text-xl font-bold">12 - 15 Mins</p>
                </div>
              </div>
              <Badge variant="default" className="bg-emerald-500 text-white animate-pulse">Live Tracking</Badge>
            </div>
          </div>
        </div>

        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-accent flex items-center justify-center font-bold text-2xl text-primary">
                  {technician.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{technician.name}</h3>
                  <p className="text-muted-foreground">{technician.specialty}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-bold text-sm">{technician.rating || '4.9'}</span>
                    <span className="text-muted-foreground text-xs">({technician.reviewCount || '120'} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 h-12 rounded-xl bg-primary font-bold shadow-lg shadow-primary/20">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Mechanic
                </Button>
                <Button variant="outline" className="flex-1 h-12 rounded-xl border-border font-bold">
                  Message
                </Button>
              </div>
            </div>

            <div className="space-y-4 bg-accent/30 p-6 rounded-3xl">
              <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Service Details</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{request?.location || 'Your Location'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{request?.preferredTime || 'ASAP'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{request?.make} {request?.model}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
