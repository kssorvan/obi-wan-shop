
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"; // Using ShadCN checkbox for better styling
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Truck, Gift, Headset, MessageSquare } from "lucide-react";
import Link from "next/link";

// Custom SVG Icons as React Components
const BriefcaseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" {...props}>
    <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z" />
  </svg>
);

const ReturnIcon = (props: React.SVGProps<SVGSVGElement>) => (
 <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 256 256" {...props}>
    <path d="M182,104v32a6,6,0,0,1-6,6H94.48l13.76,13.76a6,6,0,1,1-8.48,8.48l-24-24a6,6,0,0,1,0-8.48l24-24a6,6,0,0,1,8.48,8.48L94.48,130H170V104a6,6,0,0,1,12,0Zm48-48V200a14,14,0,0,1-14,14H40a14,14,0,0,1-14-14V56A14,14,0,0,1,40,42H216A14,14,0,0,1,230,56Zm-12,0a2,2,0,0,0-2-2H40a2,2,0,0,0-2,2V200a2,2,0,0,0,2,2H216a2,2,0,0,0,2-2Z" />
  </svg>
);


const featureItems = [
  { icon: Truck, title: "Free Shipping", description: "For all Orders Over $100" },
  { icon: ReturnIcon, title: "30 Days Returns", description: "For an Exchange Product" },
  { icon: BriefcaseIcon, title: "Secured Payment", description: "Payment Cards Accepted" },
  { icon: Gift, title: "Special Gifts", description: "Our First Product Order" },
  { icon: Headset, title: "Support 24/7", description: "Contact us Anytime" },
];

const productLinks = [
  { href: "/", label: "Prices drop" },
  { href: "/", label: "New products" },
  { href: "/", label: "Best sales" },
  { href: "/contact-us", label: "Contact us" },
  { href: "/", label: "Sitemap" },
  { href: "/", label: "Stores" },
];

const companyLinks = [
  { href: "/", label: "Delivery" },
  { href: "/legal/terms-of-service", label: "Legal Notice" },
  { href: "/legal/terms-of-service", label: "Terms and conditions of use" },
  { href: "/about-us", label: "About us" },
  { href: "/", label: "Secure payment" },
  { href: "/auth/signin", label: "Login" },
];

export function PreFooter() {
  return (
    <section className="py-6 bg-gray-50 text-foreground">
      <div className="container">
        <div className="flex items-stretch justify-center gap-2 py-3 lg:py-8 flex-wrap">
          {featureItems.map((item, index) => (
            <div key={index} className="col flex items-center justify-start flex-col text-center group w-full sm:w-[45%] md:w-[30%] lg:w-[18%] p-4">
              <item.icon className="h-10 w-10 text-muted-foreground transition-all duration-300 group-hover:text-primary group-hover:-translate-y-1" />
              <h3 className="text-[16px] font-semibold mt-3">{item.title}</h3>
              <p className="text-[12px] font-medium text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
        <Separator className="my-4 md:my-6" />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-8">
          <div className="md:col-span-4 lg:col-span-3 md:border-r md:border-border pr-0 md:pr-6">
            <h2 className="text-lg font-semibold mb-4">Contact us</h2>
            <p className="text-sm text-muted-foreground pb-4">
              Obi-Wan-Shop - Mega Super Store<br />
              507-Union Trade Centre France
            </p>
            <a className="text-sm text-primary hover:underline" href="mailto:sales@obiwanshop.com">
              sales@obiwanshop.com
            </a>
            <span className="text-xl font-semibold block w-full mt-3 mb-5 text-primary">
              (+91) 9876-543-210
            </span>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-10 w-10 text-primary" />
              <span className="text-base font-semibold">
                Online Chat<br />Get Expert Help
              </span>
            </div>
          </div>

          <div className="md:col-span-8 lg:col-span-5 flex">
            <div className="w-1/2">
              <h2 className="text-lg font-semibold mb-4">Products</h2>
              <ul className="space-y-2">
                {productLinks.map((link, index) => (
                  <li key={index} className="text-sm">
                    <Link href={link.href} className="text-muted-foreground hover:text-primary hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-1/2">
              <h2 className="text-lg font-semibold mb-4">Our company</h2>
              <ul className="space-y-2">
                {companyLinks.map((link, index) => (
                  <li key={index} className="text-sm">
                    <Link href={link.href} className="text-muted-foreground hover:text-primary hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:col-span-12 lg:col-span-4 flex flex-col mt-5 lg:mt-0">
            <h2 className="text-lg font-semibold mb-2 lg:mb-4">Subscribe to newsletter</h2>
            <p className="text-sm text-muted-foreground">
              Subscribe to our latest newsletter to get news about special discounts.
            </p>
            <form className="mt-5 space-y-4">
              <Input
                type="email"
                className="h-[45px]"
                placeholder="Your Email Address"
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                SUBSCRIBE
              </Button>
              <div className="flex items-center space-x-2 mt-3 lg:mt-0">
                <Checkbox id="terms-newsletter" />
                <Label htmlFor="terms-newsletter" className="text-xs text-muted-foreground">
                  I agree to the terms and conditions and the privacy policy
                </Label>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
