"use client";

import { useOrders } from '@/contexts/order-provider';
import { OrderCard } from '@/components/order-card';
import { OrderStatus } from '@/types';
import { ChefHat, CookingPot } from 'lucide-react';
import { CouponEntryForm } from '@/components/coupon-entry-form';

export default function StaffDashboardPage() {
  const { orders, updateOrderStatus } = useOrders();

  const orderColumns: { title: string; status: OrderStatus, icon: React.ReactNode }[] = [
    { title: 'Preparing', status: 'Preparing', icon: <CookingPot className="mr-2 h-5 w-5 text-primary" /> },
    { title: 'Ready', status: 'Ready', icon: <ChefHat className="mr-2 h-5 w-5 text-green-500" /> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-headline text-3xl font-bold">Order Manager Dashboard</h1>
          <p className="text-muted-foreground">Manage incoming orders and move them to ready when prepared.</p>
        </div>
      </div>
      <div className="space-y-8">
          <CouponEntryForm />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
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
                      columnOrders.sort((a,b) => parseInt(a.id) - parseInt(b.id)).map(order => (
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
    </div>
  );
}
