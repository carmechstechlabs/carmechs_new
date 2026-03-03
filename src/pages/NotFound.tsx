import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Ghost, Home, ArrowLeft, Wrench } from "lucide-react";
import { motion } from "motion/react";

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden px-4">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full" />

      <div className="text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative inline-block mb-12">
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10"
            >
              <Ghost className="h-32 w-32 text-primary" strokeWidth={1.5} />
            </motion.div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-black/40 blur-md rounded-full" />
          </div>

          <h1 className="text-[12rem] md:text-[16rem] font-black text-white/5 leading-none select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10">
            404
          </h1>

          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6">
            Lost in the <span className="text-primary">Garage?</span>
          </h2>
          
          <p className="text-xl text-slate-400 max-w-md mx-auto mb-12 font-medium">
            The page you're looking for seems to have taken a wrong turn or doesn't exist anymore.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/">
              <Button size="lg" className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl shadow-primary/20 group">
                <Home className="mr-2 h-5 w-5 group-hover:-translate-y-1 transition-transform" />
                Back to Home
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => window.history.back()}
              className="h-16 px-10 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold text-lg"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Go Back
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-24 flex items-center justify-center gap-2 text-slate-600 font-bold text-xs uppercase tracking-[0.3em]"
        >
          <Wrench className="h-4 w-4" />
          <span>CarMechs Support Terminal</span>
        </motion.div>
      </div>
    </div>
  );
}
