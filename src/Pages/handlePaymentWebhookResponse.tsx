//import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PaymentWebhookResponse() {
  const { success } = useParams();
  console.log(useParams());
  console.log(success);
  const isSuccess = success === "true";

  return (
    <div>
      <h1>Payment Status:</h1>
      <p>{isSuccess ? "Successfull payment" : "Failed to Pay!!!"}</p>
    </div>
  );
}
