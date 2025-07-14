
"use client";

import type { Order, OrderStatus } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "./ui/button";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { KanteenMascot } from "./kanteen-mascot";
import { AnimatePresence, motion } from "framer-motion";

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

  const buttonText = nextStatus === "Ready" ? "Mark as Ready" : "Mark as Collected";

  return (
    <Card className={cn(
        "flex flex-col transition-all duration-300 w-full",
        {
          "hover:shadow-xl hover:-translate-y-1 overflow-visible border-0": role === 'student',
          "flex-row items-center p-0": role === 'staff',
        }
      )}>
      <CardContent className={cn("flex-grow flex flex-col justify-center items-center text-center", {
        "p-0": role === 'student',
        "p-0 flex-shrink-0": role === 'staff'
      })}>
        <div className={cn(
            "rounded-lg p-2 w-full font-bold tracking-wider",
            order.status === 'Preparing' && 'bg-blue-100/80 text-blue-900',
            order.status === 'Ready' && 'bg-green-100/80 text-green-900',
            role === 'student' ? 'text-6xl p-6' : 'text-3xl px-6 py-4'
          )}>
            <p className="tabular-nums font-mono">{couponId}</p>
        </div>
      </CardContent>
      {role === 'staff' && nextStatus && (
        <CardFooter className="p-0 pl-2 flex-grow">
          <Button onClick={handleStatusUpdate} size="sm" className="bg-primary hover:bg-primary/90 transition-colors font-semibold h-8 text-xs hover:scale-105 transform duration-200 ease-in-out">
            {nextStatus === "Ready" ? <ArrowRight className="mr-1 h-3 w-3" /> : <Check className="mr-1 h-3 w-3" />}
            <span>{buttonText}</span>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
