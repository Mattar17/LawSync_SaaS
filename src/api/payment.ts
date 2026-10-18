import { apiRequest } from "./client";

type PaymentData = {
    sessionUrl:string
}

export async function CreatePaymentSession(){
    return apiRequest<PaymentData>("/api/payment",{
        method:"POST"
    })
}