import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "motion/react";
import { HelpCircle, MessageCircle, Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const faqs = [
  {
    question: "How do I book a service?",
    answer: "You can book a service by clicking on the 'Book Now' button on our homepage or services page. Select your car make, model, and the desired service, then choose a convenient date and time slot."
  },
  {
    question: "What areas do you serve?",
    answer: "We currently serve the greater metropolitan area. You can check if we service your specific location by entering your pincode during the booking process."
  },
  {
    question: "Do you offer pick-up and drop-off services?",
    answer: "Yes, we offer complimentary pick-up and drop-off services for all our major service packages. Our driver will pick up your car from your specified location and return it after the service is complete."
  },
  {
    question: "How long does a typical service take?",
    answer: "The duration depends on the service package. A standard periodic maintenance service typically takes 4-6 hours. Minor repairs like battery replacement or car wash can be done in under 2 hours."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards, UPI, net banking, and cash on delivery. You can choose to pay online while booking or after the service is completed."
  },
  {
    question: "Is there a warranty on the parts replaced?",
    answer: "Yes, all spare parts used are 100% genuine and come with a manufacturer's warranty. The warranty period varies depending on the specific part."
  },
  {
    question: "Can I reschedule or cancel my booking?",
    answer: "Yes, you can reschedule or cancel your booking up to 2 hours before the scheduled time through your account dashboard or by contacting our customer support."
  },
  {
    question: "Do you provide emergency breakdown assistance?",
    answer: "Yes, we provide 24/7 emergency breakdown assistance. Please call our helpline number for immediate support."
  }
];

export function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/10 via-transparent to-transparent blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="h-3 w-3" />
              Support Terminal
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              How can we <span className="text-gradient">help you?</span>
            </h1>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
              Find answers to common questions about our services, booking process, and more.
            </p>

            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <Input 
                placeholder="Search for answers..." 
                className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-primary focus:border-primary text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="pb-32">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass-dark rounded-3xl border border-white/5 p-6 md:p-12"
          >
            {filteredFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="border-white/5 px-4 rounded-2xl hover:bg-white/[0.02] transition-colors"
                  >
                    <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary hover:no-underline py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <HelpCircle className="h-4 w-4 text-primary" />
                        </div>
                        {faq.question}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-400 text-base leading-relaxed pb-6 pl-12">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-20">
                <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-slate-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">No results found</h3>
                <p className="text-slate-500">Try searching for something else or contact our support.</p>
              </div>
            )}
          </motion.div>

          {/* Contact CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-slate-400 mb-6">Still have questions?</p>
            <a 
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
            >
              <MessageCircle className="h-5 w-5" />
              Contact Our Support Team
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
