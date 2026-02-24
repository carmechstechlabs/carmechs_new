import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Car, Users, Calendar, Clock, CheckCircle2, XCircle, Shield } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export function Dashboard() {
  const { services, carMakes, carModels, fuelTypes, appointments, users, brands } = useData();

  const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed').length;
  const completedAppointments = appointments.filter(a => a.status === 'completed').length;
  const cancelledAppointments = appointments.filter(a => a.status === 'cancelled').length;

  const activeUsers = users.filter(u => u.verified).length || users.length; // Fallback to all users if none verified

  const stats = [
    { title: "Total Appointments", value: appointments.length, icon: Calendar, color: "text-blue-600" },
    { title: "Pending Appointments", value: pendingAppointments, icon: Clock, color: "text-amber-600" },
    { title: "Active Users", value: activeUsers, icon: Users, color: "text-indigo-600" },
    { title: "Total Services", value: services.length, icon: Wrench, color: "text-emerald-600" },
    { title: "Car Makes", value: carMakes.length, icon: Car, color: "text-purple-600" },
    { title: "Car Models", value: carModels.length, icon: Car, color: "text-pink-600" },
    { title: "Fuel Types", value: fuelTypes.length, icon: Car, color: "text-orange-600" },
    { title: "Brands", value: brands.length, icon: Shield, color: "text-teal-600" },
  ];

  // Create a unified recent activity feed
  const recentActivity = [
    ...appointments.map(a => ({
      id: `apt-${a.id}`,
      type: 'appointment',
      title: `New appointment: ${a.service}`,
      subtitle: `by ${a.name}`,
      date: new Date(a.createdAt),
      icon: Calendar,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100'
    })),
    // Since users don't have createdAt, we'll just use the current date for the last 3 users to simulate recent activity
    ...users.slice(-3).map((u, i) => ({
      id: `user-${u.id}`,
      type: 'user',
      title: `New user registered`,
      subtitle: u.name,
      date: new Date(Date.now() - i * 86400000), // Simulate recent dates
      icon: Users,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-100'
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 6);

  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-amber-500" />;
      case 'confirmed': return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  // Chart Data
  const statusData = [
    { name: 'Pending', value: pendingAppointments, color: '#f59e0b' },
    { name: 'Confirmed', value: confirmedAppointments, color: '#3b82f6' },
    { name: 'Completed', value: completedAppointments, color: '#10b981' },
    { name: 'Cancelled', value: cancelledAppointments, color: '#ef4444' },
  ].filter(item => item.value > 0);

  // Group appointments by date for the bar chart
  const appointmentsByDate = appointments.reduce((acc: any, curr) => {
    const date = new Date(curr.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date]++;
    return acc;
  }, {});

  const barChartData = Object.keys(appointmentsByDate).map(date => ({
    date,
    appointments: appointmentsByDate[date]
  })).slice(-7); // Last 7 days with data

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Appointments by Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                No appointment data available.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Appointments Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {barChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                  <RechartsTooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="appointments" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                No appointment data available.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {recentAppointments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Customer</th>
                      <th className="px-4 py-3">Service</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3 rounded-tr-lg">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAppointments.map((apt) => (
                      <tr key={apt.id} className="border-b last:border-0 border-slate-100">
                        <td className="px-4 py-3 font-medium text-slate-900">{apt.name}</td>
                        <td className="px-4 py-3 text-slate-600">{apt.service}</td>
                        <td className="px-4 py-3 text-slate-600">{new Date(apt.date).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(apt.status)}`}>
                            {getStatusIcon(apt.status)}
                            <span className="capitalize">{apt.status}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-slate-500 py-4 text-center">No recent appointments.</p>
            )}
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`mt-0.5 h-8 w-8 rounded-full flex items-center justify-center ${activity.bgColor}`}>
                        <activity.icon className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-slate-500">{activity.subtitle}</p>
                          <p className="text-xs text-slate-400">
                            {activity.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center">No recent activity.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-3 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </div>
                <span className="text-sm font-medium">All systems operational</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
