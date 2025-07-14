
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
  
  const couponId = order.studentId.split('-')[1] || order.id;

  const buttonText = nextStatus === 'Ready' ? 'Ready' : 'Collected';

  const handleStatusUpdate = () => {
    if (nextStatus && onStatusChange) {
      onStatusChange(order.id, nextStatus);
    }
  };

  return (
    <Card 
      className={cn(
        "flex flex-col w-full relative transition-all duration-300 ease-in-out",
        {
          "overflow-hidden border-0 shadow-md hover:shadow-lg hover:-translate-y-1": role === 'student',
          "flex-row items-center p-0": role === 'staff',
        }
      )}
    >
      <CardContent className={cn("flex-grow flex flex-col justify-center items-center text-center", {
        "p-0": role === 'student',
        "p-0 flex-shrink-0": role === 'staff'
      })}>
        <div className={cn(
            "rounded-lg p-2 w-full font-bold tracking-wider transition-colors duration-300",
            role === 'student' ? 'text-4xl md:text-5xl lg:text-6xl p-4 md:p-6' : 'text-5xl px-4 py-2',
            {
              'bg-blue-200/90 dark:bg-blue-900/50 text-blue-900 dark:text-blue-200': order.status === 'Preparing',
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
