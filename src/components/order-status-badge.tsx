import type { OrderStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ChefHat, CheckCircle2, CircleDotDashed, CupSoda } from "lucide-react";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusConfig = {
  Pending: {
    label: 'Pending',
    icon: <CircleDotDashed className="h-4 w-4" />,
    className: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700',
  },
  Preparing: {
    label: 'Preparing',
    icon: <ChefHat className="h-4 w-4" />,
    className: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
  },
  Ready: {
    label: 'Ready for Pickup',
    icon: <CupSoda className="h-4 w-4" />,
    className: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700 animate-pulse',
  },
  Completed: {
    label: 'Completed',
    icon: <CheckCircle2 className="h-4 w-4" />,
    className: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-700',
  },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={cn("gap-2 text-sm font-medium", config.className)}>
      {config.icon}
      <span>{config.label}</span>
    </Badge>
  );
}
