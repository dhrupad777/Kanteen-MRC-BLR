export type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Completed';

export interface Order {
  id: string;
  studentId: string;
  items: { name: string; quantity: number }[];
  status: OrderStatus;
  createdAt: Date;
}
