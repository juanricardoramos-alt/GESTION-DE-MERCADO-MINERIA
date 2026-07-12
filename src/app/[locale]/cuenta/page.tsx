import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckCircle2, CreditCard, UserRound } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PortalButton } from "@/components/account/portal-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { getViewer } from "@/lib/access";
import { auth } from "@/lib/auth";
import { TIER_PLAN_ID } from "@/lib/constants";
import { formatDate } from "@/lib/formatters";
import { getSubscriptionByUser } from "@/lib/payments/subscription-store";

export const dynamic = "force-dynamic";

type Props = {
  params: { locale: string };
  searchParams: { checkout?: string };
};

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "account" });
  return { title: t("title") };
}

export default async function AccountPage({
  params: { locale },
  searchParams,
}: Props) {
  setRequestLocale(locale);

  const [viewer, session] = await Promise.all([getViewer(), auth()]);
  if (!viewer || !session?.user) redirect(`/${locale}/login`);

  const t = await getTranslations("account");
  const tPlans = await getTranslations("membership.plans");
  const subscription = await getSubscriptionByUser(viewer.id);
  const planName = tPlans(`${TIER_PLAN_ID[viewer.tier]}.name`);

  return (
    <div className="container max-w-3xl py-12 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>

      {searchParams.checkout === "success" ? (
        <p
          className="mt-6 flex items-start gap-2 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800"
          role="status"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {t("checkoutSuccess")}
        </p>
      ) : null}

      <div className="mt-8 space-y-6">
        <Card>
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-primary">
              <UserRound className="h-5 w-5" aria-hidden />
            </span>
            <CardTitle>{t("profileTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-medium">{session.user.name}</p>
            <p className="text-muted-foreground">{session.user.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-primary">
              <CreditCard className="h-5 w-5" aria-hidden />
            </span>
            <CardTitle>{t("planTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground">{t("currentPlan")}</span>
              <Badge>{planName}</Badge>
              {subscription ? (
                <Badge variant="outline">
                  {t(`status.${subscription.status}`)}
                </Badge>
              ) : null}
            </div>

            {subscription?.currentPeriodEnd ? (
              <p className="text-muted-foreground">
                {t(subscription.cancelAtPeriodEnd ? "endsOn" : "renewsOn", {
                  // formatDate espera fecha ISO sin hora (YYYY-MM-DD)
                  date: formatDate(
                    subscription.currentPeriodEnd.toISOString().slice(0, 10),
                    locale,
                  ),
                })}
              </p>
            ) : null}

            {subscription?.providerCustomerId ? (
              <PortalButton />
            ) : (
              <Button asChild>
                <Link href="/membresia">{t("upgrade")}</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
