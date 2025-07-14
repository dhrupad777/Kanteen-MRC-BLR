"use client";

import type { ReactNode } from "react";
import React, { createContext, useCallback, useContext, useState, useEffect } from 'react';
import { Order, OrderStatus } from '@/types';
import { useToast } from "@/hooks/use-toast"


const initialOrders: Order[] = [
  {
    id: '101',
    studentId: 'student-007',
    items: [{ name: 'Coupon Meal', quantity: 1 }],
    status: 'Preparing',
    createdAt: new Date(Date.now() - 10 * 60 * 1000),
  },
  {
    id: '103',
    studentId: 'student-456',
    items: [{ name: 'Coupon Meal', quantity: 1 }],
    status: 'Ready',
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
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
  const [lastUpdatedOrder, setLastUpdatedOrder] = useState<{ id: string; status: OrderStatus } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (lastUpdatedOrder && lastUpdatedOrder.status === 'Ready') {
      toast({
        title: "Order Ready!",
        description: `Order ${lastUpdatedOrder.id} is now ready for pickup.`,
      });
      // Reset after showing toast to prevent re-firing on other re-renders
      setLastUpdatedOrder(null); 
    }
  }, [lastUpdatedOrder, toast]);


  const addOrder = useCallback((couponId: string) => {
    const newOrder: Order = {
      id: couponId,
      studentId: `student-${couponId}`,
      items: [{ name: 'Coupon Meal', quantity: 1 }],
      status: 'Preparing',
      createdAt: new Date(),
    };

    setOrders(prevOrders => {
      if (prevOrders.some(o => o.id === couponId && o.status !== 'Completed')) {
        toast({
          title: "Coupon Already In Progress",
          description: `Coupon ${couponId} is already in the Preparing or Ready queue.`,
          variant: "destructive"
        })
        return prevOrders;
      }
      return [newOrder, ...prevOrders]
    });
  }, [toast]);

  const updateOrderStatus = useCallback((orderId: string, newStatus: OrderStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    // Track the last updated order to trigger the toast effect
    setLastUpdatedOrder({ id: orderId, status: newStatus });
  }, []);

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
