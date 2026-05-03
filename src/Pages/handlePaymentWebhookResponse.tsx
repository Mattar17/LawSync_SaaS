import { useEffect, useState } from "react";

export default function PaymentWebhookResponse() {
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
      <p>{dataObj}</p>
    </div>
  );
}
