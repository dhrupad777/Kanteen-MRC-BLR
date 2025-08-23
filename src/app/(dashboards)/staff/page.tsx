
"use client";

import { useEffect, useState } from 'react';
import { useOrders } from '@/contexts/order-provider';
import { OrderCard } from '@/components/order-card';
import { Order, OrderStatus } from '@/types';
import { ChefHat } from 'lucide-react';
import { CouponEntryForm } from '@/components/coupon-entry-form';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { EditCouponForm } from '@/components/edit-coupon-form';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';


export default function StaffDashboardPage() {
  const { orders, loading: ordersLoading, deleteOrder, updateOrderCoupon } = useOrders();
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);


  const handleEditClick = (order: Order) => {
    setEditingOrder(order);
    setIsEditDialogOpen(true);
  };
  
  const handleEditSubmit = (newCouponId: number) => {
    if (editingOrder) {
      updateOrderCoupon(editingOrder.id, newCouponId.toString());
    }
    setIsEditDialogOpen(false);
    setEditingOrder(null);
  };

  const readyOrders = orders.filter(o => o.status === 'Ready');
  
  const isLoading = authLoading || ordersLoading;


  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline text-2xl md:text-3xl font-bold">Manager Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage all active orders.</p>
        </div>
      </div>
      <div className="space-y-8 pt-4">
        <CouponEntryForm />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-4 p-4 rounded-xl h-full md:col-span-2">
                <h2 className="font-headline text-xl font-semibold flex items-center px-2 text-foreground/80">
                  <ChefHat className="mr-2 h-5 w-5 text-green-800" />
                  Ready to Collect ({readyOrders.length})
                </h2>
                <div className="space-y-3">
                  <AnimatePresence>
                    {readyOrders.length > 0 ? (
                      readyOrders.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()).map(order => (
                        <motion.div
                          key={order.id}
                          layout
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="flex items-center gap-2"
                        >
                          <OrderCard order={order} role="staff" />
                          <div className="flex items-center gap-1.5 flex-wrap justify-end flex-1 ml-auto">
                                <Button variant="outline" size="icon" className="h-8 w-8 transition-transform duration-200 ease-in-out hover:scale-110" onClick={() => handleEditClick(order)}>
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="icon" className="h-8 w-8 transition-transform duration-200 ease-in-out hover:scale-110">
                                      <Trash2 className="h-4 w-4" />
                                      <span className="sr-only">Delete</span>
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete the order for coupon #{order.studentId.split('-')[1]}. This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => deleteOrder(order.id)}>
                                        Yes, delete it
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                          </div>
                        </motion.div>
                      ))
                    ) : null}
                  </AnimatePresence>
                </div>
              </div>
        </div>
      </div>

       {editingOrder && (
        <AlertDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Edit Coupon Number</AlertDialogTitle>
              <AlertDialogDescription>
                Enter the new coupon number for this order.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <EditCouponForm
              currentCoupon={parseInt(editingOrder.studentId.split('-')[1] || '0')}
              onSubmit={handleEditSubmit}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
