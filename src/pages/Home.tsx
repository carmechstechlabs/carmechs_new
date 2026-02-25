import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { 
  Wrench, 
  Car, 
  Battery, 
  Disc, 
  PaintBucket, 
  ShieldCheck, 
  Clock, 
  IndianRupee, 
  Star 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useData } from "@/context/DataContext";
import { useState } from "react";
import { ServiceModal } from "@/components/ServiceModal";

const services = [
  {
    icon: <Wrench className="h-8 w-8 text-primary" />,
    title: "Periodic Services",
    description: "Oil change, filter replacement, and general checkup.",
  },
  {
    icon: <Disc className="h-8 w-8 text-primary" />,
    title: "Tyres & Wheels",
    description: "Alignment, balancing, and tyre replacement.",
  },
  {
    icon: <Battery className="h-8 w-8 text-primary" />,
    title: "Batteries",
    description: "Battery check, charging, and replacement.",
  },
  {
    icon: <PaintBucket className="h-8 w-8 text-primary" />,
    title: "Denting & Painting",
    description: "Scratch removal, dent repair, and full body painting.",
  },
  {
    icon: <Car className="h-8 w-8 text-primary" />,
    title: "AC Service",
    description: "Cooling coil cleaning, gas refill, and compressor check.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: "Car Spa & Cleaning",
    description: "Interior detailing, exterior wash, and polishing.",
  },
];

const features = [
  {
    icon: <ShieldCheck className="h-6 w-6 text-primary" />,
    title: "Genuine Parts",
    description: "We use only 100% genuine OEM/OES spare parts.",
  },
  {
    icon: <Clock className="h-6 w-6 text-primary" />,
    title: "Timely Delivery",
    description: "We value your time and ensure on-time delivery.",
  },
  {
    icon: <IndianRupee className="h-6 w-6 text-primary" />,
    title: "Transparent Pricing",
    description: "Upfront pricing with no hidden charges.",
  },
  {
    icon: <Wrench className="h-6 w-6 text-primary" />,
    title: "Expert Mechanics",
    description: "Highly trained and certified mechanics.",
  },
];

