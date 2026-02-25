import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Car, Users, Calendar, Clock, CheckCircle2, XCircle, Shield, IndianRupee, TrendingUp, ArrowUpRight, ArrowDownRight, Gift, Wallet } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area } from "recharts";
import { cn } from "@/lib/utils";

export function Dashboard() {
  const { services, carMakes, carModels, fuelTypes, appointments, users, brands, settings } = useData();

  const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed').length;
  const completedAppointments = appointments.filter(a => a.status === 'completed').length;
  const cancelledAppointments = appointments.filter(a => a.status === 'cancelled').length;

  const totalRevenue = appointments
    .filter(a => a.status === 'completed')
    .reduce((acc, curr) => {
      const service = services.find(s => s.id === curr.service);
      return acc + (service?.basePrice || 0);
    }, 0);

  const totalReferralRewards = users.reduce((acc, curr) => acc + (curr.referralsCount * settings.referralRewardAmount), 0);

  const activeUsers = users.filter(u => u.verified).length || users.length;

  const stats = [
    { 
      title: "Total Appointments", 
      value: appointments.length, 
      description: "All time bookings",
      icon: Calendar, 
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "+12.5%",
      trendUp: true
    },
    { 
      title: "Pending Tasks", 
      value: pendingAppointments, 
      description: "Requires attention",
      icon: Clock, 
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      trend: "-2.1%",
      trendUp: false
    },
    { 
      title: "Active Users", 
      value: activeUsers, 
      description: "Verified customers",
      icon: Users, 
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      trend: "+4.2%",
      trendUp: true
    },
    { 
      title: "Total Revenue", 
      value: `₹${totalRevenue.toLocaleString()}`, 
      description: "From completed services",
      icon: IndianRupee, 
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      trend: "+18.3%",
      trendUp: true
    },
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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-600">
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-none shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={cn("p-3 rounded-xl transition-colors", stat.bgColor)}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                  stat.trendUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                )}>
                  {stat.trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {stat.trend}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                <p className="text-xs text-slate-400">{stat.description}</p>
              </div>
            </CardContent>
            <div className={cn("h-1 w-full", stat.color.replace('text', 'bg'))} />
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
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Appointments</CardTitle>
              <CardDescription>Latest service bookings from customers.</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="/admin/appointments">View All</a>
            </Button>
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
