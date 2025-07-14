"use client";

import type { Order, OrderStatus } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "./ui/button";
import { ArrowRight, Check } from "lucide-react";

interface OrderCardProps {
  order: Order;
  role: 'student' | 'staff';
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void;
}

const statusProgression: Record<string, OrderStatus | null> = {
  Pending: 'Preparing',
  Preparing: 'Ready',
  Ready: 'Completed',
  Completed: null,
};

export function OrderCard({ order, role, onStatusChange }: OrderCardProps) {
  const nextStatus = statusProgression[order.status];

  const handleStatusUpdate = () => {
    if (nextStatus && onStatusChange) {
      onStatusChange(order.id, nextStatus);
    }
  };
  
  const couponId = order.studentId.split('-')[1] || order.id;

  return (
    <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card overflow-hidden">
      <CardContent className="flex-grow flex flex-col justify-center items-center text-center p-6">
        <div className="bg-muted/50 border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 w-full">
            <p className="text-sm font-semibold text-muted-foreground tracking-widest">COUPON</p>
            <p className="font-headline font-bold text-5xl text-foreground tracking-tighter">{couponId}</p>
        </div>
      </CardContent>
      {role === 'staff' && nextStatus && (
        <CardFooter className="p-3">
          <Button onClick={handleStatusUpdate} className="w-full bg-primary hover:bg-accent transition-colors font-semibold">
            {nextStatus === "Ready" ? <ArrowRight className="mr-2 h-4 w-4" /> : <Check className="mr-2 h-4 w-4" />}
            <span>Mark as {nextStatus}</span>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
