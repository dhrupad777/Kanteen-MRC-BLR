
"use client";

import type { Order, OrderStatus } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "./ui/button";
import { ArrowRight, Check, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderCardProps {
  order: Order;
  role: 'student' | 'staff';
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void;
  onNotifyClick?: (order: Order) => void;
}

const statusProgression: Record<string, OrderStatus | null> = {
  Pending: 'Preparing',
  Preparing: 'Ready',
  Ready: 'Completed',
  Completed: null,
};

export function OrderCard({ order, role, onStatusChange, onNotifyClick }: OrderCardProps) {
  const nextStatus = statusProgression[order.status];

  const handleStatusUpdate = () => {
    if (nextStatus && onStatusChange) {
      onStatusChange(order.id, nextStatus);
    }
  };
  
  const couponId = order.studentId.split('-')[1] || order.id;

  const buttonText = nextStatus === 'Ready' ? 'Ready' : 'Collected';

  return (
    <Card className={cn(
        "flex flex-col transition-all duration-300 w-full relative",
        {
          "hover:shadow-xl hover:-translate-y-1 overflow-visible border-0 group/order": role === 'student',
          "flex-row items-center p-0": role === 'staff',
        }
      )}>
      {role === 'staff' && order.status === 'Preparing' && onNotifyClick && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-1 right-1 h-7 w-7 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all rounded-full"
          onClick={() => onNotifyClick(order)}
        >
          <Bell className="h-4 w-4" />
          <span className="sr-only">Send Ready Notification</span>
        </Button>
      )}
      <CardContent className={cn("flex-grow flex flex-col justify-center items-center text-center", {
        "p-0": role === 'student',
        "p-0 flex-shrink-0": role === 'staff'
      })}>
        <div className={cn(
            "rounded-lg p-2 w-full font-bold tracking-wider",
            order.status === 'Preparing' && 'bg-blue-100/80 text-blue-900',
            order.status === 'Ready' && 'bg-green-100/80 text-green-900',
            role === 'student' ? 'text-6xl p-6' : 'text-4xl px-4 font-mono tabular-nums'
          )}>
            <p className="tabular-nums font-mono">{couponId}</p>
        </div>
      </CardContent>
      {role === 'staff' && nextStatus && (
        <CardFooter className="p-0 pl-1 pr-2 flex-grow">
          <Button onClick={handleStatusUpdate} size="sm" className="bg-primary hover:bg-primary/90 transition-colors font-semibold h-8 text-xs hover:scale-105 transform duration-200 ease-in-out px-2 py-1">
            {nextStatus === "Ready" ? <ArrowRight className="mr-1 h-3 w-3" /> : <Check className="mr-1 h-3 w-3" />}
            <span>{buttonText}</span>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
