
"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useOrders } from '@/contexts/order-provider';
import { OrderCard } from '@/components/order-card';
import { Order } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CupSoda, CookingPot, Loader2, Bell, BellOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function StudentDashboardPage() {
  const { orders, notificationSubscriptions, toggleNotificationSubscription } = useOrders();
  const [currentOrders, setCurrentOrders] = useState<Order[]>([]);
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedCoupons, setSelectedCoupons] = useState<string[]>([]);
  const [isBatchMode, setIsBatchMode] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/student-login');
    }
  }, [user, loading, router]);

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

  const handleToggleSubscription = (orderId: string) => {
    if (isBatchMode) {
      setSelectedCoupons(prev => 
        prev.includes(orderId) 
          ? prev.filter(id => id !== orderId) 
          : [...prev, orderId]
      );
    } else {
      if (Notification.permission !== 'granted') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            toggleNotificationSubscription(orderId);
          }
        });
      } else {
        toggleNotificationSubscription(orderId);
      }
    }
  }

  const handleBatchToggle = () => {
    if (isBatchMode && selectedCoupons.length > 0) {
      if (Notification.permission !== 'granted') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            selectedCoupons.forEach(orderId => {
              // We only toggle if the current state is different
              if (!notificationSubscriptions.includes(orderId)) {
                toggleNotificationSubscription(orderId);
              }
            });
            setSelectedCoupons([]);
            setIsBatchMode(false);
          }
        });
      } else {
        selectedCoupons.forEach(orderId => {
          if (!notificationSubscriptions.includes(orderId)) {
            toggleNotificationSubscription(orderId);
          }
        });
        setSelectedCoupons([]);
        setIsBatchMode(false);
      }
    } else {
      setIsBatchMode(!isBatchMode);
      if (!isBatchMode) {
        setSelectedCoupons([]);
      }
    }
  }

  const readyOrders = currentOrders.filter(o => o.status === 'Ready');
  const preparingOrders = currentOrders.filter(o => o.status === 'Preparing');

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Your Order Status</h1>
        <p className="text-muted-foreground">Track the real-time status of your food order. Click the bell on a preparing coupon to get notified when it's ready.</p>
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
        isPreparingSection
        notificationSubscriptions={notificationSubscriptions}
        onToggleSubscription={handleToggleSubscription}
        selectedCoupons={selectedCoupons}
        isBatchMode={isBatchMode}
        onBatchToggle={handleBatchToggle}
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
    isPreparingSection?: boolean;
    notificationSubscriptions?: string[];
    onToggleSubscription?: (orderId: string) => void;
    selectedCoupons?: string[];
    isBatchMode?: boolean;
    onBatchToggle?: () => void;
}

function DashboardSection({ 
    title, 
    icon, 
    orders, 
    emptyMessage, 
    className, 
    isPreparingSection = false, 
    notificationSubscriptions, 
    onToggleSubscription,
    selectedCoupons = [],
    isBatchMode = false,
    onBatchToggle
}: DashboardSectionProps) {
    return (
        <Card className={cn("border shadow-sm", className)}>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-2xl font-bold flex items-center gap-3 text-foreground/80">
                    {icon}
                    <span>{title} ({orders.length})</span>
                </CardTitle>
                {isPreparingSection && (
                    <Button 
                        variant={isBatchMode ? "default" : "outline"} 
                        size="sm"
                        onClick={onBatchToggle}
                        className="flex items-center gap-2"
                    >
                        {isBatchMode ? (
                            <>
                                <Bell className="w-4 h-4" />
                                <span>Turn on {selectedCoupons.length} selected</span>
                            </>
                        ) : (
                            <>
                                <BellOff className="w-4 h-4" />
                                <span>Batch Toggle</span>
                            </>
                        )}
                    </Button>
                )}
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
                                className={cn(
                                    "transition-all duration-200 rounded-lg",
                                    isBatchMode && selectedCoupons.includes(order.id) ? "ring-2 ring-primary bg-primary/10" : ""
                                )}
                            >
                                <OrderCard 
                                    order={order} 
                                    role="student" 
                                    showBell={isPreparingSection}
                                    isSubscribed={isPreparingSection && notificationSubscriptions?.includes(order.id)}
                                    onToggleSubscription={onToggleSubscription}
                                    isSelected={selectedCoupons.includes(order.id)}
                                    isBatchMode={isBatchMode}
                                />
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
