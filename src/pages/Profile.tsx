import { useState } from "react";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet, Users, Copy, CheckCircle2, Gift, ArrowRight, Calendar, Clock, ChevronRight, Wrench } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function Profile() {
  const { users, settings, processReferral, appointments, services } = useData();
  // Simulate logged in user (using the first user for demo)
  const user = users[0] || {
    id: "demo",
    name: "Demo User",
    email: "demo@example.com",
    phone: "1234567890",
    walletBalance: 0,
    referralCode: "DEMO123",
    referralsCount: 0
  };

  const [referralInput, setReferralInput] = useState("");

  const userAppointments = appointments.filter(app => 
    app.email === user.email || app.phone === user.phone
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getServiceTitle = (serviceId: string) => {
    return services.find(s => s.id === serviceId)?.title || serviceId;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    toast.success("Referral code copied!");
  };

  const handleApplyReferral = () => {
    if (!referralInput) {
      toast.error("Please enter a referral code");
      return;
    }
    if (referralInput === user.referralCode) {
      toast.error("You cannot use your own referral code");
      return;
    }
    processReferral(referralInput, user.id);
    setReferralInput("");
    toast.success("Referral code applied successfully!");
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
            <p className="text-slate-500">Manage your wallet and referrals</p>
          </div>
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex items-center gap-4">
            <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center text-white">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Wallet Balance</p>
              <p className="text-2xl font-bold text-primary">₹{user.walletBalance || 0}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none shadow-lg bg-gradient-to-br from-slate-900 to-slate-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-emerald-400" />
                Refer & Earn
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-slate-300 text-sm">
                Share your referral code with friends and earn <span className="text-emerald-400 font-bold">₹{settings.referralRewardAmount}</span> in your wallet when they join!
              </p>
              
              <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase font-semibold">Your Referral Code</label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 font-mono text-lg flex items-center justify-between">
                    {user.referralCode}
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </div>
                  <Button variant="secondary" onClick={copyReferralCode}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-300">Total Referrals</span>
                </div>
                <span className="text-xl font-bold">{user.referralsCount || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-primary" />
                Have a Referral Code?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-500 text-sm">
                If you were referred by someone, enter their code below to link your accounts.
              </p>
              <div className="space-y-4">
                <Input 
                  placeholder="Enter referral code" 
                  value={referralInput}
                  onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
                  className="uppercase font-mono"
                />
                <Button className="w-full" onClick={handleApplyReferral}>
                  Apply Code
                </Button>
              </div>
              
              <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Wallet Benefits</h4>
                <ul className="text-xs text-slate-500 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-primary" />
                    Use balance for any car service
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-primary" />
                    Instant credit on successful referral
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-primary" />
                    No expiry on wallet balance
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs text-slate-400 uppercase font-semibold">Full Name</p>
                <p className="font-medium text-slate-900">{user.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-400 uppercase font-semibold">Email Address</p>
                <p className="font-medium text-slate-900">{user.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-400 uppercase font-semibold">Phone Number</p>
                <p className="font-medium text-slate-900">{user.phone}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-400 uppercase font-semibold">Account Status</p>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${user.verified ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                  <p className="font-medium text-slate-900">{user.verified ? 'Verified' : 'Pending Verification'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              My Appointments
            </CardTitle>
            <span className="text-xs font-medium bg-white px-2 py-1 rounded-full border border-slate-200 text-slate-500">
              {userAppointments.length} Total
            </span>
          </CardHeader>
          <CardContent className="p-0">
            {userAppointments.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {userAppointments.map((app) => (
                  <div key={app.id} className="p-4 sm:p-6 hover:bg-slate-50 transition-colors group">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Wrench className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{getServiceTitle(app.service)}</h4>
                          <p className="text-sm text-slate-500">{app.make} {app.model} • {app.fuel}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <Calendar className="h-3.5 w-3.5" />
                              {app.date}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <Clock className="h-3.5 w-3.5" />
                              {app.time}
                            </div>
                            {app.paymentMethod && (
                              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                                {app.paymentMethod === 'pay_after_service' ? 'Pay at Doorstep' : app.paymentMethod.toUpperCase()}
                                <span className={cn(
                                  "ml-1 text-[10px]",
                                  app.paymentStatus === 'paid' ? "text-green-600" : "text-amber-600"
                                )}>
                                  ({app.paymentStatus})
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider",
                          getStatusColor(app.status)
                        )}>
                          {app.status}
                        </span>
                        <Button variant="ghost" size="sm" className="text-primary group-hover:translate-x-1 transition-transform">
                          Details <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-slate-400" />
                </div>
                <h4 className="text-slate-900 font-bold mb-1">No appointments yet</h4>
                <p className="text-slate-500 text-sm mb-6">You haven't booked any car services yet.</p>
                <Button asChild>
                  <a href="/book">Book Your First Service</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
