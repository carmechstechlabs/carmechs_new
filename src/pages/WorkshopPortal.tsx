import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Wrench, 
  Settings, 
  LogOut, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Plus,
  Search,
  Filter,
  MoreVertical,
  User,
  Car,
  MapPin,
  Phone,
  Mail,
  Star,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';

const WorkshopPortal: React.FC = () => {
  const { workshops, appointments, users, currentUser, updateWorkshop, updateAppointment, services, addService } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'appointments' | 'services' | 'settings'>('dashboard');
  const [isAddingService, setIsAddingService] = useState(false);
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    price: '',
    duration: '1 Hour'
  });
  const [workshopForm, setWorkshopForm] = useState<any>(null);

  // Find the user profile in our database
  const userProfile = useMemo(() => {
    if (!currentUser) return null;
    return users.find(u => u.id === currentUser.uid || u.email === currentUser.email);
  }, [users, currentUser]);

  // Find the workshop owned by the current user
  const myWorkshop = useMemo(() => {
    if (!userProfile) return null;
    return workshops.find(w => w.ownerId === userProfile.id);
  }, [workshops, userProfile]);

  // Initialize workshop form
  useMemo(() => {
    if (myWorkshop && !workshopForm) {
      setWorkshopForm({ ...myWorkshop });
    }
  }, [myWorkshop]);

  const handleSaveWorkshop = () => {
    if (!myWorkshop || !workshopForm) return;
    updateWorkshop(myWorkshop.id, workshopForm);
    toast.success("Workshop profile updated!");
  };

  const handleAddCustomService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myWorkshop) return;

    const service = addService({
      ...newService,
      basePrice: parseInt(newService.price.replace(/[^0-9]/g, '')) || 0,
      estimatedPrice: parseInt(newService.price.replace(/[^0-9]/g, '')) || 0,
      estimatedDuration: newService.duration,
      features: [],
      checks: []
    });

    // Add this service to the workshop's offered services
    updateWorkshop(myWorkshop.id, {
      servicesOffered: [...myWorkshop.servicesOffered, service.id]
    });

    setIsAddingService(false);
    setNewService({ title: '', description: '', price: '', duration: '1 Hour' });
    toast.success("Custom service added!");
  };

  // Filter appointments for this workshop
  const myAppointments = useMemo(() => {
    if (!myWorkshop) return [];
    return appointments.filter(a => a.workshopId === myWorkshop.id);
  }, [appointments, myWorkshop]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayApps = myAppointments.filter(a => a.date === today);
    const pending = myAppointments.filter(a => a.status === 'pending');
    const inProgress = myAppointments.filter(a => a.status === 'confirmed' || a.status === 'in-progress');
    const completed = myAppointments.filter(a => a.status === 'completed');

    return {
      today: todayApps.length,
      pending: pending.length,
      active: inProgress.length,
      completed: completed.length
    };
  }, [myAppointments]);

  if (!userProfile || (userProfile.role !== 'workshop_owner' && userProfile.role !== 'mechanic')) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-zinc-200">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Access Denied</h1>
          <p className="text-zinc-600 mb-8">
            This portal is only accessible to registered workshop owners and mechanics.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="w-full py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (!myWorkshop) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-zinc-200">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Register Your Workshop</h1>
          <p className="text-zinc-600 mb-8">
            You haven't registered a workshop yet. Start by creating your workshop profile to manage appointments and services.
          </p>
          <button 
            onClick={() => setActiveTab('settings')}
            className="w-full py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
          >
            Create Workshop Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-bottom border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              C
            </div>
            <div>
              <h2 className="font-bold text-zinc-900 leading-tight">Carmechs</h2>
              <p className="text-xs text-zinc-500">Workshop Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-200' : 'text-zinc-600 hover:bg-zinc-50'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('appointments')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'appointments' ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-200' : 'text-zinc-600 hover:bg-zinc-50'}`}
          >
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Appointments</span>
          </button>
          <button 
            onClick={() => setActiveTab('services')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'services' ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-200' : 'text-zinc-600 hover:bg-zinc-50'}`}
          >
            <Wrench className="w-5 h-5" />
            <span className="font-medium">My Services</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-200' : 'text-zinc-600 hover:bg-zinc-50'}`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-zinc-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 mb-4">
            <div className="w-10 h-10 rounded-full bg-zinc-200 overflow-hidden">
              {userProfile?.avatar ? (
                <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-white font-bold">
                  {userProfile?.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-zinc-900 truncate">{userProfile?.name}</p>
              <p className="text-xs text-zinc-500 truncate capitalize">{userProfile?.role}</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-zinc-200 p-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900">
                {activeTab === 'dashboard' && 'Workshop Overview'}
                {activeTab === 'appointments' && 'Manage Appointments'}
                {activeTab === 'services' && 'Service Catalog'}
                {activeTab === 'settings' && 'Workshop Settings'}
              </h1>
              <p className="text-zinc-500 text-sm">
                {myWorkshop.name} • {myWorkshop.address}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium border border-emerald-100">
                <ShieldCheck className="w-4 h-4" />
                {myWorkshop.isVerified ? 'Verified Partner' : 'Verification Pending'}
              </div>
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-current" />
                {myWorkshop.rating}
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Today's Jobs", value: stats.today, icon: Clock, color: "blue" },
                  { label: "Pending", value: stats.pending, icon: AlertCircle, color: "amber" },
                  { label: "Active", value: stats.active, icon: Wrench, color: "emerald" },
                  { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "zinc" }
                ].map((stat, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-600`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <span className="text-3xl font-bold text-zinc-900">{stat.value}</span>
                    </div>
                    <p className="text-zinc-500 font-medium">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Appointments */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-zinc-900">Upcoming Appointments</h3>
                    <button 
                      onClick={() => setActiveTab('appointments')}
                      className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
                    >
                      View All
                    </button>
                  </div>
                  <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
                    {myAppointments.length > 0 ? (
                      <div className="divide-y divide-zinc-100">
                        {myAppointments.slice(0, 5).map((app) => (
                          <div key={app.id} className="p-4 hover:bg-zinc-50 transition-colors flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-500">
                              <Car className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-zinc-900 truncate">{app.carModel || 'Unknown Vehicle'}</p>
                              <p className="text-sm text-zinc-500 truncate">{app.service}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-zinc-900">{app.date}</p>
                              <p className="text-xs text-zinc-500">{app.time}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              app.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                              app.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                              'bg-blue-50 text-blue-600'
                            }`}>
                              {app.status}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-12 text-center">
                        <Calendar className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
                        <p className="text-zinc-500 font-medium">No appointments scheduled yet.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Workshop Quick Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-zinc-900">Workshop Status</h3>
                  <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-zinc-100 overflow-hidden border border-zinc-200">
                        {myWorkshop.logoUrl ? (
                          <img src={myWorkshop.logoUrl} alt={myWorkshop.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-white font-bold text-2xl">
                            {myWorkshop.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-900">{myWorkshop.name}</h4>
                        <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
                          <Star className="w-3 h-3 fill-current" />
                          {myWorkshop.rating}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-zinc-600">
                        <MapPin className="w-4 h-4" />
                        <span>{myWorkshop.address}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-zinc-600">
                        <Phone className="w-4 h-4" />
                        <span>{myWorkshop.phone || 'Not provided'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-zinc-600">
                        <Mail className="w-4 h-4" />
                        <span>{myWorkshop.email}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-100">
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Working Hours</p>
                      <div className="space-y-2">
                        {Object.entries(myWorkshop.workingHours || {}).map(([day, hours]: [string, any]) => (
                          <div key={day} className="flex justify-between text-sm">
                            <span className="capitalize text-zinc-500">{day}</span>
                            <span className="font-medium text-zinc-900">
                              {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input 
                    type="text"
                    placeholder="Search appointments..."
                    className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-3 bg-white border border-zinc-200 rounded-xl text-zinc-600 font-medium hover:bg-zinc-50 transition-colors">
                    <Filter className="w-5 h-5" />
                    Filter
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors">
                    <Plus className="w-5 h-5" />
                    New Job
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200">
                      <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Customer & Vehicle</th>
                      <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Service</th>
                      <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Date & Time</th>
                      <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {myAppointments.map((app) => (
                      <tr key={app.id} className="hover:bg-zinc-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500">
                              <User className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-bold text-zinc-900">{app.customerName || app.name}</p>
                              <p className="text-xs text-zinc-500">{app.carModel || app.model}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-zinc-900">{app.service}</p>
                          <p className="text-xs text-zinc-500">₹{app.totalPrice || app.amount}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-zinc-900">{app.date}</p>
                          <p className="text-xs text-zinc-500">{app.time}</p>
                        </td>
                        <td className="px-6 py-4">
                          <select 
                            value={app.status}
                            onChange={(e) => updateAppointment(app.id, { status: e.target.value as any })}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider outline-none border-none cursor-pointer ${
                              app.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                              app.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                              app.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                              'bg-blue-50 text-blue-600'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {myAppointments.length === 0 && (
                  <div className="p-20 text-center">
                    <Calendar className="w-16 h-16 text-zinc-100 mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-zinc-900 mb-2">No appointments found</h4>
                    <p className="text-zinc-500">When customers book your workshop, they will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900">Offered Services</h3>
                  <p className="text-zinc-500 text-sm">Select the services your workshop provides to customers.</p>
                </div>
                <button 
                  onClick={() => setIsAddingService(true)}
                  className="px-6 py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors"
                >
                  Add Custom Service
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => {
                  const isOffered = myWorkshop.servicesOffered.includes(service.id);
                  return (
                    <div 
                      key={service.id}
                      className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                        isOffered 
                          ? 'border-zinc-900 bg-white shadow-lg ring-1 ring-zinc-900' 
                          : 'border-zinc-200 bg-white hover:border-zinc-300'
                      }`}
                      onClick={() => {
                        const newServices = isOffered 
                          ? myWorkshop.servicesOffered.filter(id => id !== service.id)
                          : [...myWorkshop.servicesOffered, service.id];
                        updateWorkshop(myWorkshop.id, { servicesOffered: newServices });
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isOffered ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                          <Wrench className="w-6 h-6" />
                        </div>
                        {isOffered && (
                          <div className="w-6 h-6 bg-zinc-900 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <h4 className="font-bold text-zinc-900 mb-1">{service.title}</h4>
                      <p className="text-sm text-zinc-500 line-clamp-2 mb-4">{service.description}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Base Price</span>
                        <span className="font-bold text-zinc-900">₹{service.price}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'settings' && workshopForm && (
            <div className="max-w-3xl space-y-8">
              <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-8">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-2xl bg-zinc-100 overflow-hidden border border-zinc-200">
                      {workshopForm.logoUrl ? (
                        <img src={workshopForm.logoUrl} alt={workshopForm.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-white font-bold text-3xl">
                          {workshopForm.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-2 bg-white border border-zinc-200 rounded-lg shadow-sm text-zinc-600 hover:text-zinc-900 transition-all opacity-0 group-hover:opacity-100">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900">Workshop Identity</h3>
                    <p className="text-zinc-500 text-sm">Update your workshop's public profile.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700">Workshop Name</label>
                    <input 
                      type="text"
                      value={workshopForm.name}
                      onChange={(e) => setWorkshopForm({ ...workshopForm, name: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700">Email Address</label>
                    <input 
                      type="email"
                      value={workshopForm.email}
                      onChange={(e) => setWorkshopForm({ ...workshopForm, email: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-zinc-700">Physical Address</label>
                    <input 
                      type="text"
                      value={workshopForm.address}
                      onChange={(e) => setWorkshopForm({ ...workshopForm, address: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-zinc-700">Description</label>
                    <textarea 
                      rows={4}
                      value={workshopForm.description}
                      onChange={(e) => setWorkshopForm({ ...workshopForm, description: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-100 flex justify-end">
                  <button 
                    onClick={handleSaveWorkshop}
                    className="px-8 py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
                  >
                    Save Changes
                  </button>
                </div>
              </div>

              <div className="bg-red-50 p-8 rounded-2xl border border-red-100 space-y-4">
                <h3 className="text-lg font-bold text-red-900">Danger Zone</h3>
                <p className="text-red-700 text-sm">
                  Deleting your workshop profile will remove all your data, services, and history from the platform. This action cannot be undone.
                </p>
                <button className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all">
                  Delete Workshop Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Custom Service Modal */}
      <AnimatePresence>
        {isAddingService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingService(false)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-zinc-900">Add Custom Service</h3>
                  <button onClick={() => setIsAddingService(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                    <AlertCircle className="w-6 h-6 text-zinc-400 rotate-45" />
                  </button>
                </div>

                <form onSubmit={handleAddCustomService} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700">Service Title</label>
                    <input 
                      required
                      type="text"
                      value={newService.title}
                      onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                      placeholder="e.g., Nitrogen Inflation"
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700">Description</label>
                    <textarea 
                      required
                      rows={3}
                      value={newService.description}
                      onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                      placeholder="Describe the service..."
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-700">Base Price (₹)</label>
                      <input 
                        required
                        type="text"
                        value={newService.price}
                        onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                        placeholder="e.g., 499"
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-700">Duration</label>
                      <input 
                        required
                        type="text"
                        value={newService.duration}
                        onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                        placeholder="e.g., 30 Mins"
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsAddingService(false)}
                      className="flex-1 py-4 bg-zinc-100 text-zinc-600 rounded-2xl font-bold hover:bg-zinc-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
                    >
                      Add Service
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkshopPortal;
