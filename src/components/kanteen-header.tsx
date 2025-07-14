"use client"
import Link from "next/link"
import { Utensils, Home, User, UtensilsCrossed, LogOut } from "lucide-react"
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"

export function KanteenHeader() {
  const pathname = usePathname();

  const isDashboard = pathname.startsWith('/student') || pathname.startsWith('/staff');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-8">
          <Utensils className="h-7 w-7 text-primary" />
          <span className="font-headline text-2xl font-bold text-foreground">Kanteen</span>
        </Link>
        
        {isDashboard && (
           <div className="flex-1 flex justify-end">
             <Button asChild variant="ghost">
               <Link href="/">
                 <LogOut className="mr-2 h-4 w-4" />
                 Switch Role
               </Link>
             </Button>
           </div>
        )}

      </div>
    </header>
  )
}
