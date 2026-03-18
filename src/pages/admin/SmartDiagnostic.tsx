import { useState } from "react";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Search, AlertTriangle, CheckCircle2, Zap } from "lucide-react";
import { motion } from "motion/react";

export function SmartDiagnostic() {
  const { carMakes, carModels, fuelTypes, services } = useData();
  const [vehicle, setVehicle] = useState({ make: "", model: "", fuel: "" });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<null | any[]>(null);

  const filteredServices = services.filter(service => {
    if (!vehicle.make) return false;
    const matchesMake = !service.applicableMakes || service.applicableMakes.length === 0 || service.applicableMakes.includes(vehicle.make);
    const matchesModel = !service.applicableModels || service.applicableModels.length === 0 || service.applicableModels.includes(vehicle.model);
    const matchesFuel = !service.applicableFuelTypes || service.applicableFuelTypes.length === 0 || service.applicableFuelTypes.includes(vehicle.fuel);
    return matchesMake && matchesModel && matchesFuel;
  });

  const handleAnalyze = () => {
    if (!vehicle.make || !vehicle.model) return;
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setResults([
        { id: 1, issue: "Potential Brake Pad Wear", probability: 85, severity: "medium", recommendation: "Schedule Brake Inspection" },
        { id: 2, issue: "Engine Oil Viscosity Low", probability: 60, severity: "low", recommendation: "Oil Change Recommended" },
        { id: 3, issue: "Transmission Fluid Level", probability: 40, severity: "low", recommendation: "Check Fluid Level" },
      ]);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
            <Zap className="h-3 w-3" /> AI Engine
          </div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Smart Diagnostic</h1>
          <p className="text-slate-500 text-sm font-medium">Predictive maintenance and fault analysis system.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="bg-white border-slate-100 shadow-xl rounded-[2rem]">
          <CardHeader>
            <CardTitle className="text-lg font-black uppercase tracking-tight">Vehicle Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Manufacturer</label>
              <select 
                className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm font-bold uppercase focus:ring-2 focus:ring-primary/20 outline-none"
                value={vehicle.make}
                onChange={e => setVehicle({...vehicle, make: e.target.value, model: ""})}
              >
                <option value="">Select Make</option>
                {carMakes.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Model</label>
              <select 
                className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm font-bold uppercase focus:ring-2 focus:ring-primary/20 outline-none"
                value={vehicle.model}
                onChange={e => setVehicle({...vehicle, model: e.target.value})}
                disabled={!vehicle.make}
              >
                <option value="">Select Model</option>
                {carModels.filter(m => m.make === vehicle.make).map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Fuel Type</label>
              <select 
                className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm font-bold uppercase focus:ring-2 focus:ring-primary/20 outline-none"
                value={vehicle.fuel}
                onChange={e => setVehicle({...vehicle, fuel: e.target.value})}
              >
                <option value="">Select Fuel</option>
                {fuelTypes.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
              </select>
            </div>
            <Button 
              onClick={handleAnalyze} 
              disabled={!vehicle.make || !vehicle.model || isAnalyzing}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-xl"
            >
              {isAnalyzing ? "Analyzing..." : "Run Diagnostic"}
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {isAnalyzing ? (
            <div className="h-64 flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Processing Vehicle Data...</p>
            </div>
          ) : results ? (
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Diagnostic Results</h3>
              {results.map((res) => (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={res.id}
                  className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex items-start gap-4"
                >
                  <div className={cn(
                    "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0",
                    res.severity === 'high' ? "bg-red-50 text-red-500" : 
                    res.severity === 'medium' ? "bg-amber-50 text-amber-500" : "bg-blue-50 text-blue-500"
                  )}>
                    {res.severity === 'high' ? <AlertTriangle className="h-6 w-6" /> : <Activity className="h-6 w-6" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-black text-slate-900 uppercase tracking-tight">{res.issue}</h4>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{res.probability}% Probability</span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium mb-4">{res.recommendation}</p>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${res.probability}%` }}
                        className={cn(
                          "h-full rounded-full",
                          res.severity === 'high' ? "bg-red-500" : 
                          res.severity === 'medium' ? "bg-amber-500" : "bg-blue-500"
                        )}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}

              {filteredServices.length > 0 && (
                <div className="space-y-4 pt-6">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Recommended Services for {vehicle.make} {vehicle.model}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredServices.slice(0, 4).map((service) => (
                      <div key={service.id} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center gap-4 group hover:border-primary/30 transition-all">
                        <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                          <Zap className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight truncate">{service.title}</h4>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{service.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
              <Activity className="h-12 w-12 text-slate-200 mb-4" />
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Select vehicle to begin analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
