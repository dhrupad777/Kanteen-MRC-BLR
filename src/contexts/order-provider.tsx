"use client";

import type { ReactNode } from "react";
import React, { createContext, useCallback, useContext, useState } from 'react';
import { Order, OrderStatus } from '@/types';
import { useToast } from "@/hooks/use-toast"


const initialOrders: Order[] = [
  // Keeping some examples for different statuses
  {
    id: 'CPN-101',
    studentId: 'student-007',
    items: [{ name: 'Coupon Meal', quantity: 1 }],
    status: 'Preparing',
    createdAt: new Date(Date.now() - 10 * 60 * 1000),
  },
  {
    id: 'CPN-102',
    studentId: 'student-123',
    items: [{ name: 'Coupon Meal', quantity: 1 }],
    status: 'Preparing',
    createdAt: new Date(Date.now() - 8 * 60 * 1000),
  },
  {
    id: 'CPN-103',
    studentId: 'student-456',
    items: [{ name: 'Coupon Meal', quantity: 1 }],
    status: 'Ready',
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
  },
    {
    id: 'CPN-104',
    studentId: 'student-007',
    items: [{ name: 'Coupon Meal', quantity: 1 }],
    status: 'Completed',
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
  },
];

interface OrderContextType {
  orders: Order[];
  addOrder: (couponId: string) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  getOrdersByStudent: (studentId: string) => Order[];
  getOrdersByStatus: (status: OrderStatus) => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const { toast } = useToast();

  const addOrder = useCallback((couponId: string) => {
    // For simplicity, we assign a random student ID. In a real app, this would be linked to the coupon.
    const studentId = `student-${Math.floor(Math.random() * 1000)}`;
    const newOrder: Order = {
      id: couponId,
      studentId: studentId,
      items: [{ name: 'Coupon Meal', quantity: 1 }],
      status: 'Preparing',
      createdAt: new Date(),
    };

    setOrders(prevOrders => {
      // Prevent duplicate coupon entries
      if (prevOrders.some(o => o.id === couponId)) {
        toast({
          title: "Coupon Already Exists",
          description: `Coupon ${couponId} is already in the system.`,
          variant: "destructive"
        })
        return prevOrders;
      }
      return [newOrder, ...prevOrders]
    });
  }, [toast]);

  const updateOrderStatus = useCallback((orderId: string, newStatus: OrderStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.id === orderId) {
          if (newStatus === 'Ready') {
            toast({
              title: "Order Ready!",
              description: `Order ${orderId} is now ready for pickup.`,
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

  const getOrdersByStatus = useCallback((status: OrderStatus) => {
    return orders.filter(order => order.status === status);
  }, [orders]);


  const value = {
    orders,
    addOrder,
    updateOrderStatus,
    getOrdersByStudent,
    getOrdersByStatus,
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
