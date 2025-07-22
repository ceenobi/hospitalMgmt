import { PageWrapper } from "@/components/pageWrapper";
import useMetaArgs from "@/hooks/useMeta";
import { useLoaderData } from "react-router";
import CreatePayment from "@/features/payments/components/createPayment";

export function Component() {
  useMetaArgs({
    title: "Payments - Clinicare",
    description: "Manage your payments.",
    keywords: "Clinicare, payments, account",
  });
  const { paymentMeta } = useLoaderData();
  console.log(paymentMeta);
  return (
    <PageWrapper>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl">Payments</h1>
          <p className="text-gray-500">Manage your payments</p>
        </div>
          <CreatePayment paymentMeta={paymentMeta} />
      </div>
    </PageWrapper>
  );
}

Component.displayName = "Payments";
