
"use client"
import Link from "next/link"
import { ChefHat, LogOut } from "lucide-react"
import { usePathname, useRouter } from 'next/navigation'
import { Button } from "./ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useEffect, useState } from "react"

export function KanteenHeader() {
  const pathname = usePathname();
  const { user, signOutUser } = useAuth();
  const router = useRouter();
  const [customerName, setCustomerName] = useState<string | null>(null);

  useEffect(() => {
    if (pathname.startsWith('/student')) {
      try {
        const storedInfo = localStorage.getItem('kanteenCustomer');
        if (storedInfo) {
          const info = JSON.parse(storedInfo);
          setCustomerName(info.name);
        } else {
            setCustomerName(null);
        }
      } catch (e) {
        setCustomerName(null);
      }
    }
  }, [pathname]);

  const handleManagerSignOut = async () => {
    await signOutUser();
    router.push('/login');
  }

  const handleCustomerSignOut = () => {
    localStorage.removeItem('kanteenCustomer');
    setCustomerName(null);
    router.push('/student');
  }
  
  const getFirstName = (name: string | null) => {
    if (!name) return '';
    return name.split(' ')[0];
  }

  const isStudentPage = pathname.startsWith('/student');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-auto">
          <ChefHat className="h-7 w-7 text-primary" />
          <span className="font-headline text-2xl font-bold text-foreground">Kanteen</span>
        </Link>
        
        <div className="flex items-center justify-end gap-4">
           {isStudentPage && customerName && (
            <span className="text-sm font-medium text-foreground/80 hidden sm:block">
              Hello, {getFirstName(customerName)}!
            </span>
          )}

          {user && (
            <Button variant="ghost" size="sm" onClick={handleManagerSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          )}

          {isStudentPage && customerName && (
             <Button variant="ghost" size="sm" onClick={handleCustomerSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

    