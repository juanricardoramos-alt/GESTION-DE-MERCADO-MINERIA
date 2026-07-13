import type { PlanAction } from "@/components/membership/plan-cta";
import type { Viewer } from "@/lib/access";
import { TIER_PLAN_ID } from "@/lib/constants";

/**
 * Decide la acción del CTA de cada plan según el estado del viewer
 * (compartido por la portada y la página de membresía).
 */
export function actionForPlan(planId: string, viewer: Viewer | null): PlanAction {
  if (!viewer) return { kind: "signup" };
  const currentPlanId = TIER_PLAN_ID[viewer.tier];
  if (planId === currentPlanId) return { kind: "current" };
  if (planId === "profesional") return { kind: "checkout", tier: "PROFESIONAL" };
  if (planId === "corporativo") return { kind: "checkout", tier: "CORPORATIVO" };
  // Volver al plan gratuito se gestiona cancelando desde el portal.
  return { kind: "manage" };
}
