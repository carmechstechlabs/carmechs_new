import React from 'react';
import { ImageGenerator } from '@/components/ImageGenerator';
import { motion } from 'motion/react';
import { Wrench } from 'lucide-react';

export function DevImages() {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
              <Wrench className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900">Developer Tools</h1>
            <p className="text-slate-500 font-medium">Generate and download AI images for the service catalog.</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ImageGenerator />
          </motion.div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">Instructions</h3>
            <ul className="space-y-4 text-sm text-slate-500 font-medium list-disc pl-5">
              <li>Enter a descriptive prompt for the service image.</li>
              <li>Click "Generate Image" and wait for the AI to process.</li>
              <li>Once generated, download the image.</li>
              <li>Upload the image to a public host or add it to the project's public folder.</li>
              <li>Update the <code className="bg-slate-100 px-2 py-1 rounded text-primary">imageUrl</code> in <code className="bg-slate-100 px-2 py-1 rounded text-primary">DataContext.tsx</code>.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
