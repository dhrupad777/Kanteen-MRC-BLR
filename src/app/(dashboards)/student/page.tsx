
"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useOrders } from '@/contexts/order-provider';
import { OrderCard } from '@/components/order-card';
import { Order } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CupSoda, CookingPot, ChefHat } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

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
        className="bg-green-100/60 dark:bg-green-900/30 border-green-300/20 dark:border-green-700/50"
      />
      
      <DashboardSection 
        title="Currently Preparing" 
        icon={<CookingPot className="w-6 h-6 text-blue-800"/>} 
        orders={preparingOrders} 
        emptyMessage="You have no orders being prepared." 
        className="bg-sky-100/60 dark:bg-sky-900/30 border-sky-300/20 dark:border-sky-700/50"
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
        <Card className={cn("border shadow-sm", className)}>
            <CardHeader>
                <CardTitle className="font-headline text-2xl font-bold flex items-center gap-3 text-foreground/80">
                    {icon}
                    <span>{title} ({orders.length})</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {orders.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <AnimatePresence>
                        {orders.sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime()).map(order => (
                            <motion.div
                                key={order.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="relative group"
                            >
                                <OrderCard key={order.id} order={order} role="student" />
                                <AnimatePresence>
                                <motion.div
                                    key="mascot"
                                    initial={{ opacity: 0, scale: 0.8, x: 20 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute -right-4 -top-6 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                >
                                     <ChefHat className={cn(
                                         "w-24 h-24 text-primary/20 transition-all duration-300",
                                         order.status === 'Preparing' && 'text-blue-400',
                                         order.status === 'Ready' && 'text-green-400'
                                         )} 
                                         strokeWidth={1}
                                     />
                                </motion.div>
                                </AnimatePresence>
                            </motion.div>
                        ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <p className="text-muted-foreground">{emptyMessage}</p>
                )}
            </CardContent>
        </Card>
    )
}
