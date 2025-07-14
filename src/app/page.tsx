import Link from 'next/link';
import { ArrowRight, User, UtensilsCrossed } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { KanteenHeader } from '@/components/kanteen-header';

export default function RoleSelectionPage() {
  return (
    <>
    <KanteenHeader />
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 -mt-16">
      <header className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary">
          Kanteen
        </h1>
        <p className="text-muted-foreground text-lg mt-2">
          Your Campus Canteen Companion
        </p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <RoleCard
          href="/student"
          icon={<User className="w-12 h-12 text-primary" />}
          title="Log in as Customer"
          description="View your order status and get notified when it's ready."
        />
        <RoleCard
          href="/staff"
          icon={<UtensilsCrossed className="w-12 h-12 text-primary" />}
          title="Log in as Order Manager"
          description="Manage orders by coupon and get kitchen insights."
        />
      </main>
      <footer className="mt-16 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Kanteen. All rights reserved.</p>
      </footer>
    </div>
    </>
  );
}

interface RoleCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function RoleCard({ href, icon, title, description }: RoleCardProps) {
  return (
    <Link href={href} className="group">
      <Card className="h-full hover:shadow-xl hover:-translate-y-2 transition-transform duration-300 ease-in-out border-2 border-transparent hover:border-primary">
        <CardHeader className="flex flex-col items-center text-center">
          <div className="p-4 bg-secondary rounded-full mb-4">{icon}</div>
          <CardTitle className="font-headline text-3xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6 h-12">{description}</p>
          <Button variant="ghost" className="text-primary group-hover:text-accent font-bold">
            Go to Dashboard <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
