"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { ThemeToggle } from "./ThemeToggle"
import { LanguageToggle } from "./LanguageToggle"
import { UserNav } from "./UserNav"
import { useLocale } from "next-intl"

export function MainNav() {
  const t = useTranslations("Navigation")
  const locale = useLocale()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <div className="mr-4 flex">
          <Link href={`/${locale}`} className="mr-6 flex items-center space-x-2">
            <span className="font-bold sm:inline-block text-xl">
              Villa.rs
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href={`/${locale}`}
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              {t("villas")}
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <LanguageToggle />
            <ThemeToggle />
            <UserNav />
          </nav>
        </div>
      </div>
    </header>
  )
}
