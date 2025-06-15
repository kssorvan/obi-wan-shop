
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

const faqData = [
  {
    question: "How does the AI style recommendation work?",
    answer: "Our AI analyzes your purchase history, browsing behavior, and favorited items to understand your preferences. It then suggests products that match your style, considering current trends and item compatibility."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept major credit cards (Visa, MasterCard, American Express), PayPal, and other digital payment methods. All transactions are securely processed."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order is shipped, you will receive an email with a tracking number and a link to the carrier's website. You can also find tracking information in your order history under 'My Orders'."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for most items in new and unused condition with original tags attached. Some exclusions may apply. Please visit our Returns & Exchanges page for full details."
  },
  {
    question: "How do I update my shipping address?",
    answer: "You can update your shipping address in your account profile under 'Manage Addresses'. If you need to change the address for an order already placed, please contact customer support as soon as possible."
  },
  {
    question: "Is my personal information secure?",
    answer: "Yes, we take your privacy and security very seriously. We use industry-standard encryption and security protocols to protect your personal information. Please refer to our Privacy Policy for more details."
  }
];

export default function HelpPage() { // Renamed from FAQsPage
  return (
    <div className="container py-12 max-w-3xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <HelpCircle className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-4xl font-headline text-primary">Help & FAQs</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-1">Find answers to common questions about StyleSense AI.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqData.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-lg text-left hover:text-primary font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-md text-foreground/80 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
