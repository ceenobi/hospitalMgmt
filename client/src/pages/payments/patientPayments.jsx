import { PageWrapper } from "@/components/pageWrapper";
import useMetaArgs from "@/hooks/useMeta";
import { Await, useLoaderData } from "react-router";
import { lazy, Suspense } from "react";
import { SkeletonTable } from "@/components/skeleton";
import Search from "@/components/search";
import Filter from "@/features/payments/components/filter";
const Table = lazy(() =>
  import("@/features/payments/components/patientsTable")
);

export function Component() {
  useMetaArgs({
    title: "Payments - Clinicare",
    description: "Manage your payments.",
    keywords: "Clinicare, payments, account",
  });
  const data = useLoaderData();
  const { meta, payments } = data?.data || {};
  return (
    <PageWrapper>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl">Payments</h1>
          <p className="text-gray-500">Manage your payments</p>
        </div>
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
            resolve={payments}
            children={(payments) => <Table payments={payments} meta={meta} />}
          />
        </Suspense>
      </div>
    </PageWrapper>
  );
}

Component.displayName = "PatientPayments";
