import { useState } from "react";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, User, Phone, Mail, Calendar, Car } from "lucide-react";

export function Customers() {
  const { appointments } = useData();
  const [searchTerm, setSearchTerm] = useState("");

  // Group appointments by phone to get unique customers
  const customersMap = new Map();
  
  // Sort appointments by date descending so the latest is first
  const sortedAppointments = [...appointments].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  sortedAppointments.forEach(app => {
    const key = app.phone;
    if (!customersMap.has(key)) {
      customersMap.set(key, {
        name: app.name,
        phone: app.phone,
        email: app.email,
        appointments: [],
        cars: new Set()
      });
    }
    const customer = customersMap.get(key);
    customer.appointments.push(app);
    customer.cars.add(`${app.make} ${app.model} (${app.fuel})`);
  });

  const customers = Array.from(customersMap.values()).map(c => ({
    ...c,
    cars: Array.from(c.cars)
  }));

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-900">Customers</h1>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search customers..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500">
            <User className="h-12 w-12 text-slate-300 mb-4 mx-auto" />
            <p>No customers found.</p>
          </div>
        ) : (
          filteredCustomers.map((customer, idx) => (
            <Card key={idx} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4 border-b border-slate-100">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  {customer.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span>{customer.phone}</span>
                  </div>
                  {customer.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span>{customer.email}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Booking History
                  </h4>
                  <p className="text-sm font-medium text-slate-900">
                    {customer.appointments.length} {customer.appointments.length === 1 ? 'Booking' : 'Bookings'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Last booking: {new Date(customer.appointments[0].createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Car className="h-3 w-3" /> Vehicles
                  </h4>
                  <ul className="space-y-1">
                    {customer.cars.map((car: string, i: number) => (
                      <li key={i} className="text-sm text-slate-700 bg-slate-50 px-2 py-1 rounded">
                        {car}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
