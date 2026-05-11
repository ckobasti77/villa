import { useAuthActions } from "@convex-dev/auth/react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthPage() {
  const t = useTranslations("Auth")
  const { signIn } = useAuthActions()

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t("signInTitle")}</CardTitle>
          <CardDescription>{t("signInDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => void signIn("google", { redirectTo: "/" })}
          >
            {t("continueWithGoogle")}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => void signIn("apple", { redirectTo: "/" })}
          >
            {t("continueWithApple")}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
