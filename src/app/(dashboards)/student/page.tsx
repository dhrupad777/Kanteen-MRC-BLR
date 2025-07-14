
"use client";

import React, { useEffect, useState } from 'react';
import { useOrders } from '@/contexts/order-provider';
import { OrderCard } from '@/components/order-card';
import { Order } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CupSoda, CookingPot, Loader2, Bell, BellOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function StudentDashboardPage() {
  const { orders, toggleNotificationSubscription } = useOrders();
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/student-login');
    }
  }, [user, loading, router]);

  const [notificationSubscriptions, setNotificationSubscriptions] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (userProfile?.subscriptions) {
      setNotificationSubscriptions(userProfile.subscriptions);
    }
  }, [userProfile]);

  const handleToggle = (couponId: string) => {
    const isSubscribed = notificationSubscriptions.includes(couponId);
    
    toggleNotificationSubscription(couponId, !isSubscribed);

    if (!isSubscribed) {
       toast({
        title: "Notifications Enabled",
        description: `You will now receive a notification when order #${couponId} is ready.`,
      });
    } else {
       toast({
        title: "Notifications Disabled",
        description: `You will no longer receive notifications for order #${couponId}.`,
      });
    }
  };


  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const userOrders = orders.filter(o => userProfile && userProfile.subscriptions.includes(o.studentId.split('-')[1]));
  
  const readyOrders = userOrders.filter(o => o.status === 'Ready');
  const preparingOrders = userOrders.filter(o => o.status === 'Preparing');
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-2xl md:text-3xl font-bold">Your Order Status</h1>
        <p className="text-muted-foreground mt-1">Track the real-time status of your food order.</p>
      </div>

       {userOrders.length === 0 && (
        <Card className="text-center">
            <CardHeader>
                <CardTitle>No Tracked Orders</CardTitle>
                <CardDescription>You are not currently tracking any orders.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Go to the main order display to track an order.</p>
                 <Button asChild className="mt-4">
                  <Link href="/ready-display">View All Orders</Link>
                </Button>
            </CardContent>
        </Card>
      )}

      {readyOrders.length > 0 && (
        <DashboardSection
            title="Ready to Collect"
            icon={<CupSoda className="w-6 h-6 text-green-800"/>}
            orders={readyOrders}
            emptyMessage="No orders are ready for pickup yet."
            className="bg-green-100/60 dark:bg-green-900/30 border-green-300/20 dark:border-green-700/50"
            onToggle={handleToggle}
            subscriptions={notificationSubscriptions}
        />
      )}

      {preparingOrders.length > 0 && (
        <DashboardSection
            title="Currently Preparing"
            icon={<CookingPot className="w-6 h-6 text-blue-800"/>}
            orders={preparingOrders}
            emptyMessage="You have no orders being prepared."
            className="bg-sky-100/60 dark:bg-sky-900/30 border-sky-300/20 dark:border-sky-700/50"
            onToggle={handleToggle}
            subscriptions={notificationSubscriptions}
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
    onToggle: (couponId: string) => void;
    subscriptions: string[];
}

function DashboardSection({
    title,
    icon,
    orders,
    emptyMessage,
    className,
    onToggle,
    subscriptions,
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
                        {orders.sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime()).map(order => {
                          const couponId = order.studentId.split('-')[1];
                          const isSubscribed = subscriptions.includes(couponId);
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
                                 <button
                                    onClick={() => onToggle(couponId)}
                                    className={cn(
                                        "absolute top-2 right-2 p-1.5 rounded-full transition-all duration-200 opacity-50 group-hover:opacity-100",
                                        isSubscribed ? "bg-primary/20 text-primary" : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                    )}
                                    aria-label={isSubscribed ? `Disable notifications for order ${couponId}` : `Enable notifications for order ${couponId}`}
                                >
                                    {isSubscribed ? <Bell className="w-4 h-4"/> : <BellOff className="w-4 h-4"/>}
                                </button>
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
