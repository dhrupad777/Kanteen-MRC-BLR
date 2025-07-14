
"use client"
import Link from "next/link"
import { ChefHat, LogOut, User } from "lucide-react"
import { usePathname, useRouter } from 'next/navigation'
import { Button } from "./ui/button"
import { useAuth } from "@/hooks/use-auth"

export function KanteenHeader() {
  const pathname = usePathname();
  const { user, userProfile, signOutUser } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOutUser();
    // Redirect to the appropriate login page based on where they logged out from
    if (pathname.startsWith('/staff')) {
        router.push('/login');
    } else {
        router.push('/student-login');
    }
  }
  
  const getFirstName = (name: string | null | undefined) => {
    if (!name) return '';
    return name.split(' ')[0];
  }

  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/student-login' || pathname === '/student-signup';
  const showAuthButton = !user && !isAuthPage;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-auto">
          <ChefHat className="h-7 w-7 text-primary" />
          <span className="font-headline text-2xl font-bold text-foreground">Kanteen</span>
        </Link>
        
        <div className="flex items-center justify-end gap-4">
           {user && userProfile && (
            <>
                <span className="text-sm font-medium text-foreground/80 hidden sm:block">
                  Hello, {getFirstName(userProfile.name)}!
                </span>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
            </>
          )}

           {showAuthButton && (
             <Button asChild variant="ghost" size="sm">
                <Link href="/student-login">
                    <User className="mr-2 h-4 w-4" />
                    Customer Login
                </Link>
             </Button>
          )}
        </div>
      </div>
    </header>
  )
}
