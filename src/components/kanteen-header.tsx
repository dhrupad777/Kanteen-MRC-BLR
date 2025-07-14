
"use client"
import Link from "next/link"
import { ChefHat, LogOut, User } from "lucide-react"
import { usePathname, useRouter } from 'next/navigation'
import { Button } from "./ui/button"
import { useAuth } from "@/hooks/use-auth"
import { UserProfile } from "@/types"

export function KanteenHeader() {
  const pathname = usePathname();
  const { user, userProfile, signOutUser } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOutUser();
    // Determine where to redirect after sign out
    if (pathname.startsWith('/staff')) {
        router.push('/login');
    } else if (pathname.startsWith('/student')) {
        router.push('/student-login');
    } else {
        router.push('/');
    }
  }

  const isDashboard = pathname.startsWith('/student') || pathname.startsWith('/staff');
  const isStudentPage = pathname.startsWith('/student');
  
  const getFirstName = (profile: UserProfile | null) => {
    if (!profile || !profile.name) return '';
    return profile.name.split(' ')[0];
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-auto">
          <ChefHat className="h-7 w-7 text-primary" />
          <span className="font-headline text-2xl font-bold text-foreground">Kanteen</span>
        </Link>
        
        <div className="flex items-center justify-end gap-4">
           {isStudentPage && userProfile?.name && (
            <span className="text-sm font-medium text-foreground/80 hidden sm:block">
              Hello, {getFirstName(userProfile)}!
            </span>
          )}

          {isDashboard && (
             <Button asChild variant="outline" size="sm">
               <Link href="/">
                 Switch Role
               </Link>
             </Button>
          )}

          {user && (
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
