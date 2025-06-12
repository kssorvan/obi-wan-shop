
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Phone } from "lucide-react";

export default function ContactUsPage() {
  return (
    <div className="container py-12 max-w-3xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center pb-8">
          <MessageSquare className="mx-auto h-16 w-16 text-primary mb-6" />
          <CardTitle className="text-4xl font-headline text-primary">Get In Touch</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2 max-w-xl mx-auto">
            We&apos;d love to hear from you! Whether you have a question about our products, features, or anything else, our team is ready to answer all your questions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-primary mb-2 flex items-center"><Mail className="mr-2 h-5 w-5"/> Email Us</h3>
                <p className="text-muted-foreground">For general inquiries, support, or feedback:</p>
                <a href="mailto:support@obiwanshop.com" className="text-accent hover:underline">support@obiwanshop.com</a>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-primary mb-2 flex items-center"><Phone className="mr-2 h-5 w-5"/> Call Us (Mon-Fri, 9am-5pm)</h3>
                <p className="text-muted-foreground">Speak to our customer service team:</p>
                <a href="tel:+1234567890" className="text-accent hover:underline">+1 (234) 567-890</a>
              </div>
               <div>
                <h3 className="text-xl font-semibold text-primary mb-2">Office Address</h3>
                <p className="text-muted-foreground">Obi-Wan-Shop Headquarters<br/>123 Force Lane<br/>Coruscant, CO 54321</p>
              </div>
            </div>
            
            <form className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-foreground">Full Name</Label>
                <Input type="text" id="name" placeholder="Your Name" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email" className="text-foreground">Email Address</Label>
                <Input type="email" id="email" placeholder="you@example.com" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="subject" className="text-foreground">Subject</Label>
                <Input type="text" id="subject" placeholder="How can we help?" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="message" className="text-foreground">Message</Label>
                <Textarea id="message" placeholder="Your message..." rows={5} className="mt-1" />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Send Message</Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
