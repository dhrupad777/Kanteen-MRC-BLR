import { KanteenHeader } from "@/components/kanteen-header";
import { OrderProvider } from "@/contexts/order-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OrderProvider>
      <div className="flex flex-col min-h-screen">
        <KanteenHeader />
        <main className="flex-1 container py-8">
          {children}
        </main>
      </div>
    </OrderProvider>
  );
}
