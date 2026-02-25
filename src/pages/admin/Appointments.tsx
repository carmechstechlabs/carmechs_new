import { useState } from "react";
import { useData, Appointment } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, User, Phone, Car, Wrench, Search, MoreVertical, CheckCircle, XCircle, CreditCard, IndianRupee } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Appointments() {
  const { appointments, updateAppointments, services, adminRole } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleStatusChange = (id: string, newStatus: Appointment['status']) => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to change appointment status.");
      return;
    }
    const updated = appointments.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    );
    updateAppointments(updated);
    toast.success(`Appointment marked as ${newStatus}`);
  };

  const filteredAppointments = appointments.filter(app => {
    const matchesSearch = 
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone.includes(searchTerm) ||
      app.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-900">Appointments</h1>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search name, phone, car..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            className="h-10 px-3 py-2 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredAppointments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Calendar className="h-12 w-12 text-slate-300 mb-4" />
              <p>No appointments found.</p>
            </CardContent>
          </Card>
        ) : (
          filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Left Column: Customer & Car Info */}
                  <div className="p-6 md:w-1/3 bg-slate-50 border-r border-slate-100">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-slate-400" />
                        <span className="font-semibold text-lg">{appointment.name}</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)} capitalize`}>
                        {appointment.status}
                      </span>
                    </div>
                    
                    <div className="space-y-3 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span>{appointment.phone}</span>
                      </div>
                      {appointment.email && (
                        <div className="flex items-center gap-2">
                          <span className="h-4 w-4 text-slate-400">@</span>
                          <span>{appointment.email}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                        <Car className="h-4 w-4 text-slate-400" />
                        <span className="font-medium text-slate-900">
                          {appointment.make} {appointment.model} ({appointment.fuel})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Service & Time Info */}
                  <div className="p-6 md:w-2/3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Wrench className="h-5 w-5 text-primary" />
                          <span className="font-semibold text-lg text-slate-900">
                            {services.find(s => s.id === appointment.service)?.title || 'Unknown Service'}
                          </span>
                        </div>
                        
                        <div className="w-40">
                          <Select 
                            value={appointment.status} 
                            onValueChange={(val) => handleStatusChange(appointment.id, val as Appointment['status'])}
                            disabled={adminRole !== 'admin'}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Update Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-6 mt-4">
                        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                          <Calendar className="h-5 w-5 text-primary" />
                          <div>
                            <span className="block text-xs text-slate-500">Date</span>
                            <span className="font-medium">{new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                          <Clock className="h-5 w-5 text-primary" />
                          <div>
                            <span className="block text-xs text-slate-500">Time</span>
                            <span className="font-medium">{appointment.time}</span>
                          </div>
                        </div>
                        {appointment.paymentMethod && (
                          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                            <CreditCard className="h-5 w-5 text-primary" />
                            <div>
                              <span className="block text-xs text-slate-500">Payment</span>
                              <span className="font-medium capitalize">
                                {appointment.paymentMethod.replace(/_/g, ' ')}
                                <span className={cn(
                                  "ml-2 text-[10px] px-1.5 py-0.5 rounded-full border",
                                  appointment.paymentStatus === 'paid' ? "bg-green-50 text-green-700 border-green-200" : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                )}>
                                  {appointment.paymentStatus}
                                </span>
                              </span>
                            </div>
                          </div>
                        )}
                        {appointment.amount && (
                          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                            <IndianRupee className="h-5 w-5 text-emerald-600" />
                            <div>
                              <span className="block text-xs text-slate-500">Amount</span>
                              <span className="font-medium">₹{appointment.amount}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 text-xs text-slate-400 text-right">
                      Booked on: {new Date(appointment.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
