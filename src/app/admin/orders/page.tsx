
"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Search, Eye, Edit, Truck, Filter, Package } from "lucide-react";
import { mockAdminOrders } from "@/data/admin-mock-data";
import type { AdminOrder } from "@/types";

const ITEMS_PER_PAGE = 10;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>(mockAdminOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilters, setStatusFilters] = useState<Record<AdminOrder['status'], boolean>>({
    Pending: true, Processing: true, Shipped: true, Delivered: true, Cancelled: true, Refunded: true
  });

  const filteredOrders = orders.filter(order => {
    const searchMatch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilters[order.status];
    return searchMatch && statusMatch;
  });

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleStatusFilterChange = (status: AdminOrder['status']) => {
    setStatusFilters(prev => ({ ...prev, [status]: !prev[status] }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-headline text-primary flex items-center">
                <Package className="mr-2 h-6 w-6"/> Manage Orders
              </CardTitle>
              <CardDescription>View and manage customer orders.</CardDescription>
            </div>
            {/* Add Order button typically not needed for admin, orders come from customers */}
          </div>
        </CardHeader>
      </Card>

      <Card>
         <CardHeader>
            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full md:w-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                    type="search"
                    placeholder="Search orders by ID, customer name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-full"
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <Filter className="mr-2 h-4 w-4" /> Filter by Status
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Order Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {Object.keys(statusFilters).map((status) => (
                            <DropdownMenuCheckboxItem
                                key={status}
                                checked={statusFilters[status as AdminOrder['status']]}
                                onCheckedChange={() => handleStatusFilterChange(status as AdminOrder['status'])}
                            >
                                {status}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-center">Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>{order.customerName}</div>
                        <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                      </TableCell>
                      <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                      <TableCell className="text-center">{order.itemCount}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === 'Delivered' ? 'default' :
                            order.status === 'Shipped' ? 'secondary' :
                            order.status === 'Processing' ? 'outline' :
                            order.status === 'Pending' ? 'outline' :
                            'destructive'
                          }
                          className={
                            order.status === 'Delivered' ? 'bg-green-100 text-green-700 border-green-300' :
                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                            order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                            order.status === 'Pending' ? 'bg-gray-100 text-gray-700 border-gray-300' :
                            'bg-red-100 text-red-700 border-red-300' // Cancelled or Refunded
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                               <Link href={`/admin/orders/details/${order.id}`}><Eye className="mr-2 h-4 w-4" /> View Details</Link>
                            </DropdownMenuItem>
                             <DropdownMenuItem>
                               <Edit className="mr-2 h-4 w-4" /> Update Status
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                               <Truck className="mr-2 h-4 w-4" /> Add Tracking
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                      No orders found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
         {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
