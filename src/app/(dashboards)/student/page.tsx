"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useOrders } from '@/contexts/order-provider';
import { OrderCard } from '@/components/order-card';
import { Order } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CupSoda, List, History } from 'lucide-react';


const STUDENT_ID = 'student-007'; // Example student ID

export default function StudentDashboardPage() {
  const { getOrdersByStudent } = useOrders();
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const { toast } = useToast();
  const notifiedOrderIds = useRef(new Set());

  // This effect simulates real-time updates by polling.
  // In a production app, this should be replaced with a WebSocket connection.
  useEffect(() => {
    const fetchOrders = () => {
        const currentOrders = getOrdersByStudent(STUDENT_ID);
        setMyOrders(currentOrders);
    };

    fetchOrders(); // Initial fetch
    const intervalId = setInterval(fetchOrders, 3000); // Poll every 3 seconds

    return () => clearInterval(intervalId);
  }, [getOrdersByStudent]);


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
    
    checkAndNotify(myOrders);

  }, [myOrders, toast]);
  

  const readyOrders = myOrders.filter(o => o.status === 'Ready');
  const preparingOrders = myOrders.filter(o => o.status === 'Preparing');
  const pastOrders = myOrders.filter(o => o.status === 'Completed');

  return (
    <div className="space-y-8">
       <div>
        <h1 className="font-headline text-3xl font-bold">Your Dashboard</h1>
        <p className="text-muted-foreground">Track the real-time status of your food for Student ID: {STUDENT_ID}</p>
      </div>

      <DashboardSection 
        title="Ready for Pickup" 
        icon={<CupSoda className="w-6 h-6 text-green-500"/>} 
        orders={readyOrders} 
        emptyMessage="No orders are ready for pickup yet. You'll be notified!" 
        isHighlighted
      />
      
      <DashboardSection 
        title="Currently Preparing" 
        icon={<List className="w-6 h-6 text-blue-500"/>} 
        orders={preparingOrders} 
        emptyMessage="You have no orders being prepared." 
      />

      <DashboardSection 
        title="Order History" 
        icon={<History className="w-6 h-6 text-gray-500"/>} 
        orders={pastOrders} 
        emptyMessage="No completed orders found." 
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
                        {orders.map(order => <OrderCard key={order.id} order={order} role="student" />)}
                    </div>
                ) : (
                    <p className="text-muted-foreground">{emptyMessage}</p>
                )}
            </CardContent>
        </Card>
    )
}
