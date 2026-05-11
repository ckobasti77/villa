"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useTranslations, useLocale } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useRef } from "react"
import { toast } from "sonner"
import Image from "next/image"

export default function HostDashboard() {
  const t = useTranslations("HostDashboard")
  const locale = useLocale()
  const user = useQuery(api.users.current)
  const villas = useQuery(api.villas.list, {})
  const createVilla = useMutation(api.villas.create)
  const generateUploadUrl = useMutation(api.villas.generateUploadUrl)

  const [isAdding, setIsAdding] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const imageInput = useRef<HTMLInputElement>(null)

  const myVillas = villas?.filter(v => v.hostId === user?._id)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUploading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const images = imageInput.current?.files

      const imageStorageIds: any[] = []

      if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const postUrl = await generateUploadUrl()
          const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": images[i].type },
            body: images[i],
          })
          const { storageId } = await result.json()
          imageStorageIds.push(storageId)
        }
      }

      await createVilla({
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        pricePerNight: Number(formData.get("pricePerNight")),
        location: formData.get("location") as string,
        bedrooms: Number(formData.get("bedrooms")),
        bathrooms: Number(formData.get("bathrooms")),
        amenities: (formData.get("amenities") as string).split(",").map(a => a.trim()),
        imageStorageIds,
      })

      setIsAdding(false)
      toast.success("Villa created successfully!")
    } catch (error) {
      toast.error("Failed to create villa")
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }

  if (user === undefined) return null

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <Button onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? "Cancel" : t("addVilla")}
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>{t("createTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t("formTitle")}</Label>
                  <Input id="title" name="title" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">{t("formLocation")}</Label>
                  <Input id="location" name="location" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pricePerNight">{t("formPrice")}</Label>
                  <Input id="pricePerNight" name="pricePerNight" type="number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">{t("formBedrooms")}</Label>
                  <Input id="bedrooms" name="bedrooms" type="number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">{t("formBathrooms")}</Label>
                  <Input id="bathrooms" name="bathrooms" type="number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="images">{t("formImages")}</Label>
                  <Input id="images" name="images" type="file" multiple accept="image/*" ref={imageInput} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amenities">{t("formAmenities")}</Label>
                <Input id="amenities" name="amenities" placeholder="WiFi, Pool, AC..." required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t("formDescription")}</Label>
                <Input id="description" name="description" required />
              </div>
              <Button type="submit" disabled={isUploading} className="w-full">
                {isUploading ? t("uploading") : t("submit")}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {myVillas === undefined ? (
        <div className="animate-pulse space-y-4">
          <div className="h-40 bg-muted rounded-xl" />
        </div>
      ) : myVillas.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">
          {t("noVillas")}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myVillas.map(villa => (
            <Card key={villa._id} className="overflow-hidden flex flex-col">
              <div className="relative h-48 bg-muted">
                {villa.imageUrls && villa.imageUrls.length > 0 ? (
                  <Image src={villa.imageUrls[0]!} alt={villa.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">No image</div>
                )}
              </div>
              <CardHeader>
                <CardTitle>{villa.title}</CardTitle>
                <CardDescription>{villa.location}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm font-semibold">{villa.pricePerNight} RSD / night</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
