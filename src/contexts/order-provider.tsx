
"use client";

import type { ReactNode } from "react";
import React, { createContext, useCallback, useContext, useState, useEffect, useRef } from 'react';
import { Order, OrderStatus } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { db } from '@/lib/firebase';
import { collection, doc, addDoc, updateDoc, onSnapshot, query, where, serverTimestamp, Timestamp, deleteDoc } from "firebase/firestore";

interface OrderContextType {
  orders: Order[];
  notificationSubscriptions: string[];
  addOrder: (couponId: string) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;
  updateOrderCoupon: (orderId: string, newCouponId: string) => void;
  toggleNotificationSubscription: (orderId: string) => void;
  getOrdersByStudent: (studentId: string) => Order[];
  getOrdersByStatus: (status: OrderStatus) => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [notificationSubscriptions, setNotificationSubscriptions] = useState<string[]>([]);
  const { toast } = useToast();
  const previousOrdersRef = useRef<Order[]>([]);
  const lastToggledOrderRef = useRef<{ id: string; subscribed: boolean } | null>(null);

  const notificationSubscriptionsRef = useRef(notificationSubscriptions);

  useEffect(() => {
    notificationSubscriptionsRef.current = notificationSubscriptions;
  }, [notificationSubscriptions]);

  useEffect(() => {
    previousOrdersRef.current = orders;
  }, [orders]);

  const sendReadyNotification = useCallback((order: Order) => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Kanteen Order Ready!', {
          body: `Your order for coupon #${order.studentId.split('-')[1]} is ready for pickup.`,
          icon: '/favicon.ico'
        });
      }
    }
  }, []);

  const toggleNotificationSubscription = useCallback((orderId: string) => {
    setNotificationSubscriptions(prev => {
        const isSubscribed = prev.includes(orderId);
        lastToggledOrderRef.current = { id: orderId, subscribed: !isSubscribed };
        if(isSubscribed) {
            return prev.filter(id => id !== orderId);
        } else {
            return [...prev, orderId];
        }
    });
  }, []);

  useEffect(() => {
    if (lastToggledOrderRef.current) {
      const { subscribed } = lastToggledOrderRef.current;
      if (subscribed) {
        toast({ title: "Notifications On", description: "You'll be notified when this order is ready."});
      } else {
        toast({ title: "Notifications Off", description: "You won't receive a notification for this order." });
      }
      lastToggledOrderRef.current = null; // Reset after showing toast
    }
  }, [notificationSubscriptions, toast]);


  useEffect(() => {
    const q = query(collection(db, "orders"), where("status", "in", ["Preparing", "Ready"]));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ordersData: Order[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        ordersData.push({
          id: doc.id,
          studentId: data.studentId,
          items: data.items,
          status: data.status,
          createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date(),
        });
      });

      const previousOrders = previousOrdersRef.current;
      
      ordersData.forEach(newOrder => {
        const oldOrder = previousOrders.find(o => o.id === newOrder.id);
        if (newOrder.status === 'Ready' && oldOrder?.status === 'Preparing' && notificationSubscriptionsRef.current.includes(newOrder.id)) {
          sendReadyNotification(newOrder);
          setNotificationSubscriptions(prev => prev.filter(id => id !== newOrder.id));
        }
      });
      
      setOrders(ordersData);

    }, (error) => {
        console.error("Error with Firestore snapshot: ", error);
        toast({
            title: "Connection Error",
            description: "Could not sync with the database. Please check your connection.",
            variant: "destructive"
        })
    });

    return () => unsubscribe();
  }, [toast, sendReadyNotification]);


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


  const value = {
    orders,
    notificationSubscriptions,
    addOrder,
    updateOrderStatus,
    deleteOrder,
    updateOrderCoupon,
    toggleNotificationSubscription,
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

// Helper type to handle both string and the specific statuses
type Order_Status = OrderStatus | 'Archived';
