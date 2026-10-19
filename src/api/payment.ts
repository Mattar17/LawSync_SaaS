import { apiRequest } from "./client";

export type PlanType = "standard" | "pro";

type PaymentData = {
  sessionUrl: string;
};

export async function CreatePaymentSession(plan: PlanType = "standard") {
  return apiRequest<PaymentData>("/api/payment", {
    method: "POST",
    data: { plan },
  });
}
