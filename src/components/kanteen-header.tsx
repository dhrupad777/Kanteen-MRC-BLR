"use client"
import Link from "next/link"
import { Utensils, Home, User, UtensilsCrossed } from "lucide-react"
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"

export function KanteenHeader() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
    { href: "/student", label: "Customer", icon: <User className="w-4 h-4" /> },
    { href: "/staff", label: "Manager", icon: <UtensilsCrossed className="w-4 h-4" /> },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-8">
          <Utensils className="h-7 w-7 text-primary" />
          <span className="font-headline text-2xl font-bold text-foreground">Kanteen</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 transition-colors hover:text-primary",
                pathname.startsWith(link.href) && link.href !== '/' || pathname === link.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
