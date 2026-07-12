import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { AuthForm } from "@/components/membership/auth-form";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";

type Props = { params: { locale: string } };

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "auth.signup" });
  return { title: t("title") };
}

export default async function SignupPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("auth.signup");

  return (
    <div className="container flex justify-center py-16 sm:py-24">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <AuthForm mode="signup" />
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t("haveAccount")}{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            {t("loginLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
