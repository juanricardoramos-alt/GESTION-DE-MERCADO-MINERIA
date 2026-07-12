import type { Plan } from "@/types";

/**
 * Planes de membresía. Nombres, descripciones y características viven en
 * `messages/{es,en}.json` bajo `membership.plans.<id>`.
 */
export const PLANS: Plan[] = [
  { id: "basico", priceMonthlyUsd: 0 },
  { id: "profesional", priceMonthlyUsd: 49, popular: true },
  { id: "corporativo", priceMonthlyUsd: 199 },
];
