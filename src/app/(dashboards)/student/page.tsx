
"use client";

import React from 'react';
import { useOrders } from '@/contexts/order-provider';
import { OrderCard } from '@/components/order-card';
import { Order } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CupSoda, CookingPot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

export default function StudentDashboardPage() {
  const { orders } = useOrders();

  const readyOrders = orders.filter(o => o.status === 'Ready');
  const preparingOrders = orders.filter(o => o.status === 'Preparing');
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-2xl md:text-3xl font-bold">Canteen Order Status</h1>
        <p className="text-muted-foreground mt-1">Track the real-time status of all food orders.</p>
      </div>

       {orders.length === 0 && (
        <Card className="text-center">
            <CardHeader>
                <CardTitle>No Active Orders</CardTitle>
                <CardDescription>The kitchen is quiet right now. No orders are being tracked.</CardDescription>
            </CardHeader>
        </Card>
      )}

      {readyOrders.length > 0 && (
        <DashboardSection
            title="Ready to Collect"
            icon={<CupSoda className="w-6 h-6 text-green-800"/>}
            orders={readyOrders}
            emptyMessage="No orders are ready for pickup yet."
            className="bg-green-100/60 dark:bg-green-900/30 border-green-300/20 dark:border-green-700/50"
        />
      )}

      {preparingOrders.length > 0 && (
        <DashboardSection
            title="Currently Preparing"
            icon={<CookingPot className="w-6 h-6 text-blue-800"/>}
            orders={preparingOrders}
            emptyMessage="You have no orders being prepared."
            className="bg-sky-100/60 dark:bg-sky-900/30 border-sky-300/20 dark:border-sky-700/50"
        />
      )}
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

function DashboardSection({
    title,
    icon,
    orders,
    emptyMessage,
    className,
}: DashboardSectionProps) {
    return (
        <Card className={cn("border shadow-sm", className)}>
            <CardHeader>
                <CardTitle className="font-headline text-xl md:text-2xl font-bold flex items-center gap-3 text-foreground/80">
                    {icon}
                    <span>{title} ({orders.length})</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {orders.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                        <AnimatePresence>
                        {orders.sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime()).map(order => {
                          return (
                             <motion.div
                                key={order.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="relative group"
                            >
                                <OrderCard
                                    order={order}
                                    role="student"
                                />
                            </motion.div>
                          )
                        })}
                        </AnimatePresence>
                    </div>
                ) : (
                    <p className="text-muted-foreground p-4 text-center">{emptyMessage}</p>
                )}
            </CardContent>
        </Card>
    )
}
