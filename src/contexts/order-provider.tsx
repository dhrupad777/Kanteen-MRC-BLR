
"use client";

import type { ReactNode } from "react";
import React, { createContext, useCallback, useContext, useState, useEffect, useRef } from 'react';
import { Order, OrderStatus } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { db, auth } from '@/lib/firebase';
import { collection, doc, addDoc, updateDoc, onSnapshot, query, where, serverTimestamp, Timestamp, deleteDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";

interface OrderContextType {
  orders: Order[];
  addOrder: (couponId: string) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;
  updateOrderCoupon: (orderId: string, newCouponId: string) => void;
  getOrdersByStudent: (studentId: string) => Order[];
  getOrdersByStatus: (status: OrderStatus) => Order[];
  toggleNotificationSubscription: (couponId: string, subscribed: boolean) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const prevOrdersRef = useRef<Order[]>([]);
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, "orders"), where("status", "in", ["Preparing", "Ready"]));
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
        
        setOrders(newOrders);
        prevOrdersRef.current = newOrders;

    }, (error) => {
        console.error("Error with Firestore snapshot: ", error);
        toast({
            title: "Connection Error",
            description: "Could not sync with the database. Please check your connection.",
            variant: "destructive"
        })
    });

    return () => unsubscribe();
  }, [toast]);


  const addOrder = useCallback(async (couponId: string) => {
    const activeOrder = orders.find(o => o.studentId === `student-${couponId}` && (o.status === 'Preparing' || o.status === 'Ready'));
      if (activeOrder) {
        toast({
          title: "Coupon In Use",
          description: `Coupon #${couponId} is already in the queue.`,
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
      toast({
        title: "Order Added",
        description: `Coupon #${couponId} is now in the 'Preparing' queue.`,
      })
    } catch (error) {
        console.error("Error adding document: ", error);
        toast({
            title: "Error",
            description: "Could not add order. Please try again.",
            variant: "destructive"
        })
    }
  }, [orders, toast]);

  const deleteOrder = useCallback(async (orderId: string) => {
    const orderRef = doc(db, "orders", orderId);
    try {
      await deleteDoc(orderRef);
      toast({
        title: "Order Removed",
        description: "The order has been successfully removed.",
      });
    } catch (error)
      {
      console.error("Error deleting document: ", error);
      toast({
        title: "Error",
        description: "Could not remove order. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

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
        toast({
            title: "Error",
            description: "Could not update order status. Please try again.",
            variant: "destructive"
        })
    }
  }, [toast, deleteOrder]);

  const updateOrderCoupon = useCallback(async (orderId: string, newCouponId: string) => {
    const activeOrder = orders.find(o => o.studentId === `student-${newCouponId}` && (o.status === 'Preparing' || o.status === 'Ready'));
      if (activeOrder) {
        toast({
          title: "Coupon In Use",
          description: `Coupon #${newCouponId} is already in the queue.`,
          variant: "destructive"
        })
        return;
      }

    const orderRef = doc(db, "orders", orderId);
    try {
      await updateDoc(orderRef, {
        studentId: `student-${newCouponId}`,
      });
      toast({
        title: "Order Updated",
        description: `Coupon number has been updated to #${newCouponId}.`,
      });
    } catch (error) {
      console.error("Error updating document: ", error);
      toast({
        title: "Error",
        description: "Could not update coupon number. Please try again.",
        variant: "destructive",
      });
    }
  }, [orders, toast]);


  const getOrdersByStudent = useCallback((studentId: string) => {
    return orders.filter(order => order.studentId === studentId);
  }, [orders]);

  const getOrdersByStatus = useCallback((status: Order_Status) => {
    return orders.filter(order => order.status === status);
  }, [orders]);

 const toggleNotificationSubscription = useCallback(async (couponId: string, subscribed: boolean) => {
    if (!user) {
      toast({ title: "Not Logged In", description: "You must be logged in to manage notifications.", variant: "destructive" });
      return;
    }

    const userProfileRef = doc(db, "users", user.uid);

    try {
      if (subscribed) {
        await updateDoc(userProfileRef, {
          subscriptions: arrayUnion(couponId)
        });
        toast({
          title: "Notifications Enabled",
          description: `You will now receive a notification when order #${couponId} is ready.`,
        });
      } else {
        await updateDoc(userProfileRef, {
          subscriptions: arrayRemove(couponId)
        });
        toast({
          title: "Notifications Disabled",
          description: `You will no longer receive notifications for order #${couponId}.`,
        });
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast({
        title: "Update Failed",
        description: "Could not update your notification preferences. Please try again.",
        variant: "destructive",
      });
    }
  }, [user, toast]);


  const value = {
    orders,
    addOrder,
    updateOrderStatus,
    deleteOrder,
    updateOrderCoupon,
    getOrdersByStudent,
    getOrdersByStatus,
    toggleNotificationSubscription
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

// Helper type to handle both string and the specific statuses
type Order_Status = OrderStatus | 'Archived';
