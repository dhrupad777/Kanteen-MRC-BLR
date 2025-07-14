"use client";

import type { ReactNode } from "react";
import React, { createContext, useCallback, useContext, useState } from 'react';
import { Order, OrderStatus } from '@/types';
import { useToast } from "@/hooks/use-toast"


const initialOrders: Order[] = [
  {
    id: 'ORD-001',
    studentId: 'student-007',
    items: [{ name: 'Spicy Chicken Burger', quantity: 1 }, { name: 'Fries', quantity: 1 }],
    status: 'Pending',
    createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
  },
  {
    id: 'ORD-002',
    studentId: 'student-123',
    items: [{ name: 'Veggie Wrap', quantity: 1 }],
    status: 'Pending',
    createdAt: new Date(Date.now() - 3 * 60 * 1000),
  },
  {
    id: 'ORD-003',
    studentId: 'student-456',
    items: [{ name: 'Pasta Alfredo', quantity: 1 }, { name: 'Garlic Bread', quantity: 2 }],
    status: 'Preparing',
    createdAt: new Date(Date.now() - 10 * 60 * 1000),
  },
  {
    id: 'ORD-004',
    studentId: 'student-007',
    items: [{ name: 'Iced Coffee', quantity: 1 }],
    status: 'Preparing',
    createdAt: new Date(Date.now() - 8 * 60 * 1000),
  },
  {
    id: 'ORD-005',
    studentId: 'student-789',
    items: [{ name: 'Margherita Pizza', quantity: 1 }],
    status: 'Ready',
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    id: 'ORD-006',
    studentId: 'student-007',
    items: [{ name: 'Smoothie', quantity: 1 }],
    status: 'Completed',
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
  },
];

interface OrderContextType {
  orders: Order[];
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  getOrdersByStudent: (studentId: string) => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const { toast } = useToast();

  const updateOrderStatus = useCallback((orderId: string, newStatus: OrderStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.id === orderId) {
          console.log(`Updating order ${orderId} for student ${order.studentId} to ${newStatus}`);
          if (newStatus === 'Ready') {
            // This is a placeholder for a real notification system.
            // In a real app, this would trigger a push notification.
            // We pass the studentId to the toast for potential use in the notification.
            toast({
              title: "Order Ready!",
              description: `Your order ${orderId} is now ready for pickup.`,
              action: (
                <div data-student-id={order.studentId}></div>
              )
            })
          }
          return { ...order, status: newStatus };
        }
        return order;
      })
    );
  }, [toast]);

  const getOrdersByStudent = useCallback((studentId: string) => {
    return orders.filter(order => order.studentId === studentId);
  }, [orders]);


  const value = {
    orders,
    updateOrderStatus,
    getOrdersByStudent,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
