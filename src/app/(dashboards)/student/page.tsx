"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useOrders } from '@/contexts/order-provider';
import { OrderCard } from '@/components/order-card';
import { Order } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CupSoda, CookingPot } from 'lucide-react';


const STUDENT_ID = 'student-007'; // This is now a generic view for all students

export default function StudentDashboardPage() {
  const { orders } = useOrders();
  const [currentOrders, setCurrentOrders] = useState<Order[]>([]);
  const notifiedOrderIds = useRef(new Set());

  // This effect simulates real-time updates by polling.
  // In a production app, this should be replaced with a WebSocket connection.
  useEffect(() => {
    const fetchOrders = () => {
        // We get all non-completed orders for the display
        const nonCompletedOrders = orders.filter(o => o.status === 'Preparing' || o.status === 'Ready');
        setCurrentOrders(nonCompletedOrders);
    };

    fetchOrders(); // Initial fetch
    const intervalId = setInterval(fetchOrders, 2000); // Poll every 2 seconds

    return () => clearInterval(intervalId);
  }, [orders]);


  // Effect for handling notifications
  useEffect(() => {
    const checkAndNotify = (orders: Order[]) => {
      const readyOrders = orders.filter(
        (order) => order.status === 'Ready' && !notifiedOrderIds.current.has(order.id)
      );
      
      if (readyOrders.length > 0 && typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          readyOrders.forEach(order => {
            new Notification('Kanteen Order Ready!', {
              body: `Your order ${order.id} is ready for pickup.`,
            });
            notifiedOrderIds.current.add(order.id);
          });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
               readyOrders.forEach(order => {
                new Notification('Kanteen Order Ready!', {
                  body: `Your order ${order.id} is ready for pickup.`,
                });
                notifiedOrderIds.current.add(order.id);
              });
            }
          });
        }
      }
    };
    
    checkAndNotify(currentOrders);

  }, [currentOrders]);
  

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
        icon={<CupSoda className="w-6 h-6 text-green-500"/>} 
        orders={readyOrders} 
        emptyMessage="No orders are ready for pickup yet. You'll be notified!" 
        isHighlighted
      />
      
      <DashboardSection 
        title="Currently Preparing" 
        icon={<CookingPot className="w-6 h-6 text-blue-500"/>} 
        orders={preparingOrders} 
        emptyMessage="You have no orders being prepared." 
      />
    </div>
  );
}

interface DashboardSectionProps {
    title: string;
    icon: React.ReactNode;
    orders: Order[];
    emptyMessage: string;
    isHighlighted?: boolean;
}

function DashboardSection({ title, icon, orders, emptyMessage, isHighlighted = false }: DashboardSectionProps) {
    return (
        <Card className={isHighlighted ? "border-primary border-2 shadow-lg" : ""}>
            <CardHeader>
                <CardTitle className="font-headline text-2xl font-bold flex items-center gap-3">
                    {icon}
                    <span>{title} ({orders.length})</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {orders.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {orders.sort((a,b) => parseInt(a.id) - parseInt(b.id)).map(order => <OrderCard key={order.id} order={order} role="student" />)}
                    </div>
                ) : (
                    <p className="text-muted-foreground">{emptyMessage}</p>
                )}
            </CardContent>
        </Card>
    )
}
