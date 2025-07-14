
"use client";

import type { Order, OrderStatus } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "./ui/button";
import { ArrowRight, Check, Bell, BellRing } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderCardProps {
  order: Order;
  role: 'student' | 'staff';
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void;
  showBell?: boolean;
  isSubscribed?: boolean;
}

const statusProgression: Record<string, OrderStatus | null> = {
  Pending: 'Preparing',
  Preparing: 'Ready',
  Ready: 'Completed',
  Completed: null,
};

export function OrderCard({ order, role, onStatusChange, showBell = false, isSubscribed = false }: OrderCardProps) {
  const nextStatus = statusProgression[order.status];
  
  const couponId = order.studentId.split('-')[1] || order.id;

  const buttonText = nextStatus === 'Ready' ? 'Ready' : 'Collected';

  const handleStatusUpdate = () => {
    if (nextStatus && onStatusChange) {
      onStatusChange(order.id, nextStatus);
    }
  };

  return (
    <Card className={cn(
        "flex flex-col transition-all duration-300 w-full relative",
        {
          "hover:shadow-xl hover:-translate-y-1 overflow-visible border-0 group/order": role === 'student',
          "flex-row items-center p-0": role === 'staff',
        },
        isSubscribed && 'bg-gradient-to-br from-blue-200/80 to-purple-200/80 dark:from-blue-900/50 dark:to-purple-900/50'
      )}>
       {role === 'student' && showBell && (
        <div className="absolute top-2 right-2 text-primary/70">
            {isSubscribed ? <BellRing className="h-5 w-5 animate-pulse" /> : <Bell className="h-5 w-5" />}
        </div>
      )}
      <CardContent className={cn("flex-grow flex flex-col justify-center items-center text-center", {
        "p-0": role === 'student',
        "p-0 flex-shrink-0": role === 'staff'
      })}>
        <div className={cn(
            "rounded-lg p-2 w-full font-bold font-mono tabular-nums tracking-wider",
            order.status === 'Preparing' && 'bg-blue-100/80 text-blue-900',
            order.status === 'Ready' && 'bg-green-100/80 text-green-900',
            role === 'student' ? 'text-6xl p-6' : 'text-5xl px-4 py-2'
          )}>
            <p className="font-mono tabular-nums">{couponId}</p>
        </div>
      </CardContent>
      {role === 'staff' && nextStatus && (
        <CardFooter className="p-0 pl-1 pr-2 flex-grow">
          <Button onClick={handleStatusUpdate} size="sm" className="bg-primary hover:bg-primary/90 transition-colors font-semibold h-8 text-xs hover:scale-105 transform duration-200 ease-in-out px-2 py-1">
            {buttonText === "Ready" ? <ArrowRight className="mr-1 h-3 w-3" /> : <Check className="mr-1 h-3 w-3" />}
            <span>{buttonText}</span>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
