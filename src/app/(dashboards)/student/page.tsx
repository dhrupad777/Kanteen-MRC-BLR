"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useOrders } from '@/contexts/order-provider';
import { OrderCard } from '@/components/order-card';
import { Order } from '@/types';
import { useToast } from '@/hooks/use-toast';

const STUDENT_ID = 'student-007';

export default function StudentDashboardPage() {
  const { getOrdersByStudent } = useOrders();
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const { toast } = useToast();
  const notifiedOrderIds = useRef(new Set());

  // Effect for handling notifications
  useEffect(() => {
    // This effect is a stand-in for a proper push notification system.
    // It checks for "Ready" orders and uses the browser's Notification API.
    const checkAndNotify = (orders: Order[]) => {
      const readyOrders = orders.filter(
        (order) => order.status === 'Ready' && !notifiedOrderIds.current.has(order.id)
      );
      
      if (readyOrders.length > 0) {
        if (Notification.permission === 'granted') {
          readyOrders.forEach(order => {
            new Notification('Kanteen Order Ready!', {
              body: `Your order ${order.id} is ready for pickup.`,
              icon: '/icon.png' // You would place an icon in the public folder
            });
            notifiedOrderIds.current.add(order.id);
          });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
               readyOrders.forEach(order => {
                new Notification('Kanteen Order Ready!', {
                  body: `Your order ${order.id} is ready for pickup.`,
                  icon: '/icon.png'
                });
                notifiedOrderIds.current.add(order.id);
              });
            }
          });
        }
      }
    };
    
    // The toast listener gives us a hook into when order statuses might change.
    // This is a workaround because we don't have real-time subscriptions.
    const unsubscribe = (window as any).__toast_subscribe?.((t: any) => {
        const studentId = t.action?.props?.children?.props?.['data-student-id'];
        if (studentId === STUDENT_ID && t.title === 'Order Ready!') {
            const currentOrders = getOrdersByStudent(STUDENT_ID);
            setMyOrders(currentOrders);
            checkAndNotify(currentOrders);
        }
    });

    return () => unsubscribe?.();
  }, [getOrdersByStudent, toast]);
  
  useEffect(() => {
    const orders = getOrdersByStudent(STUDENT_ID);
    setMyOrders(orders);
  }, [getOrdersByStudent]);

  const activeOrders = myOrders.filter(o => o.status === 'Pending' || o.status === 'Preparing' || o.status === 'Ready');
  const pastOrders = myOrders.filter(o => o.status === 'Completed');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Your Active Orders</h1>
        <p className="text-muted-foreground">Track the real-time status of your food.</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeOrders.length > 0 ? (
            activeOrders.map(order => <OrderCard key={order.id} order={order} role="student" />)
          ) : (
            <p className="text-muted-foreground col-span-full">You have no active orders.</p>
          )}
        </div>
      </div>
      <div>
        <h2 className="font-headline text-3xl font-bold">Order History</h2>
        <p className="text-muted-foreground">A record of your completed orders.</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastOrders.length > 0 ? (
            pastOrders.map(order => <OrderCard key={order.id} order={order} role="student" />)
          ) : (
            <p className="text-muted-foreground col-span-full">No completed orders found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Add a simple subscription mechanism to the toast hook for notifications
if (typeof window !== 'undefined') {
  const originalToast = useToast().toast;
  const subscribers: any[] = [];
  (useToast as any).toast = (props: any) => {
    subscribers.forEach(s => s(props));
    return originalToast(props);
  };
  (window as any).__toast_subscribe = (callback: any) => {
    subscribers.push(callback);
    return () => {
      const index = subscribers.indexOf(callback);
      if (index > -1) {
        subscribers.splice(index, 1);
      }
    };
  };
}
