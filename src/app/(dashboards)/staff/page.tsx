
"use client";

import { useEffect, useState } from 'react';
import { useOrders } from '@/contexts/order-provider';
import { OrderCard } from '@/components/order-card';
import { Order, OrderStatus } from '@/types';
import { CookingPot, ChefHat } from 'lucide-react';
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
import { Edit, Trash2, Undo2 } from 'lucide-react';
import { EditCouponForm } from '@/components/edit-coupon-form';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';


export default function StaffDashboardPage() {
  const { orders, updateOrderStatus, deleteOrder, updateOrderCoupon } = useOrders();
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);


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

  const orderColumns: { title: string; status: OrderStatus, icon: React.ReactNode, className: string }[] = [
    { title: 'Preparing', status: 'Preparing', icon: <CookingPot className="mr-2 h-5 w-5 text-blue-800" />, className: "" },
    { title: 'Ready', status: 'Ready', icon: <ChefHat className="mr-2 h-5 w-5 text-green-800" />, className: "" },
  ];

  if (loading || !user) {
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {orderColumns.map(column => {
            const columnOrders = orders.filter(o => o.status === column.status);
            return (
              <div key={column.title} className={cn("space-y-4 p-4 rounded-xl h-full", column.className)}>
                <h2 className="font-headline text-xl font-semibold flex items-center px-2 text-foreground/80">
                  {column.icon}
                  {column.title} ({columnOrders.length})
                </h2>
                <div className="space-y-3">
                  <AnimatePresence>
                    {columnOrders.length > 0 ? (
                      columnOrders.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()).map(order => (
                        <motion.div
                          key={order.id}
                          layout
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="flex items-center gap-2"
                        >
                          <OrderCard order={order} role="staff" onStatusChange={updateOrderStatus} />
                          <div className="flex items-center gap-1 flex-wrap justify-end flex-1">
                            {order.status === 'Preparing' && (
                              <>
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
                              </>
                            )}
                            {order.status === 'Ready' && (
                              <Button variant="outline" size="sm" className="transition-transform duration-200 ease-in-out hover:scale-105" onClick={() => updateOrderStatus(order.id, 'Preparing')}>
                                <Undo2 className="mr-1 h-3 w-3" /> Back
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      ))
                    ) : null}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
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
