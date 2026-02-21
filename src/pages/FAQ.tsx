import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-slate-900">Frequently Asked Questions</h1>
          <p className="text-slate-600 text-lg">
            Find answers to common questions about our services and booking process.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-slate-900 font-medium hover:text-primary hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
