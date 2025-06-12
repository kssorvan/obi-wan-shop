
"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart as BarChartIcon, Users, ShoppingBag, Settings, ArrowRight, CreditCard, PackageCheck, AlertTriangle, AreaChart } from "lucide-react"; // Renamed BarChart to BarChartIcon
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const statCards = [
    { title: "Total Sales", value: "$12,345", change: "+5.2%", icon: CreditCard, color: "text-green-500", bgColor:"bg-green-500/10" },
    { title: "New Users", value: "245", change: "+12.1%", icon: Users, color: "text-blue-500", bgColor:"bg-blue-500/10" },
    { title: "Total Orders", value: "789", change: "-1.5%", icon: PackageCheck, color: "text-orange-500", bgColor:"bg-orange-500/10" },
    { title: "Pending Issues", value: "3", change: "+1", icon: AlertTriangle, color: "text-red-500", bgColor:"bg-red-500/10" },
];

const recentOrders = [
    { id: "ORD-001", customer: "Alice Wonderland", amount: "$129.98", status: "Delivered", date: "2024-07-18" },
    { id: "ORD-002", customer: "Bob The Builder", amount: "$89.00", status: "Shipped", date: "2024-07-19" },
    { id: "ORD-003", customer: "Eve Customer", amount: "$255.50", status: "Processing", date: "2024-07-20" },
];


export default function AdminDashboardPage() {
  const quickLinks = [
    { name: "Manage Products", href: "/admin/products", icon: ShoppingBag, description: "Add, edit, and view product listings." },
    { name: "Manage Users", href: "/admin/users", icon: Users, description: "View and manage user accounts." },
    { name: "View All Orders", href: "/admin/orders", icon: PackageCheck, description: "Track and manage customer orders." },
    { name: "Application Settings", href: "/admin/settings", icon: Settings, description: "Configure site-wide settings." },
  ];

  return (
    <div className="space-y-8">
      <Card className="shadow-lg border-primary/20">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">Admin Dashboard</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Welcome to the Obi-Wan-Shop Admin Panel. Manage your application efficiently from here.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Stat Cards Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className={`shadow-md hover:shadow-xl transition-shadow ${stat.bgColor}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-card-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
              <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600' }`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
      
      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Overview / Chart Section */}
        <Card className="lg:col-span-2 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl text-primary">Sales Overview</CardTitle>
            <CardDescription>Monthly sales performance and trends.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for chart */}
            <div className="h-72 w-full bg-muted rounded-md flex items-center justify-center">
              <AreaChart className="h-16 w-16 text-muted-foreground/50" />
              <p className="ml-4 text-muted-foreground">Sales chart will be displayed here.</p>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold text-foreground mb-2">Key Metrics</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>Revenue this month: <span className="font-bold text-primary">$8,210</span></div>
                <div>Avg. Order Value: <span className="font-bold text-primary">$75.50</span></div>
                <div>Conversion Rate: <span className="font-bold text-primary">3.2%</span></div>
                <div>New Customers: <span className="font-bold text-primary">102</span></div>
              </div>
            </div>
          </CardContent>
           <CardFooter className="flex justify-end">
             <Button variant="outline" asChild>
                <Link href="/admin/reports/sales">View Detailed Report <ArrowRight className="ml-2 h-4 w-4"/></Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Recent Orders Section */}
        <Card className="shadow-md">
           <CardHeader>
            <CardTitle className="text-xl text-primary">Recent Orders</CardTitle>
             <CardDescription>A quick look at the latest orders.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                       <Badge variant={order.status === 'Delivered' ? 'default' : order.status === 'Shipped' ? 'secondary' : 'outline'}
                              className={
                                order.status === 'Delivered' ? 'bg-green-500/20 text-green-700' :
                                order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-700' :
                                order.status === 'Processing' ? 'bg-orange-500/20 text-orange-700' : ''
                              }>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{order.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" asChild>
              <Link href="/admin/orders">View All Orders <ArrowRight className="ml-2 h-4 w-4"/></Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Quick Links Section */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-primary">Quick Actions & Links</CardTitle>
          <CardDescription>Navigate to key management areas quickly.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickLinks.map((link) => (
              <Card key={link.href} className="hover:shadow-lg hover:border-accent transition-all duration-300 flex flex-col group bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold text-primary group-hover:text-accent-foreground transition-colors">{link.name}</CardTitle>
                  <link.icon className="h-6 w-6 text-muted-foreground group-hover:text-accent-foreground transition-colors" />
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-xs text-muted-foreground">{link.description}</p>
                </CardContent>
                <CardFooter className="pt-0">
                   <Button variant="outline" size="sm" asChild className="w-full group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent transition-colors">
                    <Link href={link.href}>
                      Go to {link.name} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
