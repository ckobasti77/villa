"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import { Id } from "@/convex/_generated/dataModel"
import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Image from "next/image"
import { differenceInDays } from "date-fns"
import { MapPin, Bed, Bath, Check } from "lucide-react"

export default function VillaDetails() {
  const params = useParams()
  const router = useRouter()
  const t = useTranslations("VillaDetails")
  const id = params.id as Id<"villas">

  const villa = useQuery(api.villas.get, { id })
  const user = useQuery(api.users.current)
  const createBooking = useMutation(api.bookings.create)

  const [dateRange, setDateRange] = useState<{from: Date | undefined, to: Date | undefined}>({ from: undefined, to: undefined })
  const [isBooking, setIsBooking] = useState(false)

  if (villa === undefined) return <div className="p-8 text-center animate-pulse">Loading...</div>
  if (villa === null) return <div className="p-8 text-center">Villa not found</div>

  const nights = dateRange.from && dateRange.to ? differenceInDays(dateRange.to, dateRange.from) : 0
  const totalPrice = nights > 0 ? nights * villa.pricePerNight : 0

  const handleBook = async () => {
    if (!user) {
      router.push(`/${params.lang}/auth`)
      return
    }
    if (!dateRange.from || !dateRange.to) return

    setIsBooking(true)
    try {
      await createBooking({
        villaId: villa._id,
        startDate: dateRange.from.getTime(),
        endDate: dateRange.to.getTime(),
        totalPrice
      })
      toast.success(t("bookingSuccess"))
      router.push(`/${params.lang}/profile`)
    } catch (error: any) {
      toast.error(error.message || "Failed to book villa")
    } finally {
      setIsBooking(false)
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold">{villa.title}</h1>
        <div className="flex items-center gap-2 text-muted-foreground mt-2">
          <MapPin className="h-5 w-5" />
          <span className="text-lg">{villa.location}</span>
        </div>
      </div>

      {villa.imageUrls && villa.imageUrls.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px] md:h-[500px]">
          <div className="relative h-full w-full rounded-2xl overflow-hidden">
            <Image src={villa.imageUrls[0]!} alt={villa.title} fill className="object-cover" />
          </div>
          {villa.imageUrls.length > 1 && (
            <div className="grid grid-cols-2 grid-rows-2 gap-4 hidden md:grid">
              {villa.imageUrls.slice(1, 5).map((url, i) => (
                url && (
                  <div key={i} className="relative h-full w-full rounded-xl overflow-hidden">
                    <Image src={url} alt={`${villa.title} image ${i+2}`} fill className="object-cover" />
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex gap-6 border-b pb-6">
            <div className="flex items-center gap-2 text-lg">
              <Bed className="h-6 w-6 text-muted-foreground" />
              {villa.bedrooms} Bedrooms
            </div>
            <div className="flex items-center gap-2 text-lg">
              <Bath className="h-6 w-6 text-muted-foreground" />
              {villa.bathrooms} Bathrooms
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">{t("about")}</h2>
            <p className="text-lg text-muted-foreground whitespace-pre-wrap">{villa.description}</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">{t("amenities")}</h2>
            <div className="grid grid-cols-2 gap-4">
              {villa.amenities.map((amenity, i) => (
                <div key={i} className="flex items-center gap-2 text-lg text-muted-foreground">
                  <Check className="h-5 w-5 text-primary" />
                  {amenity}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <Card className="sticky top-24 shadow-lg border-primary/20">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">{villa.pricePerNight} RSD</span>
                <span className="text-muted-foreground mb-1">/ night</span>
              </div>

              <div className="space-y-4">
                <Label>{t("selectDates")}</Label>
                <div className="border rounded-xl p-2 bg-card">
                  <Calendar
                    mode="range"
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range: any) => setDateRange({ from: range?.from, to: range?.to })}
                    disabled={{ before: new Date() }}
                    className="w-full"
                  />
                </div>
              </div>

              {nights > 0 && (
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-muted-foreground">
                    <span>{villa.pricePerNight} RSD x {nights} nights</span>
                    <span>{totalPrice} RSD</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-4 border-t">
                    <span>{t("totalPrice")}</span>
                    <span>{totalPrice} RSD</span>
                  </div>
                </div>
              )}

              <Button
                className="w-full text-lg h-12"
                size="lg"
                disabled={!dateRange.from || !dateRange.to || isBooking}
                onClick={handleBook}
              >
                {isBooking ? "Booking..." : (dateRange.from && dateRange.to ? t("confirmBooking") : t("selectDates"))}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
