
"use client";

import { useEffect, useState } from 'react';
import { useOrders } from '@/contexts/order-provider';
import { Order } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';

export default function ReadyDisplayPage() {
  const { getOrdersByStatus } = useOrders();
  const [readyOrders, setReadyOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Initial fetch
    setReadyOrders(getOrdersByStatus('Ready'));

    // Poll for updates every 2 seconds. In a real app, use WebSockets.
    const interval = setInterval(() => {
      setReadyOrders(getOrdersByStatus('Ready'));
    }, 2000);

    return () => clearInterval(interval);
  }, [getOrdersByStatus]);

  const half = Math.ceil(readyOrders.length / 2);
  const firstHalf = readyOrders.slice(0, half);
  const secondHalf = readyOrders.slice(half);

  return (
    <div className="bg-background text-foreground min-h-screen p-8">
      <header className="text-center mb-8">
        <h1 className="text-6xl font-bold font-headline tracking-tight text-primary">Ready for Pickup</h1>
        <p className="text-muted-foreground text-2xl mt-2">Listen for your order number!</p>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="flex flex-col gap-6">
            <AnimatePresence>
                {firstHalf.map((order, index) => (
                    <motion.div
                        key={order.id}
                        layout
                        initial={{ opacity: 0, y: 50, scale: 0.3 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                    >
                        <Card className="bg-green-100/50 dark:bg-green-900/30 border-2 border-green-500 shadow-2xl shadow-green-500/10">
                            <CardHeader>
                                <CardTitle className="text-7xl font-mono font-extrabold text-center text-green-700 dark:text-green-300 tracking-wider">
                                    {order.id}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
        <div className="flex flex-col gap-6">
            <AnimatePresence>
                {secondHalf.map((order, index) => (
                     <motion.div
                        key={order.id}
                        layout
                        initial={{ opacity: 0, y: 50, scale: 0.3 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                    >
                        <Card className="bg-green-100/50 dark:bg-green-900/30 border-2 border-green-500 shadow-2xl shadow-green-500/10">
                            <CardHeader>
                                <CardTitle className="text-7xl font-mono font-extrabold text-center text-green-700 dark:text-green-300 tracking-wider">
                                    {order.id}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
