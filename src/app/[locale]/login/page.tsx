import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { AuthForm } from "@/components/membership/auth-form";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { googleEnabled } from "@/lib/auth.config";

type Props = { params: { locale: string } };

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "auth.login" });
  return { title: t("title") };
}

export default async function LoginPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("auth.login");

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
            <Suspense>
              <AuthForm mode="login" googleEnabled={googleEnabled} />
            </Suspense>
            <div className="mt-4 text-center text-xs">
              <a href="#" className="text-muted-foreground hover:underline">
                {t("forgot")}
              </a>
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t("noAccount")}{" "}
          <Link
            href="/registro"
            className="font-medium text-primary hover:underline"
          >
            {t("signupLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
