"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

export default function GuestDashboard() {
  const t = useTranslations("GuestDashboard")
  const user = useQuery(api.users.current)
  const bookings = useQuery(api.bookings.getByGuest)

  if (user === undefined) return null

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold">{t("title")}</h1>

      {bookings === undefined ? (
        <div className="animate-pulse space-y-4">
          <div className="h-40 bg-muted rounded-xl" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">
          {t("noBookings")}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map(booking => (
            <Card key={booking._id}>
              <CardHeader>
                <CardTitle>{booking.villa?.title}</CardTitle>
                <CardDescription>{booking.villa?.location}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  {t("dates", {
                    start: format(new Date(booking.startDate), "PP"),
                    end: format(new Date(booking.endDate), "PP")
                  })}
                </div>
                <div className="font-semibold">
                  {t("total", { price: booking.totalPrice + " RSD" })}
                </div>
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize">
                  {booking.status === "pending" ? t("statusPending") : booking.status === "confirmed" ? t("statusConfirmed") : t("statusCancelled")}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
