"use client";

import type { Order, OrderStatus } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusBadge } from "./order-status-badge";
import { Button } from "./ui/button";
import { ArrowRight, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface OrderCardProps {
  order: Order;
  role: 'student' | 'staff';
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void;
}

const statusProgression: Record<OrderStatus, OrderStatus | null> = {
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

  return (
    <Card className="flex flex-col h-full transition-shadow duration-300 hover:shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline text-xl mb-1">{order.id}</CardTitle>
            <div className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatDistanceToNow(order.createdAt, { addSuffix: true })}</span>
            </div>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {order.items.map((item, index) => (
            <li key={index} className="flex justify-between items-center text-foreground">
              <span>{item.name}</span>
              <span className="font-mono text-sm bg-muted px-2 py-0.5 rounded-md">x{item.quantity}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      {role === 'staff' && nextStatus && (
        <CardFooter>
          <Button onClick={handleStatusUpdate} className="w-full bg-primary hover:bg-accent transition-colors">
            <span>Mark as {nextStatus}</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
