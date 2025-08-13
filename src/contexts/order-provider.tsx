
"use client";

import type { ReactNode } from "react";
import React, { createContext, useCallback, useContext, useState, useEffect, useRef } from 'react';
import { Order, OrderStatus } from '@/types';
import { db } from '@/lib/firebase';
import { collection, doc, addDoc, updateDoc, onSnapshot, query, where, serverTimestamp, Timestamp, deleteDoc, limit, orderBy } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  addOrder: (couponId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;
  updateOrderCoupon: (orderId: string, newCouponId: string) => void;
  getOrdersByStudent: (studentId: string) => Order[];
  getOrdersByStatus: (status: OrderStatus) => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
        collection(db, "orders"), 
        where("status", "in", ["Preparing", "Ready"]),
        limit(100) // Limit initial load for performance
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const newOrders: Order[] = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            newOrders.push({
                id: doc.id,
                studentId: data.studentId,
                items: data.items,
                status: data.status,
                createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date(),
            });
        });
        
        // Manual sort on the client-side
        newOrders.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        setOrders(newOrders);
        setLoading(false);

    }, (error) => {
        console.error("Error with Firestore snapshot: ", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  const addOrder = useCallback(async (couponId: string) => {
    const activeOrder = orders.find(o => o.studentId === `student-${couponId}` && (o.status === 'Preparing' || o.status === 'Ready'));
      if (activeOrder) {
        throw new Error(`Coupon #${couponId} is already in the queue.`);
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
        throw error;
    }
  }, [orders]);

  const deleteOrder = useCallback(async (orderId: string) => {
    const orderRef = doc(db, "orders", orderId);
    try {
      await deleteDoc(orderRef);
    } catch (error)
      {
      console.error("Error deleting document: ", error);
    }
  }, []);

  const updateOrderStatus = useCallback(async (orderId: string, newStatus: OrderStatus) => {
    if (newStatus === 'Completed') {
      await deleteOrder(orderId);
      return;
    }
    
    const orderRef = doc(db, "orders", orderId);
    try {
        await updateDoc(orderRef, {
            status: newStatus
        });
        
    } catch (error) {
         console.error("Error updating document: ", error);
    }
  }, [deleteOrder]);

  const updateOrderCoupon = useCallback(async (orderId: string, newCouponId: string) => {
    const activeOrder = orders.find(o => o.studentId === `student-${newCouponId}` && (o.status === 'Preparing' || o.status === 'Ready'));
      if (activeOrder) {
        toast({
            variant: "destructive",
            title: "Duplicate Order",
            description: `Coupon #${newCouponId} is already in the queue.`,
        })
        return;
      }

    const orderRef = doc(db, "orders", orderId);
    try {
      await updateDoc(orderRef, {
        studentId: `student-${newCouponId}`,
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  }, [orders]);


  const getOrdersByStudent = useCallback((studentId: string) => {
    return orders.filter(order => order.studentId === studentId);
  }, [orders]);

  const getOrdersByStatus = useCallback((status: OrderStatus) => {
    return orders.filter(order => order.status === status);
  }, [orders]);

  const value = {
    orders,
    loading,
    addOrder,
    updateOrderStatus,
    deleteOrder,
    updateOrderCoupon,
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
