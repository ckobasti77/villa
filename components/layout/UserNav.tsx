"use client"

import { useTranslations } from "next-intl"
import { useAuthActions } from "@convex-dev/auth/react"
import { Button } from "@/components/ui/button"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, LogOut, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { useLocale } from "next-intl"

export function UserNav() {
  const t = useTranslations("Navigation")
  const { signOut } = useAuthActions()
  const user = useQuery(api.users.current)
  const locale = useLocale()

  if (user === undefined) {
    return <Button variant="ghost" disabled className="w-8 h-8 rounded-full animate-pulse bg-muted" />
  }

  if (user === null) {
    return (
      <Button asChild variant="default">
        <Link href={`/${locale}/auth`}>{t("signIn")}</Link>
      </Button>
    )
  }

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "V"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image} alt={user.name ?? "Avatar"} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        {user.role === "host" ? (
          <DropdownMenuItem asChild>
            <Link href={`/${locale}/dashboard`} className="cursor-pointer w-full flex items-center">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>{t("dashboard")}</span>
            </Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <Link href={`/${locale}/profile`} className="cursor-pointer w-full flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>{t("profile")}</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={() => void signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t("signOut")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
