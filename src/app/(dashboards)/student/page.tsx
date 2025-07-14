"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useOrders } from '@/contexts/order-provider';
import { OrderCard } from '@/components/order-card';
import { Order } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CupSoda, CookingPot } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StudentDashboardPage() {
  const { orders } = useOrders();
  const [currentOrders, setCurrentOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission !== 'denied' && Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
    }
  }, []);

  useEffect(() => {
    const nonCompletedOrders = orders.filter(o => o.status === 'Preparing' || o.status === 'Ready');
    setCurrentOrders(nonCompletedOrders);
  }, [orders]);

  const readyOrders = currentOrders.filter(o => o.status === 'Ready');
  const preparingOrders = currentOrders.filter(o => o.status === 'Preparing');

  return (
    <div className="space-y-8">
       <div>
        <h1 className="font-headline text-3xl font-bold">Your Order Status</h1>
        <p className="text-muted-foreground">Track the real-time status of your food order.</p>
      </div>

      <DashboardSection 
        title="Ready to Collect" 
        icon={<CupSoda className="w-6 h-6 text-green-800"/>} 
        orders={readyOrders} 
        emptyMessage="No orders are ready for pickup yet. You'll be notified!" 
        className="bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700/50"
      />
      
      <DashboardSection 
        title="Currently Preparing" 
        icon={<CookingPot className="w-6 h-6 text-blue-800"/>} 
        orders={preparingOrders} 
        emptyMessage="You have no orders being prepared." 
        className="bg-sky-100 dark:bg-sky-900/30 border-sky-300 dark:border-sky-700/50"
      />
    </div>
  );
}

interface DashboardSectionProps {
    title: string;
    icon: React.ReactNode;
    orders: Order[];
    emptyMessage: string;
    className?: string;
}

function DashboardSection({ title, icon, orders, emptyMessage, className }: DashboardSectionProps) {
    return (
        <Card className={cn("border-2 shadow-lg", className)}>
            <CardHeader>
                <CardTitle className="font-headline text-2xl font-bold flex items-center gap-3 text-foreground/80">
                    {icon}
                    <span>{title} ({orders.length})</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {orders.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {orders.sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime()).map(order => <OrderCard key={order.id} order={order} role="student" />)}
                    </div>
                ) : (
                    <p className="text-muted-foreground">{emptyMessage}</p>
                )}
            </CardContent>
        </Card>
    )
}
