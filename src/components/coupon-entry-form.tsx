
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOrders } from '@/contexts/order-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Ticket } from 'lucide-react';

const formSchema = z.object({
  couponId: z.string().min(3, 'Coupon ID must be at least 3 characters.').regex(/^[A-Z0-9-]+$/, 'Coupon ID can only contain uppercase letters, numbers, and dashes.'),
});

export function CouponEntryForm() {
  const { addOrder } = useOrders();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      couponId: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addOrder(values.couponId.toUpperCase());
    form.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Ticket className="text-primary"/>
            Enter Coupon
        </CardTitle>
        <CardDescription>Enter a student's coupon ID to add their order to the 'Preparing' queue.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-4">
            <FormField
              control={form.control}
              name="couponId"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>Coupon ID</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. CPN-123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Add Order</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
