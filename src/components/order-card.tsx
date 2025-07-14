
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
  onToggleSubscription?: (orderId: string) => void;
}

const statusProgression: Record<string, OrderStatus | null> = {
  Pending: 'Preparing',
  Preparing: 'Ready',
  Ready: 'Completed',
  Completed: null,
};

export function OrderCard({ order, role, onStatusChange, showBell = false, isSubscribed = false, onToggleSubscription }: OrderCardProps) {
  const nextStatus = statusProgression[order.status];
  
  const couponId = order.studentId.split('-')[1] || order.id;

  const buttonText = nextStatus === 'Ready' ? 'Ready' : 'Collected';

  const handleStatusUpdate = () => {
    if (nextStatus && onStatusChange) {
      onStatusChange(order.id, nextStatus);
    }
  };

  const handleBellClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleSubscription) {
      onToggleSubscription(order.id);
    }
  };

  return (
    <Card 
      className={cn(
        "flex flex-col w-full relative transition-colors duration-300",
        {
          "overflow-hidden border-0": role === 'student',
          "flex-row items-center p-0": role === 'staff',
        }
      )}
    >
      {role === 'student' && showBell && (
        <button
          onClick={handleBellClick}
          className="absolute top-2 right-2 z-10 p-2 rounded-full hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label={isSubscribed ? "Unsubscribe from notifications" : "Subscribe to notifications"}
        >
          {isSubscribed 
            ? <BellRing className="h-5 w-5 text-white" /> 
            : <Bell className="h-5 w-5 text-blue-800/80" />
          }
        </button>
      )}
      <CardContent className={cn("flex-grow flex flex-col justify-center items-center text-center", {
        "p-0": role === 'student',
        "p-0 flex-shrink-0": role === 'staff'
      })}>
        <div className={cn(
            "rounded-lg p-2 w-full font-bold tracking-wider transition-colors duration-300",
            role === 'student' ? 'text-6xl p-6' : 'text-5xl px-4 py-2',
            {
              'bg-blue-200/90 dark:bg-blue-900/50 text-blue-900 dark:text-blue-200': order.status === 'Preparing' && !isSubscribed,
              'bg-blue-800 dark:bg-blue-700 text-white': order.status === 'Preparing' && isSubscribed,
              'bg-green-200/90 dark:bg-green-900/50 text-green-900 dark:text-green-200': order.status === 'Ready',
            }
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
