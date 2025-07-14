"use client";

import type { ReactNode } from "react";
import React, { createContext, useCallback, useContext, useState, useEffect } from 'react';
import { Order, OrderStatus } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { db } from '@/lib/firebase';
import { collection, doc, addDoc, updateDoc, onSnapshot, query, where, serverTimestamp, Timestamp } from "firebase/firestore";

interface OrderContextType {
  orders: Order[];
  addOrder: (couponId: string) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  getOrdersByStudent: (studentId: string) => Order[];
  getOrdersByStatus: (status: OrderStatus) => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, "orders"), where("status", "!=", "Archived"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ordersData: Order[] = [];
      let latestReadyOrder: Order | null = null;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const order: Order = {
          id: doc.id,
          studentId: data.studentId,
          items: data.items,
          status: data.status,
          createdAt: (data.createdAt as Timestamp).toDate(),
        };
        ordersData.push(order);
        
        const oldOrder = orders.find(o => o.id === order.id);
        if (oldOrder && oldOrder.status !== 'Ready' && order.status === 'Ready') {
            latestReadyOrder = order;
        }
      });

      setOrders(ordersData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));

      if (latestReadyOrder) {
        toast({
            title: "Order Ready!",
            description: `Order for coupon ${latestReadyOrder.studentId.split('-')[1]} is now ready for pickup.`,
        });
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
             new Notification('Kanteen Order Ready!', {
              body: `Your order for coupon ${latestReadyOrder.studentId.split('-')[1]} is ready for pickup.`,
            });
        }
      }
    });

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Pass `orders` to compare old and new state for notifications


  const addOrder = useCallback(async (couponId: string) => {
    // Check if an active order for this coupon already exists
     const activeOrder = orders.find(o => o.studentId === `student-${couponId}` && o.status !== 'Completed');
      if (activeOrder) {
        toast({
          title: "Coupon Already In Progress",
          description: `Coupon ${couponId} is already in the Preparing or Ready queue.`,
          variant: "destructive"
        })
        return;
      }
    
    try {
      await addDoc(collection(db, "orders"), {
        studentId: `student-${couponId}`,
        items: [{ name: 'Coupon Meal', quantity: 1 }],
        status: 'Preparing',
        createdAt: serverTimestamp(),
      });
    } catch (error) {
        console.error("Error adding document: ", error);
        toast({
            title: "Error",
            description: "Could not add order. Please try again.",
            variant: "destructive"
        })
    }
  }, [orders, toast]);

  const updateOrderStatus = useCallback(async (orderId: string, newStatus: OrderStatus) => {
    const orderRef = doc(db, "orders", orderId);
    try {
        await updateDoc(orderRef, {
            status: newStatus
        });
    } catch (error) {
         console.error("Error updating document: ", error);
        toast({
            title: "Error",
            description: "Could not update order status. Please try again.",
            variant: "destructive"
        })
    }
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
