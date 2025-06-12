
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-12 max-w-3xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-4xl font-headline text-primary">Privacy Policy</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-1">Last Updated: {new Date().toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-lg max-w-none text-foreground/90">
          <p>Welcome to Obi-Wan-Shop. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at privacy@obiwanshop.com.</p>

          <h2>1. What Information Do We Collect?</h2>
          <p>We collect personal information that you voluntarily provide to us when you register on the Obi-Wan-Shop, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Obi-Wan-Shop (such as posting messages in our online forums or entering competitions, contests or giveaways) or otherwise when you contact us.</p>
          <p>The personal information that we collect depends on the context of your interactions with us and the Obi-Wan-Shop, the choices you make and the products and features you use. The personal information we collect may include the following: email address, name, purchase history, and browsing behavior.</p>

          <h2>2. How Do We Use Your Information?</h2>
          <p>We use personal information collected via our Obi-Wan-Shop for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
          <ul>
            <li>To facilitate account creation and logon process.</li>
            <li>To post testimonials.</li>
            <li>To send administrative information to you.</li>
            <li>To manage user accounts.</li>
            <li>To deliver and facilitate delivery of services to the user.</li>
            <li>To provide personalized style recommendations.</li>
          </ul>

          <h2>3. Will Your Information Be Shared With Anyone?</h2>
          <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
          
          <h2>4. How Long Do We Keep Your Information?</h2>
          <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements).</p>

          <h2>5. How Do We Keep Your Information Safe?</h2>
          <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.</p>

          <h2>6. What Are Your Privacy Rights?</h2>
          <p>In some regions (like the European Economic Area and the UK), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability.</p>

          <h2>7. Updates To This Notice</h2>
          <p>We may update this privacy notice from time to time. The updated version will be indicated by an updated &quot;Revised&quot; date and the updated version will be effective as soon as it is accessible.</p>

          <h2>8. How Can You Contact Us About This Notice?</h2>
          <p>If you have questions or comments about this notice, you may email us at privacy@obiwanshop.com.</p>
        </CardContent>
      </Card>
    </div>
  );
}
