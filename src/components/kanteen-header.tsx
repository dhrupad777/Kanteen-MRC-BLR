"use client"
import Link from "next/link"
import { Utensils, LogOut } from "lucide-react"
import { usePathname, useRouter } from 'next/navigation'
import { Button } from "./ui/button"
import { useAuth } from "@/hooks/use-auth"

export function KanteenHeader() {
  const pathname = usePathname();
  const { user, signOutUser } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOutUser();
    router.push('/login');
  }

  const isDashboard = pathname.startsWith('/student') || pathname.startsWith('/staff');
  const isStaffPage = pathname.startsWith('/staff');
  const isLoginPage = pathname.startsWith('/login');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-8">
          <Utensils className="h-7 w-7 text-primary" />
          <span className="font-headline text-2xl font-bold text-foreground">Kanteen</span>
        </Link>
        
        <div className="flex-1 flex justify-end">
          {isDashboard && !isStaffPage && (
             <Button asChild variant="ghost">
               <Link href="/">
                 <LogOut className="mr-2 h-4 w-4" />
                 Switch Role
               </Link>
             </Button>
          )}
          {isStaffPage && user && (
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          )}
        </div>

      </div>
    </header>
  )
}
