import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2, Users, Award, History } from "lucide-react";

export function About() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-slate-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About CarMechs</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            We are on a mission to make car ownership hassle-free and affordable for everyone.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Our Workshop" 
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6 text-slate-900">Our Story</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Founded in 2020, CarMechs started with a simple idea: car service shouldn't be complicated or expensive. 
                We noticed that car owners often struggle with finding reliable mechanics, transparent pricing, and convenient service options.
              </p>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Today, we have grown into a network of technology-enabled workshops offering standardized services, 
                genuine parts, and a seamless digital experience. We take pride in being the most trusted car service partner for thousands of customers.
              </p>
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h3 className="text-3xl font-bold text-primary mb-1">50k+</h3>
                  <p className="text-sm text-slate-600">Cars Serviced</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h3 className="text-3xl font-bold text-primary mb-1">4.8</h3>
                  <p className="text-sm text-slate-600">Average Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">Our Core Values</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              These principles guide everything we do at CarMechs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Customer First</h3>
              <p className="text-slate-600">
                We prioritize our customers' needs and strive to exceed their expectations with every service.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Quality Assurance</h3>
              <p className="text-slate-600">
                We never compromise on quality. From parts to workmanship, we ensure the best for your car.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                <History className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Transparency</h3>
              <p className="text-slate-600">
                No hidden costs or surprises. We believe in complete transparency in our pricing and processes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Join thousands of happy customers</h2>
          <Link to="/book">
            <Button size="lg">Book Your Service Now</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
