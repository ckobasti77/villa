"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useTranslations } from "next-intl"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function RoleSelection() {
  const t = useTranslations("RoleSelection")
  const user = useQuery(api.users.current)
  const setRole = useMutation(api.users.setRole)
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)

  const basePath = pathname.split("/").slice(0, 2).join("/")

  useEffect(() => {
    if (user && user.role) {
      if (user.role === "host") {
        router.push(`${basePath}/dashboard`)
      } else {
        router.push(`${basePath}`)
      }
    }
  }, [user, router, basePath])

  const handleSelect = async (role: "host" | "guest") => {
    setLoading(true)
    await setRole({ role })
    if (role === "host") {
      router.push(`${basePath}/dashboard`)
    } else {
      router.push(`${basePath}`)
    }
  }

  if (!user || user.role) return null

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-full mb-6 text-center">
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground mt-2">{t("description")}</p>
        </div>

        <Card className="flex flex-col cursor-pointer hover:border-primary transition-colors" onClick={() => handleSelect("guest")}>
          <CardHeader>
            <CardTitle className="text-2xl">{t("guestTitle")}</CardTitle>
            <CardDescription>{t("guestDesc")}</CardDescription>
          </CardHeader>
          <CardFooter className="mt-auto">
            <Button className="w-full" disabled={loading}>{t("continue")}</Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col cursor-pointer hover:border-primary transition-colors" onClick={() => handleSelect("host")}>
          <CardHeader>
            <CardTitle className="text-2xl">{t("hostTitle")}</CardTitle>
            <CardDescription>{t("hostDesc")}</CardDescription>
          </CardHeader>
          <CardFooter className="mt-auto">
            <Button className="w-full" variant="outline" disabled={loading}>{t("continue")}</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
