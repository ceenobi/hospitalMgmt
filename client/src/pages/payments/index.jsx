import { PageWrapper } from "@/components/pageWrapper";
import useMetaArgs from "@/hooks/useMeta";
import { Await, useRouteLoaderData } from "react-router";
import CreatePayment from "@/features/payments/components/createPayment";
import { lazy, Suspense } from "react";
import { SkeletonTable } from "@/components/skeleton";
import Search from "@/components/search";
import Filter from "@/features/payments/components/filter";
import Paginate from "@/components/paginate";
import usePaginate from "@/hooks/usePaginate";
const Table = lazy(() => import("@/features/payments/components/table"));

export function Component() {
  useMetaArgs({
    title: "Payments - Clinicare",
    description: "Manage your payments.",
    keywords: "Clinicare, payments, account",
  });
  const { paymentMeta, paymentData } = useRouteLoaderData("payment_data");
  const { handlePageChange, totalPages, hasMore, currentPage, limit } =
    usePaginate({
      totalPages: paymentData?.data?.meta?.totalPages || 1,
      hasMore: paymentData?.data?.meta?.hasMore || false,
      currentPage: paymentData?.data?.meta?.currentPage || 1,
    });
  return (
    <PageWrapper>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl">Payments</h1>
          <p className="text-gray-500">Manage your payments</p>
        </div>
        <CreatePayment paymentMeta={paymentMeta} />
      </div>
      <div className="mt-8 space-y-4 rounded-xl bg-white border border-slate-200 shadow">
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
              <Table payments={payments} />
            )}
          />
        </Suspense>
      </div>
      <Paginate
        totalPages={totalPages}
        hasMore={hasMore}
        handlePageChange={handlePageChange}
        currentPage={currentPage}
        limit={limit}
      />
    </PageWrapper>
  );
}

Component.displayName = "Payments";
