import { PageWrapper } from "@/components/pageWrapper";
import useMetaArgs from "@/hooks/useMeta";
import { useLoaderData } from "react-router";
import CreatePayment from "@/features/payments/components/createPayment";
import { lazy, Suspense } from "react";
const Table = lazy(() => import("@/features/payments/components/table"));

export function Component() {
  useMetaArgs({
    title: "Payments - Clinicare",
    description: "Manage your payments.",
    keywords: "Clinicare, payments, account",
  });
  const { paymentMeta, paymentData } = useLoaderData();
  console.log(paymentData);
  return (
    <PageWrapper>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl">Payments</h1>
          <p className="text-gray-500">Manage your payments</p>
        </div>
        <CreatePayment paymentMeta={paymentMeta} />
      </div>
      <div className="mt-8 space-y-4 rounded-lg border border-gray-300 shadow">
        <div className="flex justify-end items-center p-4">
          {/* <h2 className="hidden md:block font-semibold">Appointments</h2> */}
          <Search id="search-appointments">
            <Filter />
          </Search>
        </div>
        <Suspense fallback={<SkeletonTable />}>
          <Await
            resolve={paymentData?.data?.payments}
            children={(payments) => (
              <Table payments={payments} meta={paymentMeta} />
            )}
          />
        </Suspense>
      </div>
    </PageWrapper>
  );
}

Component.displayName = "Payments";