export function Home() {
  const { uiSettings, services: dynamicServices, brands } = useData();
  const [selectedService, setSelectedService] = useState<any>(null);

  const getIcon = (service: any) => {
    if ('iconUrl' in service && service.iconUrl) {
      return <img src={service.iconUrl} alt={service.title} className="max-h-10 max-w-10 object-contain" />;
    }
    return 'icon' in service ? service.icon : <Wrench className="h-8 w-8 text-primary" />;
  };

  const getLucideIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck className="h-6 w-6 text-primary" />;
      case 'Clock': return <Clock className="h-6 w-6 text-primary" />;
      case 'IndianRupee': return <IndianRupee className="h-6 w-6 text-primary" />;
      case 'Wrench': return <Wrench className="h-6 w-6 text-primary" />;
      case 'Star': return <Star className="h-6 w-6 text-primary" />;
      default: return <Wrench className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section 
        className="relative text-white py-20 lg:py-32 overflow-hidden"
        style={{ backgroundColor: uiSettings.primaryColor || '#0f172a' }}
      >
        <div className="absolute inset-0 z-0">
          {uiSettings.heroBgImage ? (
            <img 
              src={uiSettings.heroBgImage} 
              alt="Hero Background" 
              className="w-full h-full object-cover"
              style={{ opacity: uiSettings.heroBgOpacity || 0.2 }}
            />
          ) : (
            <div className="w-full h-full bg-slate-800 opacity-20"></div>
          )}
          <div 
            className="absolute inset-0"
            style={{ 
              background: `linear-gradient(to right, ${uiSettings.primaryColor || '#0f172a'}, ${uiSettings.primaryColor || '#0f172a'}CC, transparent)` 
            }}
          ></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {uiSettings.heroTitle ? (
                <span dangerouslySetInnerHTML={{ __html: uiSettings.heroTitle.replace(/\\n/g, '<br />') }} />
              ) : (
                <>Expert Car Care <br /><span className="text-primary">At Your Doorstep</span></>
              )}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8">
              {uiSettings.heroSubtitle || "Experience hassle-free car service with free pickup and drop. Trusted by thousands of car owners."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/book">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                  Book Now
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 bg-transparent text-white border-white hover:bg-white hover:text-slate-900">
                  View Services
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">Our Services</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Choose from a wide range of car services designed to keep your vehicle in top condition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(dynamicServices.length > 0 ? dynamicServices : services).map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 cursor-pointer group"
                onClick={() => setSelectedService({ ...service, icon: getIcon(service) })}
              >
                <div className="mb-4 bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center overflow-hidden group-hover:bg-primary/20 transition-colors">
                  {getIcon(service)}
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-slate-600 mb-4">{service.description}</p>
                <Link to="/book" className="text-primary font-medium hover:underline inline-flex items-center">
                  Book Now &rarr;
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      {brands.length > 0 && (
        <section className="py-16 bg-white border-y border-slate-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-slate-900">Brands We Work With</h2>
              <p className="text-slate-500 mt-2">We service all major car brands with expert care.</p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              {brands.map((brand) => (
                <div key={brand.id} className="h-12 md:h-16 w-24 md:w-32 flex items-center justify-center">
                  <img src={brand.imageUrl} alt={brand.name} className="max-h-full max-w-full object-contain" title={brand.name} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">How It Works</h2>
            <p className="text-slate-600">Simple steps to get your car serviced.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-200 -z-10 transform -translate-y-1/2"></div>

            {[
              { title: "Select Car", desc: "Choose your car make and model." },
              { title: "Choose Service", desc: "Select the service you need." },
              { title: "Book Slot", desc: "Pick a convenient date and time." },
              { title: "Relax", desc: "We pickup, service, and drop your car." },
            ].map((step, index) => (
              <div key={index} className="text-center bg-white">
                <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 border-8 border-white shadow-lg relative z-10">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">{uiSettings.whyChooseTitle || "Why Choose CarMechs?"}</h2>
              <p className="text-slate-300 mb-8">
                {uiSettings.whyChooseDescription || "We are committed to providing the best car service experience. With our team of expert mechanics and state-of-the-art workshops, your car is in safe hands."}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {(uiSettings.features || features).map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="bg-slate-800 p-3 rounded-lg shrink-0">
                      {'iconName' in feature ? getLucideIcon(feature.iconName) : (feature as any).icon}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{feature.title}</h4>
                      <p className="text-sm text-slate-400">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img 
                src={uiSettings.whyChooseImage || "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"} 
                alt="Mechanic working" 
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl text-slate-900 max-w-xs hidden md:block">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={cn(
                          "w-4 h-4",
                          i < Math.floor(uiSettings.testimonialRating || 4.9) ? "fill-current" : "text-slate-300"
                        )} 
                      />
                    ))}
                  </div>
                  <span className="font-bold">{uiSettings.testimonialRating || 4.9}/5</span>
                </div>
                <p className="text-sm font-medium">"{uiSettings.testimonialText || "Best service I've ever had! My car runs smoother than ever."}"</p>
                <p className="text-xs text-slate-500 mt-2">- {uiSettings.testimonialAuthor || "Alex Johnson"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to give your car the care it deserves?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Book your service today and get 10% off on your first order.
          </p>
          <Link to="/book">
            <Button size="lg" className="bg-white text-primary hover:bg-slate-100 text-lg px-8 font-bold">
              Book Appointment Now
            </Button>
          </Link>
        </div>
      </section>

      <ServiceModal 
        service={selectedService} 
        isOpen={!!selectedService} 
        onClose={() => setSelectedService(null)}
      />
    </div>
  );
}
