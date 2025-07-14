
"use client";

import React, { useEffect, useState } from 'react';
import { useOrders } from '@/contexts/order-provider';
import { OrderCard } from '@/components/order-card';
import { Order } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CupSoda, CookingPot, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const customerInfoSchema = z.object({
  name: z.string().min(2, { message: "Please enter your name." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type CustomerInfo = z.infer<typeof customerInfoSchema>;

export default function StudentDashboardPage() {
  const { orders } = useOrders();
  const [currentOrders, setCurrentOrders] = useState<Order[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<CustomerInfo>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    try {
      const storedInfo = localStorage.getItem('kanteenCustomer');
      if (storedInfo) {
        setCustomerInfo(JSON.parse(storedInfo));
      }
    } catch (error) {
        console.error("Could not parse customer info from localStorage", error);
        localStorage.removeItem('kanteenCustomer');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const nonCompletedOrders = orders.filter(o => o.status === 'Preparing' || o.status === 'Ready');
    setCurrentOrders(nonCompletedOrders);
  }, [orders]);

  const onSubmit = (values: CustomerInfo) => {
    localStorage.setItem('kanteenCustomer', JSON.stringify(values));
    setCustomerInfo(values);
    form.reset();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!customerInfo) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Welcome!</CardTitle>
            <CardDescription>
              Please enter your details to view your order status. We'll remember you for next time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Email</FormLabel>
                      <FormControl>
                        <Input placeholder="jane.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  View My Orders
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const readyOrders = currentOrders.filter(o => o.status === 'Ready');
  const preparingOrders = currentOrders.filter(o => o.status === 'Preparing');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-2xl md:text-3xl font-bold">Your Order Status</h1>
        <p className="text-muted-foreground mt-1">Track the real-time status of your food order.</p>
      </div>

      <DashboardSection
        title="Ready to Collect"
        icon={<CupSoda className="w-6 h-6 text-green-800"/>}
        orders={readyOrders}
        emptyMessage="No orders are ready for pickup yet."
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                        <AnimatePresence>
                        {orders.sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime()).map(order => (
                             <motion.div
                                key={order.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                            >
                                <OrderCard
                                    order={order}
                                    role="student"
                                />
                            </motion.div>
                        ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <p className="text-muted-foreground p-4 text-center">{emptyMessage}</p>
                )}
            </CardContent>
        </Card>
    )
}

    