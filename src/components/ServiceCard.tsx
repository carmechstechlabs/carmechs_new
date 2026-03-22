import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon, ArrowRight, Clock, ShieldCheck, Star } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Service } from '../context/DataContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface ServiceCardProps {
  service: Service;
  onViewDetail: (id: string) => void;
  onBook: (service: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onViewDetail, onBook }) => {
  const IconComponent = (Icons[service.iconName as keyof typeof Icons] || Icons.Wrench) as LucideIcon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col h-full"
      id={`service-card-${service.id}`}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={service.imageUrl || `https://picsum.photos/seed/${service.id}/800/600`}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/90 text-blue-600 hover:bg-white border-none shadow-sm backdrop-blur-sm">
            {service.categoryId === 'cat_1' ? 'Maintenance' : 
             service.categoryId === 'cat_2' ? 'AC & Electrical' :
             service.categoryId === 'cat_3' ? 'Body & Paint' :
             service.categoryId === 'cat_4' ? 'Tires & Wheels' : 'Service'}
          </Badge>
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full font-bold shadow-lg">
          {service.price}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
            <IconComponent size={20} />
          </div>
          <div className="flex items-center gap-1 text-amber-500 text-sm font-medium">
            <Star size={14} fill="currentColor" />
            <span>4.9</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
          {service.title}
        </h3>
        
        <p className="text-slate-600 text-sm line-clamp-2 mb-4 flex-grow">
          {service.description}
        </p>

        <div className="flex items-center gap-4 mb-6 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{service.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <ShieldCheck size={14} />
            <span>Warranty: {service.warranty || '6 Months'}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="w-full border-slate-200 hover:bg-slate-50"
            onClick={() => onViewDetail(service.id)}
            id={`view-detail-${service.id}`}
          >
            Details
          </Button>
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200"
            onClick={() => onBook(service)}
            id={`book-now-${service.id}`}
          >
            Book Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
