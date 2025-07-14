"use client";

import type { Order, OrderStatus } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "./ui/button";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <Card className={cn(
        "flex flex-col h-full transition-all duration-300 bg-card overflow-hidden",
        {
          "hover:shadow-xl hover:-translate-y-1": role === 'student',
        }
      )}>
      <CardContent className="flex-grow flex flex-col justify-center items-center text-center p-6">
        <div className={cn(
            "rounded-lg p-4 w-full text-primary-foreground",
            order.status === 'Preparing' && 'bg-blue-500',
            order.status === 'Ready' && 'bg-green-500',
            order.status !== 'Preparing' && order.status !== 'Ready' && 'bg-primary'
          )}>
            <p className="font-headline font-bold text-5xl tracking-tighter">{couponId}</p>
        </div>
      </CardContent>
      {role === 'staff' && nextStatus && (
        <CardFooter className="p-2 pt-0">
          <Button onClick={handleStatusUpdate} className="w-full bg-primary hover:bg-primary/80 transition-colors font-semibold">
            {nextStatus === "Ready" ? <ArrowRight className="mr-2 h-4 w-4" /> : <Check className="mr-2 h-4 w-4" />}
            <span>Mark as {nextStatus}</span>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
