
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="container py-12 max-w-3xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <FileText className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-4xl font-headline text-primary">Terms of Service</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-1">Last Updated: {new Date().toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-lg max-w-none text-foreground/90">
          <p>Please read these Terms of Service (&quot;Terms&quot;, &quot;Terms of Service&quot;) carefully before using the Obi-Wan-Shop application (the &quot;Service&quot;) operated by Obi-Wan-Shop (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;).</p>
          <p>Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service.</p>
          <p>By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.</p>

          <h2>1. Accounts</h2>
          <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
          <p>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.</p>

          <h2>2. Intellectual Property</h2>
          <p>The Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of Obi-Wan-Shop and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.</p>

          <h2>3. Purchases</h2>
          <p>If you wish to purchase any product or service made available through the Service (&quot;Purchase&quot;), you may be asked to supply certain information relevant to your Purchase including, without limitation, your credit card number, the expiration date of your credit card, your billing address, and your shipping information.</p>
          <p>You represent and warrant that: (i) you have the legal right to use any credit card(s) or other payment method(s) in connection with any Purchase; and that (ii) the information you supply to us is true, correct and complete.</p>

          <h2>4. AI Recommendations</h2>
          <p>The style recommendations provided by our AI are for informational and suggestion purposes only. While we strive to provide accurate and helpful suggestions, Obi-Wan-Shop makes no warranties regarding the accuracy, completeness, or suitability of these recommendations. Your reliance on any information provided by the AI is solely at your own risk.</p>

          <h2>5. Termination</h2>
          <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
          <p>Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.</p>

          <h2>6. Limitation Of Liability</h2>
          <p>In no event shall Obi-Wan-Shop, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
          
          <h2>7. Changes</h2>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>

          <h2>8. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at legal@obiwanshop.com.</p>
        </CardContent>
      </Card>
    </div>
  );
}
