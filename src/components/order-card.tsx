"use client";

import type { Order, OrderStatus } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusBadge } from "./order-status-badge";
import { Button } from "./ui/button";
import { ArrowRight, Clock, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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
    <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <CardTitle className="font-headline text-xl mb-1">Coupon #{couponId}</CardTitle>
            <div className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatDistanceToNow(order.createdAt, { addSuffix: true })}</span>
            </div>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2 text-sm">
          {order.items.map((item, index) => (
            <li key={index} className="flex justify-between items-center text-foreground">
              <span>{item.name}</span>
              <span className="font-mono text-xs bg-muted px-2 py-1 rounded-md">x{item.quantity}</span>
            </li>
          ))}
        </ul>
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
