import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PaymentWebhookResponse() {
  const { success } = useParams();
  const [dataObj, setDataObj] = useState(null);
  useEffect(() => {
    async function getWebhookResponse() {
      const res = await fetch(
        "https://law-sync-activation-api.vercel.app/api/payment/webhook",
        {
          method: "POST",
        },
      );
      const data = await res.json();
      console.log(data);
      setDataObj(data);
    }

    getWebhookResponse();
  }, []);

  return (
    <div>
      <h1>Payment Status:</h1>
      <p>{success ? "Successfull payment" : "Failed to Pay!!!"}</p>
    </div>
  );
}
