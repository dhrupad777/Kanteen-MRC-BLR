
import Link from 'next/link';
import { User, ChefHat } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RoleSelectionPage() {
  return (
    <>
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <header className="text-center mb-12 flex flex-col items-center">
        <ChefHat className="w-40 h-40 mb-4 text-primary" strokeWidth={1} />
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary tracking-tighter">
          Kanteen
        </h1>
        <p className="text-muted-foreground text-lg mt-2 max-w-md">
          Your Campus Canteen Companion. Select your role to get started.
        </p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <RoleCard
          href="/student"
          icon={<User className="w-12 h-12 text-primary" />}
          title="Customer"
          description="View the live order status display."
        />
        <RoleCard
          href="/login"
          icon={<ChefHat className="w-12 h-12 text-primary" />}
          title="Order Manager"
          description="Manage orders and get kitchen insights."
        />
      </main>
      <footer className="mt-20 text-center text-muted-foreground text-sm">
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
    <Link href={href} className="group block">
      <Card className="h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out border-2 border-transparent hover:border-primary/80 bg-card/60 backdrop-blur-sm p-4">
        <CardHeader className="flex flex-col items-center text-center">
          <div className="p-4 bg-primary/10 rounded-full mb-4 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">{icon}</div>
          <CardTitle className="font-headline text-3xl transition-colors group-hover:text-primary">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6 h-12">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
