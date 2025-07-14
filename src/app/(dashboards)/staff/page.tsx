"use client";

import { useOrders } from '@/contexts/order-provider';
import { OrderCard } from '@/components/order-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderStatus } from '@/types';
import { BottleneckPredictor } from '@/components/bottleneck-predictor';
import { ChefHat, CookingPot, Bot, CheckCircle2, ListOrdered } from 'lucide-react';
import { CouponEntryForm } from '@/components/coupon-entry-form';

export default function StaffDashboardPage() {
  const { orders, updateOrderStatus } = useOrders();

  const orderColumns: { title: string; status: OrderStatus, icon: React.ReactNode }[] = [
    { title: 'Preparing', status: 'Preparing', icon: <CookingPot className="mr-2 h-5 w-5 text-primary" /> },
    { title: 'Ready', status: 'Ready', icon: <ChefHat className="mr-2 h-5 w-5 text-green-500" /> },
    { title: 'Completed', status: 'Completed', icon: <CheckCircle2 className="mr-2 h-5 w-5 text-gray-500" /> },
  ];

  return (
    <Tabs defaultValue="orders" className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-headline text-3xl font-bold">Staff Dashboard</h1>
          <p className="text-muted-foreground">Manage incoming orders and optimize kitchen workflow.</p>
        </div>
        <TabsList>
          <TabsTrigger value="orders">
            <ListOrdered className="mr-2 h-4 w-4" />
            Live Orders
          </TabsTrigger>
          <TabsTrigger value="prediction">
            <Bot className="mr-2 h-4 w-4" />
            Bottleneck AI
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="orders">
        <div className="space-y-8">
            <CouponEntryForm />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {orderColumns.map(column => {
                const columnOrders = orders.filter(o => o.status === column.status);
                return (
                <div key={column.title} className="space-y-4 p-4 bg-muted/50 rounded-lg h-full">
                    <h2 className="font-headline text-xl font-semibold flex items-center">
                      {column.icon}
                      {column.title} ({columnOrders.length})
                    </h2>
                    <div className="space-y-4">
                    {columnOrders.length > 0 ? (
                        columnOrders.map(order => (
                        <OrderCard key={order.id} order={order} role="staff" onStatusChange={updateOrderStatus} />
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground p-4 text-center">No orders in this state.</p>
                    )}
                    </div>
                </div>
                );
            })}
            </div>
        </div>
      </TabsContent>
      <TabsContent value="prediction">
        <BottleneckPredictor />
      </TabsContent>
    </Tabs>
  );
}
