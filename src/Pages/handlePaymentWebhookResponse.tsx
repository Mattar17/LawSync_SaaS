//import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function PaymentWebhookResponse() {
  const [searchParams] = useSearchParams();
  const isSuccess = searchParams.get("success") === "true";

  return (
    <div>
      <h1>Payment Status:</h1>
      <p>{isSuccess ? "Successfull payment" : "Failed to Pay!!!"}</p>
    </div>
  );
}
